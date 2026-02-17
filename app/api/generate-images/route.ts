import { NextRequest, NextResponse } from 'next/server';
import { generateContentImages } from '@/lib/gemini-image';

export async function POST(request: NextRequest) {
  try {
    const { content, title, geminiApiKey } = await request.json();

    if (!content || !title) {
      return NextResponse.json({ error: '콘텐츠와 제목이 필요합니다.' }, { status: 400 });
    }

    // 클라이언트에서 전달된 키 우선 사용, 없으면 서버 환경변수
    const apiKey = geminiApiKey || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API 키가 설정되지 않았습니다. 상단 API Key 버튼에서 Gemini 키를 입력해주세요.' },
        { status: 400 }
      );
    }

    const images = await generateContentImages(content, title, apiKey);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : '이미지 생성 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
