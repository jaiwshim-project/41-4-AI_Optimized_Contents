import { GoogleGenerativeAI } from '@google/generative-ai';

export async function generateContentImages(
  content: string,
  title: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. API Key 설정에서 Gemini 키를 입력해주세요.');
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // 콘텐츠에서 핵심 키워드/주제 추출하여 3개 프롬프트 생성
  const contentSummary = content.substring(0, 500);

  const prompts = [
    `Create a clean, modern, professional infographic-style illustration for a blog article titled "${title}". The image should represent the main concept visually with icons and minimal text. Use a blue and white color scheme. No text or letters in the image.`,
    `Create a visually appealing, professional diagram or concept map illustration related to: ${contentSummary.substring(0, 200)}. Use warm, inviting colors with a clean modern design. No text or letters in the image.`,
    `Create a professional, eye-catching hero image for digital marketing content about "${title}". Use a gradient background with abstract geometric shapes and relevant visual metaphors. No text or letters in the image.`,
  ];

  const images: string[] = [];

  for (const prompt of prompts) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
          responseModalities: ['IMAGE', 'TEXT'],
        } as Record<string, unknown>,
      });

      const result = await model.generateContent(prompt);
      const response = result.response;
      const candidate = response.candidates?.[0];

      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            images.push(dataUrl);
            break;
          }
        }
      }
    } catch (err) {
      console.error('Image generation failed for prompt:', err);
      // 실패한 이미지는 건너뛰고 계속
    }
  }

  if (images.length === 0) {
    throw new Error('이미지 생성에 실패했습니다. Gemini API 키와 모델 접근 권한을 확인해주세요.');
  }

  return images;
}
