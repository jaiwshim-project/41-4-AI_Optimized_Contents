import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { apiKey, geminiApiKey } = await request.json();

    // Anthropic API Key 처리
    if (apiKey !== undefined) {
      if (apiKey && !apiKey.startsWith('sk-ant-')) {
        return NextResponse.json(
          { error: 'sk-ant- 로 시작하는 유효한 Anthropic API Key를 입력해주세요.' },
          { status: 400 }
        );
      }
      if (apiKey) {
        process.env.ANTHROPIC_API_KEY = apiKey;
      }
    }

    // Gemini API Key 처리 (접두사 검증 제거 - 다양한 형식 허용)
    if (geminiApiKey !== undefined) {
      if (!geminiApiKey || geminiApiKey.trim().length < 10) {
        return NextResponse.json(
          { error: '유효한 Gemini API Key를 입력해주세요.' },
          { status: 400 }
        );
      }
      process.env.GEMINI_API_KEY = geminiApiKey;
    }

    // 로컬 개발 환경에서만 .env.local 파일에 저장 시도
    try {
      const envPath = join(process.cwd(), '.env.local');
      let envContent = '';
      try {
        envContent = await readFile(envPath, 'utf-8');
      } catch {
        // 파일이 없으면 새로 생성
      }

      const lines = envContent.split('\n');

      if (apiKey) {
        const keyLineIndex = lines.findIndex(line => line.startsWith('ANTHROPIC_API_KEY='));
        if (keyLineIndex >= 0) {
          lines[keyLineIndex] = `ANTHROPIC_API_KEY=${apiKey}`;
        } else {
          lines.push(`ANTHROPIC_API_KEY=${apiKey}`);
        }
      }

      if (geminiApiKey) {
        const geminiLineIndex = lines.findIndex(line => line.startsWith('GEMINI_API_KEY='));
        if (geminiLineIndex >= 0) {
          lines[geminiLineIndex] = `GEMINI_API_KEY=${geminiApiKey}`;
        } else {
          lines.push(`GEMINI_API_KEY=${geminiApiKey}`);
        }
      }

      await writeFile(envPath, lines.join('\n').trim() + '\n', 'utf-8');
    } catch {
      // Vercel 등 서버리스 환경에서는 파일 쓰기 불가 - 런타임 메모리에만 저장됨
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API Key 저장 오류:', error);
    return NextResponse.json({ error: 'API Key 저장에 실패했습니다.' }, { status: 500 });
  }
}

export async function GET() {
  const hasKey = !!process.env.ANTHROPIC_API_KEY;
  const hasGeminiKey = !!process.env.GEMINI_API_KEY;
  return NextResponse.json({ hasKey, hasGeminiKey });
}
