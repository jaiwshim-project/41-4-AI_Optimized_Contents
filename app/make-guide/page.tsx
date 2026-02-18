'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';

const apiEndpoints = [
  {
    name: '콘텐츠 생성',
    method: 'POST',
    url: '/api/generate',
    webhookAction: 'generate',
    description: 'AIO/GEO 최적화된 블로그, 제품 설명, FAQ, 가이드 등 콘텐츠 자동 생성',
    params: [
      { name: 'topic', type: 'string', required: true, desc: '콘텐츠 주제' },
      { name: 'category', type: 'string', required: true, desc: '콘텐츠 유형 (blog, product, faq, how-to, comparison, case-study)' },
      { name: 'targetKeyword', type: 'string', required: false, desc: '타겟 키워드' },
      { name: 'industry', type: 'string', required: false, desc: '산업 분야' },
      { name: 'tone', type: 'string', required: false, desc: '톤 (professional, friendly, academic)' },
    ],
    response: '{ title, content, meta, keywords[], summary }',
    example: {
      request: '{ "topic": "AI 마케팅 자동화", "category": "blog", "targetKeyword": "AI 마케팅" }',
      response: '{ "title": "AI 마케팅 자동화 완벽 가이드", "content": "...", "keywords": ["AI 마케팅", ...] }',
    },
  },
  {
    name: '콘텐츠 분석',
    method: 'POST',
    url: '/api/analyze',
    webhookAction: 'analyze',
    description: '기존 콘텐츠의 AIO/GEO 점수, E-E-A-T 평가, 키워드 밀도 분석',
    params: [
      { name: 'content', type: 'string', required: true, desc: '분석할 콘텐츠 텍스트' },
      { name: 'targetKeyword', type: 'string', required: false, desc: '타겟 키워드' },
    ],
    response: '{ aioScore, geoScore, eatScore, keywordDensity, suggestions[], improvements[] }',
    example: {
      request: '{ "content": "분석할 텍스트...", "targetKeyword": "AI 최적화" }',
      response: '{ "aioScore": 72, "geoScore": 68, "suggestions": ["구조화된 데이터 추가", ...] }',
    },
  },
  {
    name: '콘텐츠 최적화',
    method: 'POST',
    url: '/api/optimize',
    webhookAction: 'optimize',
    description: '기존 콘텐츠를 AIO/GEO에 최적화된 형태로 자동 변환',
    params: [
      { name: 'originalContent', type: 'string', required: true, desc: '원본 콘텐츠' },
      { name: 'targetKeyword', type: 'string', required: false, desc: '타겟 키워드' },
    ],
    response: '{ optimizedContent, changes[], beforeScore, afterScore }',
    example: {
      request: '{ "originalContent": "원본 텍스트..." }',
      response: '{ "optimizedContent": "최적화된 텍스트...", "beforeScore": 45, "afterScore": 82 }',
    },
  },
  {
    name: 'SNS 채널 변환',
    method: 'POST',
    url: '/api/convert-content',
    webhookAction: 'convert',
    description: '블로그 콘텐츠를 인스타그램, 링크드인, 네이버 블로그, 카드뉴스, 요약본으로 자동 변환',
    params: [
      { name: 'content', type: 'string', required: true, desc: '원본 콘텐츠' },
      { name: 'channel', type: 'string', required: true, desc: '변환 채널 (instagram, linkedin, naver_blog, card_news, summary)' },
      { name: 'title', type: 'string', required: false, desc: '콘텐츠 제목' },
    ],
    response: '{ result, channel }',
    example: {
      request: '{ "content": "블로그 글...", "channel": "instagram", "title": "AI 마케팅" }',
      response: '{ "result": "🚀 AI 마케팅의 새로운 시대!\\n\\n...", "channel": "instagram" }',
    },
  },
  {
    name: '키워드 경쟁 분석',
    method: 'POST',
    url: '/api/keyword-analysis',
    webhookAction: 'keyword-analysis',
    description: 'AI 검색엔진에서 인용되기 위한 키워드 경쟁도, 검색 의도, 차별화 전략 분석',
    params: [
      { name: 'keyword', type: 'string', required: true, desc: '분석할 키워드' },
      { name: 'industry', type: 'string', required: false, desc: '산업 분야' },
    ],
    response: '{ keyword, difficulty, difficultyScore, searchIntent, aiCitationFactors[], mustCoverTopics[], differentiationStrategies[], contentRecommendations, relatedKeywords[], competitorInsights }',
    example: {
      request: '{ "keyword": "AI 콘텐츠 마케팅", "industry": "마케팅" }',
      response: '{ "keyword": "AI 콘텐츠 마케팅", "difficulty": "중", "difficultyScore": 65, ... }',
    },
  },
  {
    name: '시리즈 기획',
    method: 'POST',
    url: '/api/generate-series',
    webhookAction: 'generate-series',
    description: '주제에 맞는 연재 시리즈 기획안 자동 생성 (3~12편)',
    params: [
      { name: 'topic', type: 'string', required: true, desc: '시리즈 주제' },
      { name: 'industry', type: 'string', required: false, desc: '산업 분야' },
      { name: 'count', type: 'number', required: false, desc: '편수 (3~12, 기본 7)' },
      { name: 'additionalNotes', type: 'string', required: false, desc: '추가 요구사항' },
    ],
    response: '{ seriesTitle, seriesDescription, targetAudience, episodes[], linkingStrategy, publishingSchedule, expectedOutcome }',
    example: {
      request: '{ "topic": "중소기업 AI 도입", "count": 5 }',
      response: '{ "seriesTitle": "중소기업 AI 도입 로드맵", "episodes": [...], ... }',
    },
  },
  {
    name: 'AI 인포그래픽 생성',
    method: 'POST',
    url: '/api/generate-images',
    webhookAction: null,
    description: 'Gemini AI를 활용한 콘텐츠 맞춤 인포그래픽 이미지 생성',
    params: [
      { name: 'content', type: 'string', required: true, desc: '콘텐츠 내용' },
      { name: 'title', type: 'string', required: true, desc: '이미지 제목' },
    ],
    response: '{ images: [{ url, alt }] }',
    example: {
      request: '{ "content": "AI 마케팅 트렌드...", "title": "2026 AI 마케팅 트렌드" }',
      response: '{ "images": [{ "url": "data:image/png;base64,...", "alt": "..." }] }',
    },
    note: 'Gemini API Key 필요 (X-Gemini-Key 헤더)',
  },
  {
    name: '파일 파싱',
    method: 'POST',
    url: '/api/parse-file',
    webhookAction: null,
    description: 'PDF, DOCX, PPTX, 이미지 등 파일 업로드 후 텍스트 추출',
    params: [
      { name: 'file', type: 'FormData', required: true, desc: '업로드 파일 (최대 20MB)' },
    ],
    response: '{ text, fileName }',
    example: {
      request: 'FormData: file=report.pdf',
      response: '{ "text": "추출된 텍스트...", "fileName": "report.pdf" }',
    },
    note: '지원 형식: PDF, DOCX, PPTX, TXT, MD, CSV, JSON, HTML, XML, JPG, PNG, GIF, WEBP',
  },
  {
    name: '통합 웹훅',
    method: 'POST',
    url: '/api/webhook',
    webhookAction: null,
    description: 'Make.com 등 외부 자동화 도구용 단일 엔드포인트. action 파라미터로 기능 선택',
    params: [
      { name: 'action', type: 'string', required: true, desc: 'generate, analyze, optimize, convert, keyword-analysis, generate-series' },
      { name: '...', type: '각 액션별', required: true, desc: '선택한 액션에 해당하는 파라미터 (위 개별 API 참조)' },
    ],
    response: '{ success: true, action, result: { ... } }',
    example: {
      request: '{ "action": "generate", "topic": "AI 마케팅", "category": "blog" }',
      response: '{ "success": true, "action": "generate", "result": { "title": "...", "content": "..." } }',
    },
    note: 'Make.com HTTP 모듈에서 이 하나의 URL만 사용하면 됩니다',
  },
];

