import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

const missingConfigError = {
  message: 'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Add them in Vercel Environment Variables.',
};

const createDisabledQuery = () => {
  const query = {
    select: () => query,
    order: () => query,
    range: () => query,
    ilike: () => query,
    eq: () => query,
    then: (resolve: (value: unknown) => void) =>
      Promise.resolve({ data: null, count: 0, error: missingConfigError }).then(resolve),
  };

  return query;
};

const createDisabledSupabase = () =>
  ({
    from: () => createDisabledQuery(),
  }) as unknown as SupabaseClient;

export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createDisabledSupabase();
