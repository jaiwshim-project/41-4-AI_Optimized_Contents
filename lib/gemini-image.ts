import { GoogleGenAI } from '@google/genai';

const IMAGE_MODELS = [
  'gemini-2.5-flash-image',
  'gemini-3-pro-image-preview',
  'gemini-2.5-flash-preview-04-17',
  'gemini-2.0-flash-exp-image-generation',
];

export async function generateContentImages(
  content: string,
  title: string,
  apiKey: string
): Promise<string[]> {

  const ai = new GoogleGenAI({ apiKey });

  const contentSummary = content.substring(0, 500);

  const prompts = [
    `Create a clean, modern infographic summarizing the key points of "${title}". Use a vertical layout with icons, visual hierarchy, section dividers, and a blue-to-indigo color scheme. Include visual representations of data or concepts using charts, icons, and diagrams. No text or letters in the image.`,
    `Create a professional step-by-step process infographic related to: ${contentSummary.substring(0, 200)}. Use numbered visual steps with connecting arrows or flow lines, icons for each step, and a warm gradient color scheme (orange to amber). No text or letters in the image.`,
    `Create a data-driven infographic highlighting key statistics and important points about "${title}". Use pie charts, bar graphs, percentage circles, comparison visuals, and icon-based data points. Use a green-to-teal color scheme with clean modern design. No text or letters in the image.`,
  ];

  const images: string[] = [];
  const errors: string[] = [];

  // 작동하는 모델 찾기
  let workingModel: string | null = null;

  for (const modelName of IMAGE_MODELS) {
    try {
      console.log(`[Gemini Image] Trying model: ${modelName}`);
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
            console.log(`[Gemini Image] Success with model: ${modelName}`);
            break;
          }
        }
      }
      if (workingModel) break;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${modelName}: ${msg}`);
      console.error(`[Gemini Image] Model ${modelName} failed:`, msg);
    }
  }

  if (!workingModel) {
    const detail = errors.length > 0 ? `\n시도한 모델 오류:\n${errors.join('\n')}` : '';
    throw new Error(`이미지 생성에 실패했습니다. Gemini API 키를 확인하고 Google AI Studio에서 이미지 생성이 가능한지 확인해주세요.${detail}`);
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
      console.error('[Gemini Image] Failed for prompt:', err);
    }
  }

  return images;
}
