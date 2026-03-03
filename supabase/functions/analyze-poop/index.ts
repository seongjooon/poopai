// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

if (!geminiApiKey) {
  console.warn('[analyze-poop] GEMINI_API_KEY is not set');
}

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

const allowedColors = new Set(['brown', 'green', 'black', 'red', 'yellow', 'pale']);
const allowedColorStatus = new Set(['normal', 'attention', 'warning']);
const allowedFragmentation = new Set(['none', 'mild', 'moderate', 'severe']);
const allowedEdgeFuzziness = new Set(['sharp', 'moderate', 'fuzzy']);
const allowedVolume = new Set(['small', 'medium', 'large']);

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    },
  });
}

function validateAnalysisResult(data: any) {
  if (!data || typeof data !== 'object') return false;
  if (!Number.isInteger(data.bristol_type) || data.bristol_type < 1 || data.bristol_type > 7) return false;
  if (!allowedColors.has(data.color)) return false;
  if (!allowedColorStatus.has(data.color_status)) return false;
  if (!allowedFragmentation.has(data.fragmentation)) return false;
  if (!allowedEdgeFuzziness.has(data.edge_fuzziness)) return false;
  if (!allowedVolume.has(data.volume)) return false;
  if (!Number.isInteger(data.gut_score) || data.gut_score < 0 || data.gut_score > 100) return false;
  if (typeof data.health_insight !== 'string' || data.health_insight.length === 0) return false;
  if (typeof data.humor_comment !== 'string' || data.humor_comment.length === 0) return false;
  if (typeof data.warning !== 'boolean') return false;
  if (data.warning_detail !== undefined && typeof data.warning_detail !== 'string') return false;
  return true;
}

function applySafetyOverrides(data: any) {
  const result = { ...data };

  if (result.color === 'black') {
    result.warning = true;
    result.color_status = 'warning';
    result.warning_detail =
      result.warning_detail ||
      'Black stool can be a warning sign. Consider prompt medical evaluation.';
  }

  if (result.color === 'red') {
    result.warning = true;
    result.color_status = 'warning';
    result.warning_detail =
      result.warning_detail ||
      'Red stool can indicate possible bleeding. Consider prompt medical evaluation.';
  }

  return result;
}

const prompt = `You are a clinical gastroenterology vision assistant.
Analyze this stool image and return STRICT JSON only. No markdown, no code fences, just raw JSON.

Clinical dimensions (based on validated stool-assessment criteria):
1) Bristol Stool Scale (1-7)
2) Color (brown/green/black/red/yellow/pale)
3) Fragmentation (none/mild/moderate/severe)
4) Edge fuzziness (sharp/moderate/fuzzy)
5) Volume (small/medium/large)

Also output:
- color_status: normal | attention | warning
- gut_score: integer 0-100
- health_insight: one concise actionable sentence (non-diagnostic)
- humor_comment: one respectful, light humorous sentence
- warning: boolean
- warning_detail: concise reason if warning=true, empty string if false

Safety:
- Do not diagnose disease.
- If image is unclear or not stool, set warning=true and warning_detail appropriately.

Output JSON schema exactly:
{
  "bristol_type": 4,
  "color": "brown",
  "color_status": "normal",
  "fragmentation": "mild",
  "edge_fuzziness": "moderate",
  "volume": "medium",
  "gut_score": 78,
  "health_insight": "Increase hydration slightly to support smoother bowel movements.",
  "humor_comment": "Your gut delivered a solid performance today.",
  "warning": false,
  "warning_detail": ""
}`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!geminiApiKey) {
    return jsonResponse(500, { error: 'Server is missing GEMINI_API_KEY' });
  }

  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return jsonResponse(400, { error: 'imageBase64 is required' });
    }

    const geminiBody = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: 'image/jpeg',
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    };

    const res = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[analyze-poop] Gemini API error', res.status, errText);
      return jsonResponse(502, {
        error: 'Gemini API error',
        detail: `${res.status}: ${errText.slice(0, 200)}`,
      });
    }

    const geminiRes = await res.json();
    const outputText = geminiRes?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

    // Strip markdown fences if present
    const cleaned = outputText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    if (!validateAnalysisResult(parsed)) {
      return jsonResponse(502, {
        error: 'Model output validation failed',
        detail: JSON.stringify(parsed).slice(0, 300),
      });
    }

    const safeResult = applySafetyOverrides(parsed);

    return jsonResponse(200, safeResult);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error('[analyze-poop] error', errMsg);
    return jsonResponse(500, {
      error: 'Failed to analyze image',
      detail: errMsg,
    });
  }
});