const scenarios = [
  {
    id: 1,
    title: '키워드 → 콘텐츠 자동 생성 → Google Sheets 저장',
    difficulty: '초급',
    time: '15분',
    icon: '📝',
    description: 'Google Sheets에 키워드를 입력하면 자동으로 AIO 최적화 콘텐츠를 생성하여 같은 시트에 저장합니다.',
    modules: ['Google Sheets (Watch Rows)', 'HTTP (Make a request)', 'Google Sheets (Update Row)'],
    steps: [
      {
        step: 1,
        title: 'Google Sheets 트리거 설정',
        detail: '새 행이 추가되면 시나리오가 시작됩니다.',
        config: [
          'Module: Google Sheets > Watch Rows',
          'Spreadsheet: 콘텐츠 관리 시트 선택',
          'Sheet: "키워드 목록" 시트',
          'Watch column: A열 (키워드)',
        ],
      },
      {
        step: 2,
        title: 'HTTP 모듈로 콘텐츠 생성 API 호출',
        detail: '우리 플랫폼의 generate API를 호출합니다.',
        config: [
          'Module: HTTP > Make a request',
          'URL: https://aio-geo-optimizer.vercel.app/api/webhook',
          'Method: POST',
          'Headers: Content-Type = application/json',
          'Headers: X-API-Key = sk-ant-xxxxx (본인 키)',
          'Body type: Raw (application/json)',
          `Body: { "action": "generate", "topic": "{{1.A}}", "category": "blog" }`,
          '※ {{1.A}}는 Google Sheets에서 가져온 키워드 값',
        ],
      },
      {
        step: 3,
        title: '생성 결과를 Google Sheets에 저장',
        detail: '생성된 콘텐츠를 같은 행에 업데이트합니다.',
        config: [
          'Module: Google Sheets > Update a Row',
          'Row number: {{1.rowNumber}}',
          'B열: {{2.body.result.title}} (제목)',
          'C열: {{2.body.result.content}} (본문)',
          'D열: {{2.body.result.keywords}} (키워드)',
          'E열: {{now}} (생성 일시)',
        ],
      },
    ],
  },
  {
    id: 2,
    title: '콘텐츠 생성 → 멀티채널 자동 변환 → SNS 게시',
    difficulty: '중급',
    time: '30분',
    icon: '📱',
    description: '블로그 콘텐츠를 생성한 후 인스타그램, 링크드인, 네이버 블로그용으로 자동 변환하여 각 채널에 게시합니다.',
    modules: ['Trigger (Schedule/Webhook)', 'HTTP x4 (generate + convert x3)', 'Instagram/LinkedIn/WordPress'],
    steps: [
      {
        step: 1,
        title: '트리거 설정',
        detail: '매주 월/수/금 오전 9시에 자동 실행되도록 스케줄을 설정합니다.',
        config: [
          'Module: Schedule (또는 Webhook으로 수동 트리거)',
          'Schedule: 매주 월, 수, 금 09:00 KST',
          '또는 Google Sheets Watch Rows로 키워드 입력 시 트리거',
        ],
      },
      {
        step: 2,
        title: '원본 콘텐츠 생성',
        detail: '블로그 형태의 원본 콘텐츠를 먼저 생성합니다.',
        config: [
          'Module: HTTP > Make a request',
          'URL: https://aio-geo-optimizer.vercel.app/api/webhook',
          'Method: POST',
          'Headers: X-API-Key = sk-ant-xxxxx',
          `Body: { "action": "generate", "topic": "이번 주 키워드", "category": "blog" }`,
        ],
      },
      {
        step: 3,
        title: '인스타그램용 변환',
        detail: '생성된 콘텐츠를 인스타그램 형식으로 변환합니다.',
        config: [
          'Module: HTTP > Make a request',
          'URL: https://aio-geo-optimizer.vercel.app/api/webhook',
          `Body: { "action": "convert", "content": "{{2.body.result.content}}", "channel": "instagram", "title": "{{2.body.result.title}}" }`,
        ],
      },
      {
        step: 4,
        title: '링크드인용 변환 (병렬 실행)',
        detail: '동시에 링크드인 형식으로도 변환합니다. Make.com의 Router를 사용하면 3, 4, 5단계를 병렬로 실행할 수 있습니다.',
        config: [
          `Body: { "action": "convert", "content": "{{2.body.result.content}}", "channel": "linkedin" }`,
        ],
      },
      {
        step: 5,
        title: '각 채널에 게시',
        detail: '변환된 콘텐츠를 각 SNS에 게시합니다.',
        config: [
          'Instagram: Instagram for Business 모듈로 게시',
          'LinkedIn: LinkedIn 모듈로 게시',
          'WordPress/네이버: HTTP 모듈로 API 호출하여 게시',
          '※ 각 SNS의 API 연동이 필요합니다',
        ],
      },
    ],
  },
  {
    id: 3,
    title: '정기 시리즈 자동 기획 → 매일 1편 발행',
    difficulty: '중급',
    time: '30분',
    icon: '📚',
    description: '매주 월요일에 시리즈를 기획하고, 화~금 매일 1편씩 자동으로 콘텐츠를 생성하여 발행합니다.',
    modules: ['Schedule', 'HTTP (generate-series)', 'Iterator', 'HTTP (generate)', 'WordPress/Blog'],
    steps: [
      {
        step: 1,
        title: '매주 월요일 시리즈 기획',
        detail: '월요일 09:00에 시리즈 기획안을 자동 생성합니다.',
        config: [
          'Module: Schedule > 매주 월요일 09:00',
          'Module: HTTP > Make a request',
          `Body: { "action": "generate-series", "topic": "이번 주 주제", "count": 4 }`,
          '※ 주제는 Google Sheets의 "주간 주제" 시트에서 가져올 수 있음',
        ],
      },
      {
        step: 2,
        title: '에피소드 목록 반복 처리',
        detail: '시리즈 기획안의 각 에피소드를 하나씩 처리합니다.',
        config: [
          'Module: Iterator',
          'Array: {{1.body.result.episodes}}',
          '각 에피소드의 title, targetKeywords, keyPoints를 다음 모듈에 전달',
        ],
      },
      {
        step: 3,
        title: '각 에피소드 콘텐츠 생성',
        detail: '에피소드별로 상세 콘텐츠를 생성합니다.',
        config: [
          'Module: HTTP > Make a request',
          `Body: { "action": "generate", "topic": "{{2.title}}", "category": "blog" }`,
          '※ 에피소드의 키포인트를 additionalContext로 추가 가능',
        ],
      },
      {
        step: 4,
        title: '발행 스케줄 설정',
        detail: '생성된 콘텐츠를 화~금에 걸쳐 예약 발행합니다.',
        config: [
          'WordPress: Schedule post로 예약 발행',
          '또는 Google Sheets에 저장 후 별도 시나리오로 매일 발행',
          'Slack/Email로 발행 알림 전송',
        ],
      },
    ],
  },
  {
    id: 4,
    title: '경쟁사 모니터링 → 대응 콘텐츠 자동 생성',
    difficulty: '고급',
    time: '45분',
    icon: '🔍',
    description: 'RSS 피드나 Google Alerts로 경쟁사 새 글을 감지하고, 키워드를 분석한 후 더 나은 AIO 최적화 콘텐츠를 자동 생성합니다.',
    modules: ['RSS/Google Alerts', 'HTTP (keyword-analysis)', 'HTTP (generate)', 'Filter', 'WordPress/Slack'],
    steps: [
      {
        step: 1,
        title: 'RSS 피드 모니터링',
        detail: '경쟁사 블로그의 RSS 피드를 감시합니다.',
        config: [
          'Module: RSS > Watch RSS feed items',
          'URL: 경쟁사 블로그 RSS URL',
          '또는 Google Alerts > Watch alerts',
          'Schedule: 매시간 체크',
        ],
      },
      {
        step: 2,
        title: '키워드 경쟁 분석',
        detail: '감지된 콘텐츠의 핵심 키워드를 분석합니다.',
        config: [
          'Module: HTTP > Make a request',
          `Body: { "action": "keyword-analysis", "keyword": "{{1.title}}", "industry": "우리 산업" }`,
          '응답에서 difficultyScore, mustCoverTopics, differentiationStrategies 활용',
        ],
      },
      {
        step: 3,
        title: '필터: 대응 가치 판단',
        detail: '경쟁도가 높은 키워드만 필터링합니다.',
        config: [
          'Module: Filter',
          'Condition: {{2.body.difficultyScore}} < 80',
          '※ 너무 경쟁이 치열한 키워드는 건너뜀',
        ],
      },
      {
        step: 4,
        title: '대응 콘텐츠 생성',
        detail: '분석 결과를 바탕으로 더 나은 콘텐츠를 생성합니다.',
        config: [
          'Module: HTTP > Make a request',
          `Body: { "action": "generate", "topic": "{{1.title}}", "category": "blog", "targetKeyword": "{{2.body.keyword}}" }`,
        ],
      },
      {
        step: 5,
        title: '발행 및 알림',
        detail: '생성된 콘텐츠를 발행하고 팀에 알립니다.',
        config: [
          'WordPress/Blog: 자동 발행 (또는 임시저장)',
          'Slack: "경쟁사 대응 콘텐츠가 생성되었습니다" 알림',
          'Google Sheets: 모니터링 로그 기록',
        ],
      },
    ],
  },
  {
    id: 5,
    title: '고객 문의 → 맞춤 콘텐츠 자동 응답',
    difficulty: '고급',
    time: '45분',
    icon: '💬',
    description: '웹사이트 폼이나 이메일로 들어온 고객 문의에서 키워드를 추출하고, 맞춤 콘텐츠를 생성하여 이메일로 자동 발송합니다.',
    modules: ['Webhook/Gmail', 'HTTP (generate)', 'Gmail/Mailchimp', 'HubSpot/CRM'],
    steps: [
      {
        step: 1,
        title: '고객 문의 수신',
        detail: '폼 제출이나 이메일 수신을 감지합니다.',
        config: [
          'Module: Webhooks > Custom webhook (폼 제출용)',
          '또는 Gmail > Watch emails (특정 라벨/필터)',
          '또는 Typeform/Google Forms > Watch responses',
        ],
      },
      {
        step: 2,
        title: '맞춤 콘텐츠 생성',
        detail: '문의 내용을 기반으로 맞춤 콘텐츠를 생성합니다.',
        config: [
          'Module: HTTP > Make a request',
          `Body: { "action": "generate", "topic": "{{1.question}}", "category": "faq" }`,
          '※ category를 faq로 설정하여 질문-답변 형식으로 생성',
        ],
      },
      {
        step: 3,
        title: '이메일 자동 발송',
        detail: '생성된 콘텐츠를 고객에게 이메일로 보냅니다.',
        config: [
          'Module: Gmail > Send an email',
          'To: {{1.email}}',
          'Subject: "문의하신 {{1.question}}에 대한 답변입니다"',
          'Body: {{2.body.result.content}}',
        ],
      },
      {
        step: 4,
        title: 'CRM 기록',
        detail: '상담 이력을 CRM에 자동 기록합니다.',
        config: [
          'Module: HubSpot > Create a contact/deal',
          '또는 Google Sheets에 상담 로그 기록',
          '문의 내용, 응답 내용, 일시 등 기록',
        ],
      },
    ],
  },
];

