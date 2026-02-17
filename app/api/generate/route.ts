import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/claude';
import { getApiKey, withCors, corsOptionsResponse } from '@/lib/api-auth';
import type { GenerateRequest } from '@/lib/types';

export async function OPTIONS() {
  return corsOptionsResponse();
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = getApiKey(request);
    const body = (await request.json()) as GenerateRequest;

    if (!body.topic?.trim()) {
      return withCors(NextResponse.json({ error: '주제를 입력해주세요.' }, { status: 400 }));
    }

    if (!body.category) {
      return withCors(NextResponse.json({ error: '콘텐츠 유형을 선택해주세요.' }, { status: 400 }));
    }

    if (!apiKey) {
      return withCors(NextResponse.json(
        { error: 'API 키가 필요합니다. X-API-Key 헤더 또는 서버에 ANTHROPIC_API_KEY를 설정하세요.' },
        { status: 401 }
      ));
    }

    const result = await generateContent(body, apiKey);
    return withCors(NextResponse.json(result));
  } catch (error) {
    console.error('Content generation error:', error);
    return withCors(NextResponse.json(
      { error: error instanceof Error ? error.message : '콘텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    ));
  }
}
