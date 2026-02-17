import { NextRequest, NextResponse } from 'next/server';

/**
 * Extract Anthropic API key from request.
 * Priority: X-API-Key header > Authorization Bearer > process.env
 */
export function getApiKey(request: NextRequest): string | undefined {
  const xApiKey = request.headers.get('X-API-Key');
  if (xApiKey) return xApiKey;

  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  return process.env.ANTHROPIC_API_KEY;
}

/**
 * Extract Gemini API key from request.
 * Priority: X-Gemini-Key header > body.geminiApiKey > process.env
 */
export function getGeminiKey(request: NextRequest, body?: Record<string, unknown>): string | undefined {
  const headerKey = request.headers.get('X-Gemini-Key');
  if (headerKey) return headerKey;

  if (body && typeof body.geminiApiKey === 'string') return body.geminiApiKey;

  return process.env.GEMINI_API_KEY;
}

/**
 * Add CORS headers to a response for external API access.
 */
export function withCors(response: NextResponse): NextResponse {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, X-Gemini-Key, Authorization');
  return response;
}

/**
 * Create a standard OPTIONS response for CORS preflight.
 */
export function corsOptionsResponse(): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return withCors(response);
}
