import { z } from 'zod';

/**
 * Basic JSON validation
 */
export function validateJson(jsonString: string): { valid: boolean; error?: string } {
  try {
    JSON.parse(jsonString);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

/**
 * Example schema validator for tome.json
 * You can customize this based on your expected tome.json structure
 */
export const TomeJsonSchema = z.object({
  name: z.string().optional(),
  version: z.string().optional(),
  description: z.string().optional(),
  author: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
}).passthrough(); // Allow additional properties

/**
 * Validate tome.json against a schema
 */
export function validateTomeJsonSchema(jsonString: string): {
  valid: boolean;
  error?: string;
  data?: unknown;
} {
  try {
    const parsed = JSON.parse(jsonString);
    const result = TomeJsonSchema.safeParse(parsed);

    if (result.success) {
      return { valid: true, data: result.data };
    } else {
      return {
        valid: false,
        error: result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', '),
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}
