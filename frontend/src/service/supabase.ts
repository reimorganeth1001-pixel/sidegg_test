import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Supabase Auth/REST expects https://<project-ref>.supabase.co — not the Postgres URL.
 * If .env mistakenly uses postgresql://...@db.<ref>.supabase.co, we derive the API URL.
 */
export function resolveSupabaseUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL is missing. Use https://<project-ref>.supabase.co from Supabase → Project Settings → API.',
    );
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed.replace(/\/$/, '');
  }

  const fromDbHost = trimmed.match(/db\.([a-z0-9-]+)\.supabase\.co/i);
  if (fromDbHost) {
    return `https://${fromDbHost[1]}.supabase.co`;
  }

  throw new Error(
    'Invalid NEXT_PUBLIC_SUPABASE_URL. Use the Project URL from Supabase → Settings → API (https://<ref>.supabase.co), not the database connection string.',
  );
}

function createSupabaseClient(): SupabaseClient {
  const url = resolveSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || '');
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!anonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is missing.');
  }
  return createClient(url, anonKey);
}

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createSupabaseClient();
  }
  return client;
}

/** @deprecated Prefer getSupabase() — kept for existing imports */
export const supabase = getSupabase();
