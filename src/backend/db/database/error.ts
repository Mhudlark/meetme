import type { PostgrestError } from '@supabase/supabase-js';

export const checkSupabaseErrorResponse = (
  errorResponse: PostgrestError | null
) => {
  if (errorResponse !== null)
    throw new Error(
      `${errorResponse.message} ============= 
      ${errorResponse.hint} ============= 
      ${errorResponse.details}`
    );
};
