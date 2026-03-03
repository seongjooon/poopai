import { z } from 'zod';

export const stoolColorSchema = z.enum([
  'brown',
  'green',
  'black',
  'red',
  'yellow',
  'pale',
]);

export const colorStatusSchema = z.enum(['normal', 'attention', 'warning']);
export const fragmentationSchema = z.enum(['none', 'mild', 'moderate', 'severe']);
export const edgeFuzzinessSchema = z.enum(['sharp', 'moderate', 'fuzzy']);
export const volumeSchema = z.enum(['small', 'medium', 'large']);

export const analysisResultSchema = z.object({
  bristol_type: z.number().int().min(1).max(7),
  color: stoolColorSchema,
  color_status: colorStatusSchema,
  fragmentation: fragmentationSchema,
  edge_fuzziness: edgeFuzzinessSchema,
  volume: volumeSchema,
  gut_score: z.number().int().min(0).max(100),
  health_insight: z.string().min(1).max(240),
  humor_comment: z.string().min(1).max(240),
  warning: z.boolean(),
  warning_detail: z.string().max(240).optional(),
});

export type StoolColor = z.infer<typeof stoolColorSchema>;
export type ColorStatus = z.infer<typeof colorStatusSchema>;
export type Fragmentation = z.infer<typeof fragmentationSchema>;
export type EdgeFuzziness = z.infer<typeof edgeFuzzinessSchema>;
export type Volume = z.infer<typeof volumeSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export function parseAnalysisResult(input: unknown): AnalysisResult {
  return analysisResultSchema.parse(input);
}
