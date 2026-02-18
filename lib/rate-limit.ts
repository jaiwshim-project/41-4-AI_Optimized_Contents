import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// 메모리 기반 rate limit 저장소 (서버리스 인스턴스별 독립)
const store = new Map<string, RateLimitEntry>();

// 오래된 엔트리 정리 (메모리 누수 방지)
let lastCleanup = Date.now();
function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return; // 1분마다 정리
  lastCleanup = now;
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}

/**
 * IP 기반 Rate Limiter
 * @param request - NextRequest 객체
 * @param limit - 허용 요청 수
 * @param windowMs - 시간 윈도우 (밀리초)
 * @returns null이면 허용, NextResponse이면 차단
 */
export function rateLimit(
  request: NextRequest,
  limit: number,
  windowMs: number
): NextResponse | null {
  cleanup();

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown';

  const pathname = request.nextUrl.pathname;
  const key = `${ip}:${pathname}`;
  const now = Date.now();

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // 새 윈도우 시작
    store.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return NextResponse.json(
      { error: '요청이 너무 많습니다. 잠시 후 다시 시도해주세요.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(entry.resetAt),
        },
      }
    );
  }

  return null;
}

/**
 * AI API 라우트용 rate limit (분당 10회)
 */
export function rateLimitAI(request: NextRequest): NextResponse | null {
  return rateLimit(request, 10, 60_000);
}

/**
 * 일반 API 라우트용 rate limit (분당 30회)
 */
export function rateLimitGeneral(request: NextRequest): NextResponse | null {
  return rateLimit(request, 30, 60_000);
}
