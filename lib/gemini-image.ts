import { GoogleGenAI } from '@google/genai';

const IMAGE_MODELS = [
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.0-flash-exp-image-generation',
  'gemini-2.0-flash-exp',
];

export async function generateContentImages(
  content: string,
  title: string
): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API 키가 설정되지 않았습니다. API Key 설정에서 Gemini 키를 입력해주세요.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const contentSummary = content.substring(0, 500);

  const prompts = [
    `Create a clean, modern, professional infographic-style illustration for a blog article titled "${title}". The image should represent the main concept visually with icons and minimal text. Use a blue and white color scheme. No text or letters in the image.`,
    `Create a visually appealing, professional diagram or concept map illustration related to: ${contentSummary.substring(0, 200)}. Use warm, inviting colors with a clean modern design. No text or letters in the image.`,
    `Create a professional, eye-catching hero image for digital marketing content about "${title}". Use a gradient background with abstract geometric shapes and relevant visual metaphors. No text or letters in the image.`,
  ];

  const images: string[] = [];

  // 작동하는 모델 찾기
  let workingModel: string | null = null;

  for (const modelName of IMAGE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompts[0],
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            images.push(dataUrl);
            workingModel = modelName;
            break;
          }
        }
      }
      if (workingModel) break;
    } catch (err) {
      console.error(`Model ${modelName} failed, trying next...`, err);
    }
  }

  if (!workingModel) {
    throw new Error('이미지 생성에 실패했습니다. Gemini API 키와 모델 접근 권한을 확인해주세요.');
  }

  // 나머지 프롬프트로 이미지 생성
  for (let i = 1; i < prompts.length; i++) {
    try {
      const response = await ai.models.generateContent({
        model: workingModel,
        contents: prompts[i],
        config: {
          responseModalities: ['IMAGE', 'TEXT'],
        },
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const dataUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            images.push(dataUrl);
            break;
          }
        }
      }
    } catch (err) {
      console.error('Image generation failed for prompt:', err);
    }
  }

  return images;
}