export default function MakeGuidePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'scenarios' | 'agency' | 'roadmap'>('overview');
  const [expandedApi, setExpandedApi] = useState<number | null>(null);
  const [expandedScenario, setExpandedScenario] = useState<number | null>(null);

  const tabs = [
    { id: 'overview' as const, label: '개요', icon: '📋' },
    { id: 'api' as const, label: 'API 레퍼런스', icon: '🔌' },
    { id: 'scenarios' as const, label: 'Make.com 시나리오', icon: '⚡' },
    { id: 'agency' as const, label: '에이전시 활용', icon: '🏢' },
    { id: 'roadmap' as const, label: '향후 개발', icon: '🗺️' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">M</span>
              </div>
              <span className="text-sm font-bold text-gray-900">Make.com 활용 매뉴얼</span>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                홈
              </Link>
              <Link href="/manual" className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                사용자 매뉴얼
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 rounded-full text-sm mb-4">
            <span>AIO/GEO Optimizer</span>
            <span className="text-purple-300">×</span>
            <span>Make.com</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            콘텐츠 자동화의 모든 것
          </h1>
          <p className="text-lg text-purple-200 max-w-2xl mx-auto">
            AI 최적화 콘텐츠 생성부터 멀티채널 배포까지,<br />
            Make.com 연동으로 완전 자동화하는 방법을 안내합니다.
          </p>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-14 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto gap-1 py-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ===== Part 1: 개요 ===== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Make.com 소개 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Make.com이란?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    Make.com(구 Integromat)은 <strong>노코드 자동화 플랫폼</strong>입니다.
                    프로그래밍 없이 드래그 앤 드롭으로 다양한 앱과 서비스를 연결하여
                    업무 프로세스를 자동화할 수 있습니다.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">&#10003;</span>
                      <span><strong>시나리오</strong>: 자동화 워크플로우 (트리거 → 액션 → 결과)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">&#10003;</span>
                      <span><strong>모듈</strong>: 각 앱의 기능 단위 (Google Sheets 행 읽기, HTTP 요청 등)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">&#10003;</span>
                      <span><strong>커넥션</strong>: 앱과의 인증 연결 (API Key, OAuth 등)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-0.5">&#10003;</span>
                      <span><strong>Router</strong>: 조건에 따라 분기 처리 (병렬 실행 가능)</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">왜 Make.com인가?</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">vs Zapier</span>
                      <span className="text-gray-600">더 복잡한 시나리오, 시각적 빌더, 낮은 가격</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">vs n8n</span>
                      <span className="text-gray-600">클라우드 호스팅, 쉬운 UI, 기술 부담 없음</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-medium">vs 코딩</span>
                      <span className="text-gray-600">유지보수 불필요, 시각적 디버깅, 빠른 구축</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 연동 효과 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">연동하면 무엇이 가능한가?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: '🚀', title: '완전 자동 콘텐츠 생산', desc: '키워드 입력만으로 기획→생성→최적화→발행까지 자동 처리' },
                  { icon: '📱', title: '멀티채널 동시 배포', desc: '블로그 1편으로 인스타, 링크드인, 네이버 등 5개 채널 동시 커버' },
                  { icon: '📊', title: '데이터 기반 최적화', desc: '키워드 분석 → 콘텐츠 생성 → 성과 추적의 자동 순환' },
                  { icon: '⏰', title: '정기 발행 자동화', desc: '매일/매주 일정에 따라 빠짐없이 콘텐츠 발행' },
                  { icon: '🔍', title: '경쟁사 대응 자동화', desc: 'RSS 감지 → 분석 → 대응 콘텐츠 생성까지 자동' },
                  { icon: '💰', title: '비용 90% 절감', desc: '월 400만원 인건비 → API 비용 5~10만원으로 대체' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-900 mt-2 mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 아키텍처 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">전체 아키텍처</h2>
              <div className="bg-gray-900 rounded-xl p-5 text-sm font-mono text-gray-300 overflow-x-auto">
                <pre className="whitespace-pre leading-relaxed">{`┌─────────────────── Make.com ───────────────────┐
│                                                │
│  [트리거]          [API 호출]       [후속 액션] │
│                                                │
│  • Schedule        POST /api/       • WordPress│
│  • RSS Feed        webhook          • Instagram│
│  • Google Sheets   ─────────►       • LinkedIn │
│  • Email/Gmail     X-API-Key        • Slack    │
│  • Webhook         인증 헤더        • Gmail    │
│  • Google Forms                     • Sheets   │
│                                     • HubSpot  │
└────────────────────┬───────────────────────────┘
                     │
                     ▼
    ┌────────────────────────────────┐
    │   AIO/GEO Optimizer API       │
    │                                │
    │   /api/webhook (통합)          │
    │   ├─ action: generate          │
    │   ├─ action: analyze           │
    │   ├─ action: optimize          │
    │   ├─ action: convert           │
    │   ├─ action: keyword-analysis  │
    │   └─ action: generate-series   │
    │                                │
    │   개별 엔드포인트도 사용 가능  │
    │   /api/generate                │
    │   /api/analyze                 │
    │   /api/optimize                │
    │   /api/convert-content         │
    │   /api/keyword-analysis        │
    │   /api/generate-series         │
    │   /api/generate-images         │
    └────────────────────────────────┘`}</pre>
              </div>
            </section>
          </div>
        )}

        {/* ===== Part 2: API 레퍼런스 ===== */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            {/* 인증 방법 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">인증 방법</h2>
              <p className="text-sm text-gray-600 mb-4">
                모든 API 요청에는 Anthropic API Key가 필요합니다. 아래 3가지 방법 중 하나로 전달하세요.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">추천</span>
                    <span className="text-sm font-semibold text-gray-800">X-API-Key 헤더</span>
                  </div>
                  <code className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded block">
                    X-API-Key: sk-ant-xxxxx
                  </code>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm font-semibold text-gray-800 block mb-2">Authorization 헤더</span>
                  <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded block">
                    Authorization: Bearer sk-ant-xxxxx
                  </code>
                </div>
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="text-sm font-semibold text-gray-800 block mb-2">서버 환경변수</span>
                  <code className="text-xs text-gray-700 bg-gray-100 px-2 py-1 rounded block">
                    ANTHROPIC_API_KEY=sk-ant-xxxxx
                  </code>
                  <p className="text-xs text-gray-400 mt-1">Vercel 환경변수에 설정</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-xs text-amber-800">
                  <strong>이미지 생성 API</strong>는 별도로 Gemini API Key가 필요합니다.
                  <code className="bg-amber-100 px-1 rounded ml-1">X-Gemini-Key</code> 헤더로 전달하세요.
                </p>
              </div>
            </section>

            {/* 통합 웹훅 안내 */}
            <section className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 sm:p-8 border border-purple-100">
              <h2 className="text-xl font-bold text-gray-900 mb-2">통합 웹훅 엔드포인트</h2>
              <p className="text-sm text-gray-600 mb-4">
                Make.com에서는 아래 <strong>하나의 URL</strong>만 사용하면 됩니다.
                <code className="bg-white px-2 py-0.5 rounded text-purple-700 ml-1 text-xs">action</code> 파라미터로 기능을 선택합니다.
              </p>
              <div className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-purple-600 text-white px-2 py-0.5 rounded text-xs font-bold">POST</span>
                  <code className="text-sm text-gray-800 font-semibold">https://aio-geo-optimizer.vercel.app/api/webhook</code>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  지원 액션: <code className="bg-gray-100 px-1 rounded">generate</code> <code className="bg-gray-100 px-1 rounded">analyze</code> <code className="bg-gray-100 px-1 rounded">optimize</code> <code className="bg-gray-100 px-1 rounded">convert</code> <code className="bg-gray-100 px-1 rounded">keyword-analysis</code> <code className="bg-gray-100 px-1 rounded">generate-series</code>
                </div>
              </div>
            </section>

            {/* 개별 API 목록 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">API 엔드포인트 상세</h2>
              <div className="space-y-3">
                {apiEndpoints.map((api, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedApi(expandedApi === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          api.method === 'POST' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                        }`}>{api.method}</span>
                        <code className="text-sm text-gray-800">{api.url}</code>
                        <span className="text-xs text-gray-400 hidden sm:inline">— {api.name}</span>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedApi === index ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedApi === index && (
                      <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-4">
                        <p className="text-sm text-gray-600">{api.description}</p>

                        {api.webhookAction && (
                          <div className="text-xs text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg inline-block">
                            웹훅 action: <code className="font-bold">{api.webhookAction}</code>
                          </div>
                        )}

                        {api.note && (
                          <div className="text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg">
                            {api.note}
                          </div>
                        )}

                        {/* Parameters */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">파라미터</h4>
                          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <table className="w-full text-xs">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="text-left px-3 py-2 font-medium text-gray-600">이름</th>
                                  <th className="text-left px-3 py-2 font-medium text-gray-600">타입</th>
                                  <th className="text-left px-3 py-2 font-medium text-gray-600">필수</th>
                                  <th className="text-left px-3 py-2 font-medium text-gray-600">설명</th>
                                </tr>
                              </thead>
                              <tbody>
                                {api.params.map((param, pi) => (
                                  <tr key={pi} className="border-t border-gray-100">
                                    <td className="px-3 py-2 font-mono text-indigo-600">{param.name}</td>
                                    <td className="px-3 py-2 text-gray-500">{param.type}</td>
                                    <td className="px-3 py-2">
                                      {param.required ? (
                                        <span className="text-red-500 font-medium">필수</span>
                                      ) : (
                                        <span className="text-gray-400">선택</span>
                                      )}
                                    </td>
                                    <td className="px-3 py-2 text-gray-600">{param.desc}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Response */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">응답 형식</h4>
                          <code className="text-xs text-gray-700 bg-white px-3 py-2 rounded-lg border border-gray-200 block">
                            {api.response}
                          </code>
                        </div>

                        {/* Example */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">요청/응답 예시</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">요청 Body:</span>
                              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto">
                                {api.example.request}
                              </pre>
                            </div>
                            <div>
                              <span className="text-xs text-gray-500 block mb-1">응답:</span>
                              <pre className="text-xs bg-gray-900 text-blue-400 p-3 rounded-lg overflow-x-auto">
                                {api.example.response}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* 에러 코드 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">에러 코드</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">코드</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">의미</th>
                      <th className="text-left px-4 py-2 font-medium text-gray-600">해결 방법</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-t"><td className="px-4 py-2 font-mono text-red-600">400</td><td className="px-4 py-2">필수 파라미터 누락</td><td className="px-4 py-2 text-gray-500">요청 Body에 필수 필드 확인</td></tr>
                    <tr className="border-t"><td className="px-4 py-2 font-mono text-red-600">401</td><td className="px-4 py-2">API 키 없음 또는 유효하지 않음</td><td className="px-4 py-2 text-gray-500">X-API-Key 헤더에 유효한 키 전달</td></tr>
                    <tr className="border-t"><td className="px-4 py-2 font-mono text-red-600">500</td><td className="px-4 py-2">서버 오류 (AI 호출 실패 등)</td><td className="px-4 py-2 text-gray-500">잠시 후 재시도, API 키 잔액 확인</td></tr>
                    <tr className="border-t"><td className="px-4 py-2 font-mono text-amber-600">TIMEOUT</td><td className="px-4 py-2">60초 초과</td><td className="px-4 py-2 text-gray-500">콘텐츠 길이 줄이기, Make.com 타임아웃 늘리기</td></tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {/* ===== Part 3: Make.com 시나리오 ===== */}
        {activeTab === 'scenarios' && (
          <div className="space-y-6">
            {/* Make.com 기본 설정 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Make.com 기본 설정</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-2xl mb-2">1️⃣</div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Make.com 가입</h3>
                    <p className="text-xs text-gray-600">make.com에서 무료 계정 생성. Free 플랜으로 월 1,000 오퍼레이션 가능.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-2xl mb-2">2️⃣</div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">새 시나리오 생성</h3>
                    <p className="text-xs text-gray-600">Dashboard &gt; Create a new scenario 클릭. 빈 캔버스가 열립니다.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="text-2xl mb-2">3️⃣</div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">HTTP 모듈 추가</h3>
                    <p className="text-xs text-gray-600">+ 버튼 &gt; HTTP &gt; Make a request 선택. 이것이 우리 API를 호출하는 핵심 모듈입니다.</p>
                  </div>
                </div>

                {/* HTTP 모듈 설정 */}
                <div className="bg-gray-900 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-3">HTTP 모듈 설정값 (모든 시나리오 공통)</h3>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">URL:</span>
                      <span className="text-green-400">https://aio-geo-optimizer.vercel.app/api/webhook</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">Method:</span>
                      <span className="text-yellow-400">POST</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">Headers:</span>
                      <span className="text-blue-400">Content-Type: application/json</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">Headers:</span>
                      <span className="text-purple-400">X-API-Key: sk-ant-xxxxx (본인 키)</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">Body type:</span>
                      <span className="text-orange-400">Raw (application/json)</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="text-gray-400 w-28 shrink-0">Parse response:</span>
                      <span className="text-emerald-400">Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 시나리오 목록 */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">실전 시나리오 가이드</h2>
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <button
                      onClick={() => setExpandedScenario(expandedScenario === scenario.id ? null : scenario.id)}
                      className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{scenario.icon}</span>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{scenario.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              scenario.difficulty === '초급' ? 'bg-green-100 text-green-700' :
                              scenario.difficulty === '중급' ? 'bg-blue-100 text-blue-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>{scenario.difficulty}</span>
                            <span className="text-xs text-gray-400">설정 시간: {scenario.time}</span>
                          </div>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedScenario === scenario.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedScenario === scenario.id && (
                      <div className="border-t border-gray-100 p-5 space-y-5">
                        <p className="text-sm text-gray-600">{scenario.description}</p>

                        {/* 필요 모듈 */}
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">필요 모듈</h4>
                          <div className="flex flex-wrap gap-2">
                            {scenario.modules.map((mod, i) => (
                              <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg border border-indigo-100">
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 단계별 가이드 */}
                        <div className="space-y-4">
                          {scenario.steps.map((step) => (
                            <div key={step.step} className="relative pl-8">
                              <div className="absolute left-0 top-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                {step.step}
                              </div>
                              <div className="bg-gray-50 rounded-xl p-4">
                                <h5 className="text-sm font-semibold text-gray-800 mb-1">{step.title}</h5>
                                <p className="text-xs text-gray-500 mb-3">{step.detail}</p>
                                <div className="space-y-1">
                                  {step.config.map((cfg, ci) => (
                                    <div key={ci} className="text-xs font-mono text-gray-700 bg-white px-3 py-1.5 rounded border border-gray-200">
                                      {cfg}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== Part 4: 에이전시 활용 ===== */}
        {activeTab === 'agency' && (
          <div className="space-y-8">
            {/* 패키지 상품화 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">에이전시 패키지 상품화</h2>
              <p className="text-sm text-gray-600 mb-6">
                Make.com + AIO/GEO Optimizer를 조합하여 구독형 서비스 패키지로 판매할 수 있습니다.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 기본 패키지 */}
                <div className="border-2 border-blue-100 rounded-2xl p-6 hover:border-blue-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Basic</h3>
                    <span className="text-2xl font-bold text-blue-600">50만원<span className="text-sm text-gray-400">/월</span></span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-blue-500">&#10003;</span>주 3회 AIO 최적화 블로그 자동 발행</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">&#10003;</span>인스타그램 자동 변환 게시</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">&#10003;</span>월간 키워드 분석 리포트 (Sheets 자동 생성)</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">&#10003;</span>Google Sheets 콘텐츠 관리</li>
                    <li className="flex items-start gap-2"><span className="text-blue-500">&#10003;</span>이메일 발행 알림</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-400">실제 운영 비용: API ~3만원 + Make.com Free 플랜</p>
                    <p className="text-xs text-green-600 font-medium mt-1">예상 순이익: ~47만원/월</p>
                  </div>
                </div>

                {/* 프리미엄 패키지 */}
                <div className="border-2 border-purple-200 rounded-2xl p-6 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 transition-colors relative">
                  <div className="absolute -top-3 right-4 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Premium</h3>
                    <span className="text-2xl font-bold text-purple-600">150만원<span className="text-sm text-gray-400">/월</span></span>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>매일 1편 AIO 최적화 콘텐츠 자동 발행</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>4개 채널 동시 배포 (블로그, 인스타, 링크드인, 카드뉴스)</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>경쟁사 모니터링 + 대응 콘텐츠 자동 생성</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>주간 시리즈 기획 + 자동 발행</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>주간/월간 성과 리포트 자동 발송</li>
                    <li className="flex items-start gap-2"><span className="text-purple-500">&#10003;</span>고객 문의 자동 응답 시스템</li>
                  </ul>
                  <div className="mt-4 pt-4 border-t border-purple-100">
                    <p className="text-xs text-gray-400">실제 운영 비용: API ~10만원 + Make.com Pro ~$9</p>
                    <p className="text-xs text-green-600 font-medium mt-1">예상 순이익: ~138만원/월</p>
                  </div>
                </div>
              </div>
            </section>

            {/* ROI 시뮬레이션 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">ROI 시뮬레이션</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-3 font-medium text-gray-600">항목</th>
                      <th className="text-center px-4 py-3 font-medium text-gray-600">기존 수작업</th>
                      <th className="text-center px-4 py-3 font-medium text-purple-600 bg-purple-50">Make.com 자동화</th>
                      <th className="text-center px-4 py-3 font-medium text-green-600">절감 효과</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs">
                    <tr className="border-t">
                      <td className="px-4 py-3 text-gray-700">콘텐츠 1편 제작 시간</td>
                      <td className="px-4 py-3 text-center text-gray-500">2~4시간</td>
                      <td className="px-4 py-3 text-center text-purple-600 bg-purple-50/50 font-medium">3분 (자동)</td>
                      <td className="px-4 py-3 text-center text-green-600">97% 절감</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-gray-700">월 20편 기준 인건비</td>
                      <td className="px-4 py-3 text-center text-gray-500">400만원+</td>
                      <td className="px-4 py-3 text-center text-purple-600 bg-purple-50/50 font-medium">5~10만원 (API)</td>
                      <td className="px-4 py-3 text-center text-green-600">390만원+ 절감</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-gray-700">멀티채널 변환</td>
                      <td className="px-4 py-3 text-center text-gray-500">추가 1시간/편</td>
                      <td className="px-4 py-3 text-center text-purple-600 bg-purple-50/50 font-medium">자동 (추가 비용 없음)</td>
                      <td className="px-4 py-3 text-center text-green-600">100% 절감</td>
                    </tr>
                    <tr className="border-t">
                      <td className="px-4 py-3 text-gray-700">키워드 분석</td>
                      <td className="px-4 py-3 text-center text-gray-500">외주 50만원/월</td>
                      <td className="px-4 py-3 text-center text-purple-600 bg-purple-50/50 font-medium">자동 포함</td>
                      <td className="px-4 py-3 text-center text-green-600">50만원 절감</td>
                    </tr>
                    <tr className="border-t bg-green-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">월 총 절감액</td>
                      <td className="px-4 py-3 text-center text-gray-500">-</td>
                      <td className="px-4 py-3 text-center text-purple-600 font-medium">-</td>
                      <td className="px-4 py-3 text-center text-green-700 font-bold text-base">~440만원+</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* 고객 제안 포인트 */}
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">고객 제안서 활용 포인트</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: '속도', point: '"블로그 1편을 3분 만에 생성합니다"', desc: '기획→생성→최적화→배포 전 과정 자동화로 기존 대비 97% 시간 절감' },
                  { title: '일관성', point: '"매일 빠짐없이 콘텐츠를 발행합니다"', desc: '사람에 의존하지 않는 정기 발행 시스템. 휴가, 퇴사에도 중단 없음' },
                  { title: '품질', point: '"AI 검색엔진이 인용하는 구조로 작성합니다"', desc: 'AIO/GEO 최적화로 ChatGPT, Gemini 등에서 인용 확률 극대화' },
                  { title: '확장성', point: '"고객 10명이든 100명이든 같은 비용입니다"', desc: '자동화 시나리오 복제로 고객 수 증가 시에도 추가 인력 불필요' },
                  { title: '데이터', point: '"모든 성과를 자동 추적하고 리포트합니다"', desc: 'Google Sheets/Notion에 자동 기록, 월간 리포트 자동 발송' },
                  { title: '멀티채널', point: '"하나의 콘텐츠로 5개 채널을 커버합니다"', desc: '블로그 → 인스타, 링크드인, 네이버, 카드뉴스, 요약본 자동 변환' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors">
                    <span className="text-xs font-bold text-indigo-600 uppercase">{item.title}</span>
                    <p className="text-sm font-semibold text-gray-900 mt-1 mb-1">{item.point}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ===== Part 5: 향후 개발 ===== */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8">
            <section className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-2">향후 개발 가능 기능</h2>
              <p className="text-sm text-gray-500 mb-6">
                현재 구현된 기능을 바탕으로, 추가 개발할 수 있는 기능들을 정리합니다.
                우선순위와 범위를 결정하는 데 참고하세요.
              </p>
              <div className="space-y-6">
                {/* Phase 1 */}
                <div className="border-l-4 border-green-500 pl-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-bold">Phase 1</span>
                    <span className="text-sm font-semibold text-gray-800">즉시 가능 (현재 API 기반)</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">인터랙티브 API 테스트 페이지 (/api-docs)</h4>
                      <p className="text-xs text-gray-600 mb-2">브라우저에서 직접 API를 테스트할 수 있는 Swagger 스타일 페이지. API Key를 입력하고 파라미터를 설정한 후 실행 버튼으로 결과 확인.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">프론트엔드만</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 1~2일</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">웹훅 테스트 페이지</h4>
                      <p className="text-xs text-gray-600 mb-2">Make.com 연동 전에 웹훅이 제대로 동작하는지 확인할 수 있는 테스트 도구. 요청/응답을 시각적으로 보여줌.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">프론트엔드만</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 1일</span>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">콘텐츠 히스토리 API</h4>
                      <p className="text-xs text-gray-600 mb-2">생성/분석/최적화한 콘텐츠를 Supabase에 자동 저장하고, Make.com에서 조회 가능한 API 제공.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">백엔드 + DB</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 2~3일</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="border-l-4 border-blue-500 pl-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">Phase 2</span>
                    <span className="text-sm font-semibold text-gray-800">Make.com 깊은 통합</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">Make.com 커스텀 앱 개발</h4>
                      <p className="text-xs text-gray-600 mb-2">Make.com 마켓플레이스에 등록 가능한 커스텀 앱/모듈 개발. 사용자가 HTTP 모듈 대신 &quot;AIO/GEO Optimizer&quot; 모듈을 직접 검색하여 사용 가능.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Make.com SDK</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 1~2주</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">템플릿 시나리오 공유</h4>
                      <p className="text-xs text-gray-600 mb-2">미리 구성된 Make.com 시나리오 템플릿을 제공. 사용자가 Import하여 API Key만 입력하면 바로 사용 가능.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Make.com Blueprint</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 3~5일</span>
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">실시간 웹훅 로그 대시보드</h4>
                      <p className="text-xs text-gray-600 mb-2">Make.com에서 호출한 API 요청/응답을 실시간으로 모니터링. 에러 알림, 사용량 통계 제공.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">풀스택</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 3~5일</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="border-l-4 border-purple-500 pl-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold">Phase 3</span>
                    <span className="text-sm font-semibold text-gray-800">멀티 플랫폼 확장</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">n8n 연동 지원</h4>
                      <p className="text-xs text-gray-600 mb-2">셀프 호스팅 가능한 오픈소스 자동화 도구 n8n용 커스텀 노드 개발. 기업 고객 대응.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Node.js</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 1~2주</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">Zapier 통합</h4>
                      <p className="text-xs text-gray-600 mb-2">Zapier 마켓플레이스 등록. 미국/글로벌 시장 진출용.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">Zapier CLI</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 1~2주</span>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">WordPress 플러그인</h4>
                      <p className="text-xs text-gray-600 mb-2">WordPress에서 직접 AIO/GEO 최적화 콘텐츠를 생성하고 발행하는 플러그인. Make.com 없이도 자동화 가능.</p>
                      <div className="flex gap-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">PHP</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">예상 2~3주</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 우선순위 추천 */}
            <section className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 sm:p-8 border border-indigo-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">추천 개발 우선순위</h2>
              <div className="space-y-3">
                {[
                  { priority: 1, item: 'API 테스트 페이지 (/api-docs)', reason: '고객/에이전시가 API를 직접 확인하고 신뢰할 수 있음', impact: '높음' },
                  { priority: 2, item: '웹훅 테스트 페이지', reason: 'Make.com 연동 전 디버깅 필수 도구', impact: '높음' },
                  { priority: 3, item: 'Make.com 템플릿 시나리오', reason: '사용자의 시작 장벽을 크게 낮춤', impact: '매우 높음' },
                  { priority: 4, item: '콘텐츠 히스토리 API', reason: '재사용, 성과 추적의 기반', impact: '중간' },
                  { priority: 5, item: 'Make.com 커스텀 앱', reason: '브랜드 인지도 + 마켓플레이스 노출', impact: '장기적 높음' },
                ].map((item) => (
                  <div key={item.priority} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-gray-100">
                    <span className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      {item.priority}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-gray-800">{item.item}</h4>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          item.impact === '매우 높음' ? 'bg-red-100 text-red-700' :
                          item.impact === '높음' ? 'bg-orange-100 text-orange-700' :
                          item.impact === '장기적 높음' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>영향도: {item.impact}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
