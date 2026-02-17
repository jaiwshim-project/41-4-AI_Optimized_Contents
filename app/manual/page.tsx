'use client';

import Link from 'next/link';
import { downloadManualDocx } from '@/lib/generateManualDocx';
import Footer from '@/components/Footer';

export default function ManualPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-[14pt] font-bold text-gray-900">사용자 매뉴얼</h1>
                <p className="text-[9pt] text-gray-700">AIO/GEO Optimizer 사용 가이드</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => downloadManualDocx()}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm border-2 border-sky-300"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                DOCX 다운로드
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-800 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border-2 border-violet-300 hover:border-violet-400"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                홈으로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* 소개 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4">AIO/GEO Optimizer란?</h2>
          <p className="text-[9pt] text-gray-800 leading-relaxed">
            AIO/GEO Optimizer는 AI 검색엔진(AI Overview, Generative Engine)에 최적화된 콘텐츠를 작성할 수 있도록
            도와주는 분석 도구입니다. Claude API를 활용하여 콘텐츠를 다각도로 분석하고,
            AI 검색 결과에 노출될 가능성을 높이기 위한 구체적인 개선 방안을 제시합니다.
          </p>
        </section>

        {/* 시작하기 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">1</span>
            시작하기
          </h2>
          <div className="space-y-4 text-gray-800">
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">콘텐츠 입력</h3>
              <p className="text-[9pt]">분석하고 싶은 콘텐츠(블로그 글, 기사, 웹페이지 텍스트 등)를 텍스트 입력 영역에 붙여넣기 합니다.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">타겟 키워드 (선택)</h3>
              <p className="text-[9pt]">최적화하려는 주요 검색 키워드를 입력합니다. 입력하면 해당 키워드에 대한 맞춤 분석을 제공합니다.</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">URL (선택)</h3>
              <p className="text-[9pt]">콘텐츠가 게시된 URL을 입력하면 추가적인 컨텍스트를 바탕으로 분석합니다.</p>
            </div>
          </div>
        </section>

        {/* 분석 결과 탭 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-sky-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">2</span>
            분석 결과 이해하기
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">종합 개요</h3>
              <p className="text-[9pt] text-gray-800">전체 AIO/GEO 점수와 주요 지표를 한눈에 확인할 수 있는 대시보드입니다. 콘텐츠의 전반적인 AI 최적화 수준을 빠르게 파악할 수 있습니다.</p>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">AIO 분석 (AI Overview)</h3>
              <p className="text-[9pt] text-gray-800">Google AI Overview에 콘텐츠가 인용될 가능성을 분석합니다. 구조화된 답변 형식, 신뢰성, 간결성 등 AIO 노출에 영향을 미치는 요소를 평가합니다.</p>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">GEO 분석 (Generative Engine Optimization)</h3>
              <p className="text-[9pt] text-gray-800">생성형 AI 엔진이 콘텐츠를 이해하고 활용하기 쉬운 정도를 분석합니다. 의미적 명확성, 전문성, 컨텍스트 완성도 등을 평가합니다.</p>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">키워드 분석</h3>
              <p className="text-[9pt] text-gray-800">콘텐츠 내 주요 키워드의 분포, 밀도, 관련성을 분석합니다. 타겟 키워드가 입력된 경우 해당 키워드의 최적화 상태를 집중적으로 확인합니다.</p>
            </div>
            <hr className="border-gray-100" />
            <div>
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">개선 제안</h3>
              <p className="text-[9pt] text-gray-800">분석 결과를 바탕으로 콘텐츠 개선을 위한 구체적이고 실행 가능한 제안을 제공합니다. 우선순위별로 정리되어 효율적인 최적화 작업이 가능합니다.</p>
            </div>
          </div>
        </section>

        {/* 점수 해석 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-purple-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">3</span>
            점수 해석 가이드
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">0 ~ 39</div>
              <div className="text-sm font-medium text-red-700">개선 필요</div>
              <p className="text-[7pt] text-red-700 mt-2">AI 검색엔진 최적화가 부족한 상태입니다. 제안사항을 참고하여 전면적인 개선이 필요합니다.</p>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">40 ~ 69</div>
              <div className="text-sm font-medium text-yellow-700">보통</div>
              <p className="text-[7pt] text-yellow-700 mt-2">기본적인 최적화는 되어 있으나, 핵심 부분에서 추가 개선의 여지가 있습니다.</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">70 ~ 100</div>
              <div className="text-sm font-medium text-green-700">우수</div>
              <p className="text-[7pt] text-green-700 mt-2">AI 검색엔진에 잘 최적화된 콘텐츠입니다. 세부 사항을 미세 조정하면 더욱 좋아집니다.</p>
            </div>
          </div>
        </section>

        {/* 용어 설명 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-teal-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">4</span>
            용어 설명
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <span className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">AIO</span>
              <span className="text-[9pt] text-gray-800">AI Overview의 약자. Google 검색 결과 상단에 AI가 생성하는 요약 답변입니다.</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex gap-4">
              <span className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">GEO</span>
              <span className="text-[9pt] text-gray-800">Generative Engine Optimization의 약자. 생성형 AI 검색엔진에 최적화하는 전략입니다.</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex gap-4">
              <span className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">키워드 밀도</span>
              <span className="text-[9pt] text-gray-800">전체 콘텐츠 대비 특정 키워드가 차지하는 비율입니다. 적절한 밀도를 유지하는 것이 중요합니다.</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex gap-4">
              <span className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">구조화 데이터</span>
              <span className="text-[9pt] text-gray-800">AI가 콘텐츠를 쉽게 이해할 수 있도록 정리된 형식(리스트, 표, Q&A 등)의 데이터입니다.</span>
            </div>
            <hr className="border-gray-100" />
            <div className="flex gap-4">
              <span className="font-semibold text-gray-800 whitespace-nowrap min-w-[120px]">E-E-A-T</span>
              <span className="text-[9pt] text-gray-800">경험(Experience), 전문성(Expertise), 권위(Authoritativeness), 신뢰성(Trustworthiness)의 약자로, Google이 콘텐츠 품질을 평가하는 기준입니다.</span>
            </div>
          </div>
        </section>

        {/* ===== AIO/GEO 최적화 실전 가이드 ===== */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-indigo-200" /></div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-6 text-[14pt] font-bold text-indigo-600">AIO/GEO 최적화 실전 가이드</span>
          </div>
        </div>

        {/* 5. 콘텐츠 구조 재구성 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-rose-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center text-sm font-bold">5</span>
            콘텐츠 구조 재구성법
          </h2>
          <p className="text-[9pt] text-gray-800 mb-5">AI 검색엔진은 잘 구조화된 콘텐츠를 선호합니다. 다음 원칙에 따라 콘텐츠를 재구성하면 AIO/GEO 점수가 크게 향상됩니다.</p>

          <div className="space-y-4">
            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                역피라미드 구조 적용
              </h3>
              <p className="text-[9pt] text-gray-800 mb-3">가장 중요한 정보를 글 상단에, 세부 내용은 하단에 배치합니다. AI는 상단 콘텐츠를 우선적으로 인용합니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-[9pt] font-medium text-red-500 mb-2">Before</p>
                  <p className="text-[9pt] text-gray-800">서론 &rarr; 배경 설명 &rarr; 상세 내용 &rarr; <strong>핵심 결론</strong></p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-[9pt] font-medium text-green-500 mb-2">After</p>
                  <p className="text-[9pt] text-gray-800"><strong>핵심 결론/답변</strong> &rarr; 상세 근거 &rarr; 배경 설명 &rarr; 부가 정보</p>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                명확한 헤딩 계층 구조
              </h3>
              <p className="text-[9pt] text-gray-800 mb-3">H1 &rarr; H2 &rarr; H3 순서로 논리적인 계층을 만듭니다. 각 헤딩은 해당 섹션의 내용을 정확히 요약해야 합니다.</p>
              <div className="bg-white rounded-lg p-4 border border-rose-100 text-[9pt] text-gray-700 space-y-1">
                <p className="font-bold">H1: AI 콘텐츠 최적화 완벽 가이드</p>
                <p className="ml-4 font-semibold text-gray-800">&nbsp;&nbsp;H2: AIO란 무엇인가?</p>
                <p className="ml-8 text-gray-700">&nbsp;&nbsp;&nbsp;&nbsp;H3: AIO의 작동 원리</p>
                <p className="ml-8 text-gray-700">&nbsp;&nbsp;&nbsp;&nbsp;H3: AIO 노출 조건</p>
                <p className="ml-4 font-semibold text-gray-800">&nbsp;&nbsp;H2: GEO 최적화 전략</p>
                <p className="ml-8 text-gray-700">&nbsp;&nbsp;&nbsp;&nbsp;H3: 구조화 데이터 활용</p>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                리스트와 표 적극 활용
              </h3>
              <p className="text-[9pt] text-gray-800 mb-3">AI는 글 형태보다 리스트, 표, 단계별 가이드 형식의 데이터를 더 쉽게 파싱하고 인용합니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-[9pt] font-medium text-red-500 mb-2">Before</p>
                  <p className="text-[9pt] text-gray-800">콘텐츠 최적화를 위해서는 키워드를 적절히 배치하고 헤딩 구조를 잡아야 하며 내부 링크를 활용하는 것이 좋습니다.</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-[9pt] font-medium text-green-500 mb-2">After</p>
                  <div className="text-[9pt] text-gray-800">
                    <p className="font-medium mb-1">콘텐츠 최적화 3단계:</p>
                    <p>1. 키워드를 제목, 소제목, 본문에 자연스럽게 배치</p>
                    <p>2. H1~H3 헤딩으로 논리적 구조 설계</p>
                    <p>3. 관련 페이지로의 내부 링크 추가</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-rose-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-6 h-6 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                한 문단 한 주제 원칙
              </h3>
              <p className="text-[9pt] text-gray-800">각 문단은 하나의 명확한 주제만 다룹니다. 2~4문장으로 간결하게 작성하고, AI가 특정 문단을 독립적으로 인용할 수 있게 합니다. 긴 문단은 여러 개로 분리하세요.</p>
            </div>
          </div>
        </section>

        {/* 6. 키워드 최적화 방법 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-amber-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-sm font-bold">6</span>
            키워드 최적화 방법
          </h2>
          <p className="text-[9pt] text-gray-800 mb-5">올바른 키워드 전략은 AI 검색 노출의 핵심입니다. 단순한 키워드 반복이 아닌, 의미 중심의 최적화가 필요합니다.</p>

          <div className="space-y-4">
            <div className="bg-amber-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">키워드 배치 핵심 위치</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                {['제목 (H1)', '소제목 (H2~H3)', '첫 문단 (100자 이내)', '메타 디스크립션'].map((pos) => (
                  <div key={pos} className="bg-white border border-amber-200 rounded-lg p-2 text-center">
                    <p className="text-[9pt] font-medium text-amber-700">{pos}</p>
                  </div>
                ))}
              </div>
              <p className="text-[9pt] text-gray-800">핵심 키워드는 위 4곳에 반드시 포함시키세요. AI는 이 위치의 텍스트를 콘텐츠 주제 파악에 가장 많이 활용합니다.</p>
            </div>

            <div className="bg-amber-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">적정 키워드 밀도</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9pt] text-gray-800">핵심 키워드</span>
                    <span className="text-[9pt] font-medium text-green-600">1.5% ~ 2.5% (적정)</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3 relative">
                    <div className="bg-green-400 h-3 rounded-full" style={{ width: '50%' }} />
                    <div className="absolute top-0 left-[30%] w-[40%] h-3 border-2 border-green-600 rounded-full border-dashed" />
                  </div>
                  <p className="text-[9pt] text-gray-700 mt-1">1% 미만이면 주제 인식 부족, 3% 초과하면 키워드 스터핑으로 감점</p>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-[9pt] text-gray-800">관련 키워드 / LSI 키워드</span>
                    <span className="text-sm font-medium text-blue-600">0.5% ~ 1.5%</span>
                  </div>
                  <p className="text-[9pt] text-gray-700">핵심 키워드의 동의어, 유사어를 자연스럽게 분산 배치</p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">의미적 키워드 확장 (Semantic SEO)</h3>
              <p className="text-[9pt] text-gray-800 mb-3">AI는 단순 키워드 매칭이 아니라 의미를 이해합니다. 관련 주제를 폭넓게 다뤄야 합니다.</p>
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <p className="text-[9pt] font-medium text-amber-700 mb-2">예시: 핵심 키워드가 &quot;콘텐츠 마케팅&quot;인 경우</p>
                <div className="flex flex-wrap gap-2">
                  {['콘텐츠 전략', 'SEO 최적화', '블로그 마케팅', '타겟 오디언스', 'CTA', '전환율', '콘텐츠 캘린더', 'B2B 마케팅', '스토리텔링', '데이터 기반 마케팅'].map((kw) => (
                    <span key={kw} className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">{kw}</span>
                  ))}
                </div>
                <p className="text-[9pt] text-gray-700 mt-2">이처럼 주변 관련 키워드를 자연스럽게 포함하면 의미적 완성도가 높아집니다.</p>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-2">롱테일 키워드 활용</h3>
              <p className="text-[9pt] text-gray-800 mb-3">구체적인 질문형 롱테일 키워드를 소제목이나 FAQ에 활용하면 AI 검색 노출 확률이 높아집니다.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-red-200">
                  <p className="text-[9pt] font-medium text-red-500 mb-1">일반 키워드</p>
                  <p className="text-[9pt] text-gray-700">콘텐츠 최적화</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <p className="text-[9pt] font-medium text-green-500 mb-1">롱테일 키워드</p>
                  <p className="text-[9pt] text-gray-700">AI 검색엔진에 콘텐츠를 최적화하는 방법</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. E-E-A-T 강화법 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-violet-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center text-sm font-bold">7</span>
            E-E-A-T 강화법
          </h2>
          <p className="text-[9pt] text-gray-800 mb-5">E-E-A-T(경험, 전문성, 권위, 신뢰)는 AI가 콘텐츠를 인용할지 결정하는 핵심 기준입니다. 각 요소를 강화하는 구체적인 방법을 안내합니다.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Experience */}
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-blue-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">E</span>
                <h3 className="text-[10pt] font-semibold text-blue-800">Experience (경험)</h3>
              </div>
              <p className="text-[9pt] text-gray-800 mb-3">실제 경험을 바탕으로 한 콘텐츠임을 보여주세요.</p>
              <ul className="space-y-2">
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  &quot;직접 테스트해본 결과...&quot; 등 1인칭 경험 서술
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  실제 사례, 스크린샷, 결과 데이터 포함
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  구체적인 시행착오와 교훈 공유
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">&#10003;</span>
                  날짜, 기간 등 시간적 맥락 제시
                </li>
              </ul>
            </div>

            {/* Expertise */}
            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">E</span>
                <h3 className="text-[10pt] font-semibold text-purple-800">Expertise (전문성)</h3>
              </div>
              <p className="text-[9pt] text-gray-800 mb-3">해당 분야의 깊이 있는 지식을 증명하세요.</p>
              <ul className="space-y-2">
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  전문 용어를 정확하게 사용하고 쉽게 설명
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  깊이 있는 분석과 독자적인 인사이트 제시
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  저자 프로필, 자격/경력 소개 포함
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">&#10003;</span>
                  관련 연구, 논문, 보고서 인용
                </li>
              </ul>
            </div>

            {/* Authoritativeness */}
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-amber-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">A</span>
                <h3 className="text-[10pt] font-semibold text-amber-800">Authoritativeness (권위)</h3>
              </div>
              <p className="text-[9pt] text-gray-800 mb-3">해당 분야에서의 권위를 구축하세요.</p>
              <ul className="space-y-2">
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">&#10003;</span>
                  공신력 있는 출처 인용 (학술 논문, 공공 데이터 등)
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">&#10003;</span>
                  업계 전문가 인터뷰, 의견 인용
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">&#10003;</span>
                  수상 경력, 미디어 소개 등 사회적 증거
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">&#10003;</span>
                  관련 주제에 대한 다수의 콘텐츠 보유
                </li>
              </ul>
            </div>

            {/* Trustworthiness */}
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center text-xs font-bold">T</span>
                <h3 className="text-[10pt] font-semibold text-emerald-800">Trustworthiness (신뢰)</h3>
              </div>
              <p className="text-[9pt] text-gray-800 mb-3">콘텐츠의 정확성과 신뢰도를 높이세요.</p>
              <ul className="space-y-2">
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">&#10003;</span>
                  통계와 수치에 출처 명시 (예: &quot;2025년 가트너 보고서에 따르면...&quot;)
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">&#10003;</span>
                  최신 정보로 정기적 업데이트 (&quot;최종 수정: 2026.02&quot;)
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">&#10003;</span>
                  팩트 체크 완료 표시, 검수 과정 언급
                </li>
                <li className="text-[9pt] text-gray-800 flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">&#10003;</span>
                  투명한 저자 정보, 연락처, 정정 정책
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 8. FAQ 생성법 */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-cyan-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center text-sm font-bold">8</span>
            FAQ 섹션 생성법
          </h2>
          <p className="text-[9pt] text-gray-800 mb-5">FAQ는 AI Overview에 직접 인용될 확률이 가장 높은 콘텐츠 형식입니다. 효과적인 FAQ를 만드는 방법을 안내합니다.</p>

          <div className="space-y-4">
            <div className="bg-cyan-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3">FAQ 작성 원칙</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-200 text-cyan-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                  <div>
                    <p className="text-[10pt] font-medium text-gray-800">실제 사용자 질문 기반</p>
                    <p className="text-[9pt] text-gray-700">Google 자동완성, &quot;People Also Ask&quot;, 네이버 연관검색어에서 실제 질문을 수집하세요.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-200 text-cyan-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                  <div>
                    <p className="text-[10pt] font-medium text-gray-800">답변은 2~4문장으로 간결하게</p>
                    <p className="text-[9pt] text-gray-700">AI가 그대로 인용할 수 있는 길이가 이상적입니다. 핵심을 먼저, 부연을 나중에.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-200 text-cyan-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                  <div>
                    <p className="text-[10pt] font-medium text-gray-800">질문에 키워드 포함</p>
                    <p className="text-[9pt] text-gray-700">질문 자체에 타겟 키워드가 자연스럽게 들어가도록 구성하세요.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-cyan-200 text-cyan-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                  <div>
                    <p className="text-[10pt] font-medium text-gray-800">5~10개의 FAQ가 적정</p>
                    <p className="text-[9pt] text-gray-700">너무 적으면 커버리지 부족, 너무 많으면 품질이 떨어집니다.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3">효과적인 FAQ 예시</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 border border-cyan-200">
                  <p className="text-[10pt] font-semibold text-cyan-700 mb-2">Q: AIO(AI Overview)에 콘텐츠가 노출되려면 어떻게 해야 하나요?</p>
                  <p className="text-[9pt] text-gray-800">AIO에 노출되려면 콘텐츠를 질문-답변 형식으로 구성하고, 핵심 답변을 2~3문장으로 간결하게 작성해야 합니다. 또한 통계와 출처를 포함하여 신뢰도를 높이고, 명확한 헤딩 구조로 AI가 내용을 쉽게 파악할 수 있도록 해야 합니다.</p>
                </div>
                <div className="bg-white rounded-lg p-4 border border-cyan-200">
                  <p className="text-[10pt] font-semibold text-cyan-700 mb-2">Q: GEO 최적화와 기존 SEO의 차이점은 무엇인가요?</p>
                  <p className="text-[9pt] text-gray-800">기존 SEO가 검색엔진 랭킹 알고리즘에 초점을 맞추는 반면, GEO는 생성형 AI가 콘텐츠를 이해하고 인용하기 쉽도록 최적화하는 전략입니다. 의미적 완성도, E-E-A-T 신호, 구조화된 데이터 형식이 GEO의 핵심 요소입니다.</p>
                </div>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3">FAQ 질문 유형별 템플릿</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">정의형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[키워드]란 무엇인가요?&quot;</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">방법형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[키워드]를 하는 방법은?&quot;</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">비교형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[A]와 [B]의 차이점은?&quot;</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">이유형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[키워드]가 중요한 이유는?&quot;</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">목록형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[키워드]의 종류/유형은?&quot;</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-cyan-100">
                  <p className="text-[9pt] font-medium text-cyan-600 mb-1">비용/시간형</p>
                  <p className="text-[9pt] text-gray-800">&quot;[키워드]에 얼마나 걸리나요?&quot;</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 9. 인용 최적화 (Citability) */}
        <section className="bg-white rounded-2xl shadow-sm border-2 border-pink-200 p-8">
          <h2 className="text-[14pt] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center text-sm font-bold">9</span>
            AI 인용 최적화 (Citability)
          </h2>
          <p className="text-[9pt] text-gray-800 mb-5">AI가 콘텐츠를 인용하기 쉽게 만드는 것이 AIO/GEO의 최종 목표입니다.</p>

          <div className="space-y-4">
            <div className="bg-pink-50 rounded-xl p-5">
              <h3 className="text-[12pt] font-semibold text-gray-800 mb-3">인용되기 쉬운 문장 작성법</h3>
              <div className="space-y-3">
                {[
                  { title: '정의문 포함', desc: '"[주제]란 [정의]를 말합니다" 형태의 명확한 정의를 포함하세요.', example: '"AIO란 Google 검색 결과 상단에 AI가 자동 생성하는 요약 답변입니다."' },
                  { title: '수치와 통계 활용', desc: '구체적인 숫자를 포함하면 AI가 팩트로 인용합니다.', example: '"2025년 기준 전체 검색의 약 40%에서 AI Overview가 표시됩니다."' },
                  { title: '단계별 설명', desc: '"첫째... 둘째... 셋째..." 형태의 순서가 있는 설명', example: '"GEO 최적화는 3단계로 진행됩니다. 첫째, 콘텐츠 구조화..."' },
                  { title: '비교/대조 문장', desc: '"A는 ~인 반면, B는 ~입니다" 형태', example: '"SEO는 키워드 랭킹에 집중하는 반면, GEO는 AI의 의미 이해에 초점을 맞춥니다."' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-lg p-4 border border-pink-100">
                    <p className="text-[10pt] font-medium text-pink-700 mb-1">{item.title}</p>
                    <p className="text-[9pt] text-gray-700 mb-2">{item.desc}</p>
                    <p className="text-[9pt] text-gray-700 bg-pink-50 px-3 py-2 rounded-lg italic">{item.example}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 팁 */}
        <section className="bg-amber-50 rounded-2xl shadow-sm border-2 border-blue-400 p-8">
          <h2 className="text-[14pt] font-bold text-purple-700 mb-4">최적화 팁</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9pt] text-purple-800">질문-답변 형식으로 콘텐츠를 구성하면 AI Overview에 인용될 확률이 높아집니다.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9pt] text-purple-800">통계, 수치, 출처를 포함하여 콘텐츠의 신뢰도를 높이세요.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9pt] text-purple-800">명확한 헤딩 구조(H1, H2, H3)와 리스트를 활용하여 콘텐츠를 구조화하세요.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9pt] text-purple-800">핵심 정보를 글 상단에 배치하여 AI가 빠르게 핵심을 파악할 수 있도록 하세요.</span>
            </li>
            <li className="flex items-start gap-3">
              <svg className="w-5 h-5 mt-0.5 flex-shrink-0 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9pt] text-purple-800">분석 후 개선 제안을 적용하고 재분석하여 점수 변화를 확인하세요.</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}
