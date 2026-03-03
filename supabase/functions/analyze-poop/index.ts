// @ts-nocheck
// deno-lint-ignore-file no-explicit-any
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import OpenAI from 'https://esm.sh/openai@4.56.0';

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

if (!openaiApiKey) {
  console.warn('[analyze-poop] OPENAI_API_KEY is not set');
}

const openai = new OpenAI({ apiKey: openaiApiKey });

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

  // Hard safety rules agreed for MVP
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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  if (req.method !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed' });
  }

  if (!openaiApiKey) {
    return jsonResponse(500, { error: 'Server is missing OPENAI_API_KEY' });
  }

  try {
    const body = await req.json();
    const imageBase64 = body?.imageBase64;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return jsonResponse(400, { error: 'imageBase64 is required' });
    }

    const prompt = `You are a clinical gastroenterology vision assistant.
Analyze this stool image and return STRICT JSON only.

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
- warning_detail: concise reason if warning=true

Safety:
- Do not diagnose disease.
- If image is unclear or not stool, set warning=true and warning_detail appropriately.

Output JSON schema exactly:
{
  "bristol_type": 1,
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

    const response = await openai.responses.create({
      model: 'gpt-4o',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: prompt },
            {
              type: 'input_image',
              image_url: `data:image/jpeg;base64,${imageBase64}`,
              detail: 'high',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'poop_analysis_result',
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              bristol_type: { type: 'integer', minimum: 1, maximum: 7 },
              color: { type: 'string', enum: ['brown', 'green', 'black', 'red', 'yellow', 'pale'] },
              color_status: { type: 'string', enum: ['normal', 'attention', 'warning'] },
              fragmentation: { type: 'string', enum: ['none', 'mild', 'moderate', 'severe'] },
              edge_fuzziness: { type: 'string', enum: ['sharp', 'moderate', 'fuzzy'] },
              volume: { type: 'string', enum: ['small', 'medium', 'large'] },
              gut_score: { type: 'integer', minimum: 0, maximum: 100 },
              health_insight: { type: 'string', minLength: 1, maxLength: 240 },
              humor_comment: { type: 'string', minLength: 1, maxLength: 240 },
              warning: { type: 'boolean' },
              warning_detail: { type: 'string', maxLength: 240 },
            },
            required: [
              'bristol_type',
              'color',
              'color_status',
              'fragmentation',
              'edge_fuzziness',
              'volume',
              'gut_score',
              'health_insight',
              'humor_comment',
              'warning',
              'warning_detail',
            ],
          },
          strict: true,
        },
      },
    });

    const outputText = response.output_text;
    const parsed = JSON.parse(outputText);

    if (!validateAnalysisResult(parsed)) {
      return jsonResponse(502, {
        error: 'Model output validation failed',
      });
    }

    const safeResult = applySafetyOverrides(parsed);

    return jsonResponse(200, safeResult);
  } catch (error) {
    console.error('[analyze-poop] error', error);
    return jsonResponse(500, {
      error: 'Failed to analyze image',
    });
  }
});
