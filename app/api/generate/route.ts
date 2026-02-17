import { NextRequest, NextResponse } from 'next/server';
import { generateContent } from '@/lib/claude';
import type { GenerateRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.topic?.trim()) {
      return NextResponse.json({ error: '주제를 입력해주세요.' }, { status: 400 });
    }

    if (!body.category) {
      return NextResponse.json({ error: '콘텐츠 유형을 선택해주세요.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: '콘텐츠 생성 기능을 사용하려면 ANTHROPIC_API_KEY가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await generateContent(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '콘텐츠 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
