import { NextRequest, NextResponse } from 'next/server';
import type { OptimizeRequest } from '@/lib/types';
import { optimizeContent } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as OptimizeRequest;

    if (!body.originalContent || body.originalContent.trim().length === 0) {
      return NextResponse.json({ error: '원본 콘텐츠가 필요합니다.' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI 최적화 변환 기능을 사용하려면 ANTHROPIC_API_KEY가 필요합니다.' },
        { status: 400 }
      );
    }

    const result = await optimizeContent(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('최적화 변환 오류:', error);
    return NextResponse.json({ error: '콘텐츠 최적화 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
