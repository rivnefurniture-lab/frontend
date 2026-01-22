import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error_param = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';
  const origin = requestUrl.origin;

  // If there's an error from the OAuth provider
  if (error_param) {
    return NextResponse.redirect(`${origin}/auth?error=${error_param}&message=${encodeURIComponent(error_description || '')}`);
  }

  if (code) {
    // Create response object first so we can set cookies on it
    const response = NextResponse.redirect(`${origin}${next}`);
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      return response;
    }
    
    return NextResponse.redirect(`${origin}/auth?error=exchange_failed&message=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/auth?error=no_code`);
}
