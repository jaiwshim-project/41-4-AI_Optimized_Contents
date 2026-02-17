import type { AnalysisResponse } from './types';

/**
 * Claude API 키가 없을 때 사용하는 규칙 기반 분석 (Mock/Fallback)
 */
export function generateMockAnalysis(content: string, targetKeyword?: string): AnalysisResponse {
  const wordCount = content.length;
  const hasHeadings = /#{1,6}\s|<h[1-6]>/i.test(content);
  const hasList = /[-*]\s|<[uo]l>/i.test(content);
  const hasFAQ = /\?|질문|답변|FAQ/i.test(content);
  const hasNumbers = /\d+%|\d+개|\d+가지|통계|데이터/i.test(content);
  const hasQuotes = /"|"|인용|출처|참고/i.test(content);
  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;

  // 기본 점수 계산
  let structuredAnswer = 40;
  if (hasHeadings) structuredAnswer += 20;
  if (hasList) structuredAnswer += 15;
  if (hasFAQ) structuredAnswer += 15;
  if (paragraphs >= 3) structuredAnswer += 10;

  let clarity = Math.min(100, 50 + (wordCount > 200 ? 15 : 0) + (wordCount < 5000 ? 15 : 0) + (hasHeadings ? 20 : 0));
  let citability = 30 + (hasNumbers ? 25 : 0) + (hasQuotes ? 20 : 0) + (hasList ? 15 : 0);
  let aiOverviewProbability = Math.round((structuredAnswer + clarity + citability) / 4);

  const aioTotal = Math.round((structuredAnswer + clarity + citability + aiOverviewProbability) / 4);

  // GEO 점수
  const aiSearchFriendliness = Math.min(100, 40 + (hasHeadings ? 20 : 0) + (hasList ? 15 : 0) + (wordCount > 300 ? 15 : 0));
  const experience = hasNumbers ? 60 : 35;
  const expertise = wordCount > 500 ? 55 : 35;
  const authoritativeness = hasQuotes ? 55 : 30;
  const trustworthiness = hasNumbers && hasQuotes ? 60 : 35;
  const structuredData = hasHeadings && hasList ? 65 : 30;
  const semanticCompleteness = Math.min(100, 30 + paragraphs * 8);
  const geoTotal = Math.round((aiSearchFriendliness + (experience + expertise + authoritativeness + trustworthiness) / 4 + structuredData + semanticCompleteness) / 4);

  // 키워드 분석
  const words = content.toLowerCase().split(/\s+/);
  const wordFreq: Record<string, number> = {};
  for (const w of words) {
    if (w.length > 1) wordFreq[w] = (wordFreq[w] || 0) + 1;
  }
  const sorted = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);

  const primaryKeywords = sorted.map(([keyword, count]) => ({
    keyword,
    count,
    density: Math.round((count / words.length) * 100 * 10) / 10,
    prominence: (count > 5 ? 'high' : count > 2 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
  }));

  const overallScore = Math.round((aioTotal + geoTotal) / 2);

  // 개선 제안 생성
  const recommendations = [];
  if (!hasHeadings) {
    recommendations.push({
      id: 'rec-1', priority: 'high' as const, category: 'structure' as const,
      title: '헤딩 태그 추가', description: '콘텐츠에 H2, H3 등 헤딩 태그를 추가하여 구조화하세요.',
      before: '일반 텍스트로만 작성된 콘텐츠', after: '## 주요 섹션\n내용...\n### 하위 섹션\n내용...',
      expectedImpact: 'AI Overview 노출 확률 15-20% 향상'
    });
  }
  if (!hasList) {
    recommendations.push({
      id: 'rec-2', priority: 'high' as const, category: 'aio' as const,
      title: '리스트 형식 활용', description: '핵심 포인트를 불릿 리스트나 번호 리스트로 정리하세요.',
      expectedImpact: 'AI 인용 가능성 20% 향상'
    });
  }
  if (!hasFAQ) {
    recommendations.push({
      id: 'rec-3', priority: 'medium' as const, category: 'aio' as const,
      title: 'FAQ 섹션 추가', description: '관련 질문과 답변을 FAQ 형식으로 추가하세요.',
      expectedImpact: 'AI Overview 직접 답변 채택 확률 증가'
    });
  }
  if (!hasNumbers) {
    recommendations.push({
      id: 'rec-4', priority: 'medium' as const, category: 'geo' as const,
      title: '통계/데이터 인용 추가', description: '구체적인 수치, 통계, 데이터를 포함하여 신뢰성을 높이세요.',
      expectedImpact: 'E-E-A-T 신호 강화, 인용 가능성 25% 향상'
    });
  }
  if (wordCount < 300) {
    recommendations.push({
      id: 'rec-5', priority: 'high' as const, category: 'content' as const,
      title: '콘텐츠 분량 확대', description: '최소 500자 이상으로 콘텐츠를 확장하여 의미적 완성도를 높이세요.',
      expectedImpact: 'AI 검색엔진 인덱싱 확률 향상'
    });
  }
  if (!hasQuotes) {
    recommendations.push({
      id: 'rec-6', priority: 'low' as const, category: 'geo' as const,
      title: '출처 및 인용 추가', description: '신뢰할 수 있는 출처를 인용하여 콘텐츠 권위성을 높이세요.',
      expectedImpact: '권위성(Authoritativeness) 점수 향상'
    });
  }

  return {
    overallScore,
    aio: {
      total: aioTotal,
      structuredAnswer: Math.min(100, structuredAnswer),
      clarity,
      citability: Math.min(100, citability),
      aiOverviewProbability,
      details: [
        { category: '구조화된 답변', score: Math.min(100, structuredAnswer), description: hasFAQ ? 'FAQ 형식이 감지되었습니다.' : '구조화된 답변 형식이 부족합니다.', suggestions: hasFAQ ? [] : ['FAQ 섹션을 추가하세요', 'How-to 가이드 형식을 활용하세요'] },
        { category: '명확성', score: clarity, description: hasHeadings ? '헤딩을 통한 구조화가 잘 되어있습니다.' : '콘텐츠 구조화가 필요합니다.', suggestions: hasHeadings ? [] : ['H2, H3 태그로 섹션을 나누세요'] },
        { category: '인용 가능성', score: Math.min(100, citability), description: hasNumbers ? '데이터/통계가 포함되어 있습니다.' : '구체적인 데이터가 부족합니다.', suggestions: hasNumbers ? [] : ['구체적인 수치를 포함하세요'] },
      ]
    },
    geo: {
      total: geoTotal,
      aiSearchFriendliness,
      eeat: { experience, expertise, authoritativeness, trustworthiness },
      structuredData,
      semanticCompleteness,
      details: [
        { category: 'AI 검색 친화도', score: aiSearchFriendliness, description: '콘텐츠의 AI 검색엔진 최적화 수준', suggestions: aiSearchFriendliness < 60 ? ['구조화된 마크업을 활용하세요'] : [] },
        { category: 'E-E-A-T', score: Math.round((experience + expertise + authoritativeness + trustworthiness) / 4), description: 'E-E-A-T 신호 종합 평가', suggestions: ['저자 정보를 명시하세요', '전문성을 보여주는 내용을 추가하세요'] },
      ]
    },
    keywords: {
      primaryKeywords,
      relatedKeywords: targetKeyword ? [`${targetKeyword} 방법`, `${targetKeyword} 가이드`, `${targetKeyword} 팁`, `최고의 ${targetKeyword}`] : ['콘텐츠 최적화', 'SEO', 'AI 검색'],
      longTailOpportunities: targetKeyword ? [`${targetKeyword} 초보자 가이드`, `${targetKeyword} 2024 트렌드`, `${targetKeyword} 비교 분석`] : ['AI 콘텐츠 최적화 방법', 'GEO 전략 가이드'],
      density: primaryKeywords.slice(0, 5).map(k => ({ keyword: k.keyword, percentage: k.density, optimal: k.density >= 1 && k.density <= 3 })),
      placementSuggestions: ['제목(H1)에 타겟 키워드를 포함하세요', '첫 번째 단락에 핵심 키워드를 배치하세요', '소제목(H2)에 관련 키워드를 활용하세요'],
    },
    competitor: null,
    recommendations,
  };
}
