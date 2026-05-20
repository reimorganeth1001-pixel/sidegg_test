import type { AuthError, Provider } from '@supabase/supabase-js';

/** Supabase Auth provider for X login (OAuth 2.0). Legacy name was `twitter`. */
export const SUPABASE_OAUTH_PROVIDER = (process.env.NEXT_PUBLIC_SUPABASE_OAUTH_PROVIDER ||
  'x') as Provider;

export function getOAuthRedirectUrl(): string {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3113').replace(
    /\/$/,
    '',
  );
  return `${base}/auth/callback`;
}

export function formatSupabaseAuthError(error: AuthError): string {
  const msg = error.message || 'Authentication failed';
  if (
    msg.includes('provider is not enabled') ||
    error.error_code === 'validation_failed'
  ) {
    return (
      'X login is not enabled in Supabase. Open your project → Authentication → ' +
      'Sign In / Providers → X / Twitter (OAuth 2.0), turn it ON, and add your X app ' +
      'Client ID & Secret. Also add redirect URL: ' +
      getOAuthRedirectUrl()
    );
  }
  return msg;
}
