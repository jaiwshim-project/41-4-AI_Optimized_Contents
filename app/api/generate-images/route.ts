import { NextRequest, NextResponse } from 'next/server';
import { generateContentImages } from '@/lib/gemini-image';

export async function POST(request: NextRequest) {
  try {
    const { content, title } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: '콘텐츠와 제목이 필요합니다.' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API 키가 설정되지 않았습니다. API Key 설정에서 Gemini 키를 입력해주세요.' },
        { status: 400 }
      );
    }

    const images = await generateContentImages(content, title);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
