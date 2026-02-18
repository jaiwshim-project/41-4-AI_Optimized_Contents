import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { rateLimitAI, rateLimitGeneral } from './rate-limit';

// AI 기능 API (분당 10회 제한)
const AI_ROUTES = ['/api/generate', '/api/analyze', '/api/optimize', '/api/keyword-analysis', '/api/generate-series', '/api/convert-content', '/api/generate-images', '/api/webhook'];

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API 라우트는 세션 체크/리다이렉트 건너뛰기 (헤더 기반 인증 사용)
  if (pathname.startsWith('/api/')) {
    // Rate Limiting 적용
    const isAIRoute = AI_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
    const rateLimited = isAIRoute ? rateLimitAI(request) : rateLimitGeneral(request);
    if (rateLimited) return rateLimited;

    const response = NextResponse.next({ request });
    const origin = request.headers.get('origin') || '';
    const allowedOrigins = [
      'https://aio-geo-optimizer.vercel.app',
      'https://ai-optimized-contents.vercel.app',
      'https://41-4-ai-optimized-contents.vercel.app',
      process.env.NEXT_PUBLIC_SITE_URL,
    ].filter(Boolean);
    const allowed = allowedOrigins.includes(origin) || origin.startsWith('http://localhost:');
    response.headers.set('Access-Control-Allow-Origin', allowed ? origin : allowedOrigins[0]!);
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Gemini-Key, Authorization');
    response.headers.set('Vary', 'Origin');
    return response;
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 보호 대상 경로
  const protectedPaths = ['/analyze', '/generate', '/dashboard', '/keyword-analysis', '/series', '/mypage'];
  const isProtected = protectedPaths.some(
    (path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(path + '/')
  );

  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  // 이미 로그인한 사용자가 login/signup 접근 시 홈으로
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
