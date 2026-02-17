'use client';

import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiKeyPanel from '@/components/ApiKeyPanel';
import type { ContentCategory, GenerateResponse } from '@/lib/types';

const categories: { id: ContentCategory; label: string; description: string; icon: string; color: string; bgIdle: string }[] = [
  {
    id: 'blog',
    label: '블로그 포스트',
    description: 'SEO 최적화된 블로그 글 작성',
    icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z',
    color: 'from-blue-500 via-blue-600 to-indigo-600 border-blue-300 shadow-blue-200',
    bgIdle: 'bg-blue-50 border-blue-200 hover:border-blue-400 hover:shadow-blue-100',
  },
  {
    id: 'product',
    label: '제품 설명',
    description: '전환율 높은 제품 소개 콘텐츠',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    color: 'from-emerald-500 via-emerald-600 to-teal-600 border-emerald-300 shadow-emerald-200',
    bgIdle: 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:shadow-emerald-100',
  },
  {
    id: 'faq',
    label: 'FAQ 페이지',
    description: 'AI 검색에 최적화된 FAQ',
    icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    color: 'from-amber-500 via-orange-500 to-amber-600 border-amber-300 shadow-amber-200',
    bgIdle: 'bg-amber-50 border-amber-200 hover:border-amber-400 hover:shadow-amber-100',
  },
  {
    id: 'howto',
    label: 'How-to 가이드',
    description: '단계별 안내 콘텐츠 작성',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01',
    color: 'from-violet-500 via-purple-600 to-indigo-600 border-violet-300 shadow-violet-200',
    bgIdle: 'bg-violet-50 border-violet-200 hover:border-violet-400 hover:shadow-violet-100',
  },
  {
    id: 'landing',
    label: '랜딩 페이지',
    description: '설득력 있는 랜딩 카피 작성',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    color: 'from-pink-500 via-rose-500 to-pink-600 border-pink-300 shadow-pink-200',
    bgIdle: 'bg-pink-50 border-pink-200 hover:border-pink-400 hover:shadow-pink-100',
  },
  {
    id: 'technical',
    label: '기술 문서',
    description: '구조화된 기술 문서 작성',
    icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
    color: 'from-cyan-500 via-sky-500 to-cyan-600 border-cyan-300 shadow-cyan-200',
    bgIdle: 'bg-cyan-50 border-cyan-200 hover:border-cyan-400 hover:shadow-cyan-100',
  },
  {
    id: 'social',
    label: '소셜 미디어',
    description: 'SNS 최적화 콘텐츠 생성',
    icon: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
    color: 'from-rose-500 via-red-500 to-rose-600 border-rose-300 shadow-rose-200',
    bgIdle: 'bg-rose-50 border-rose-200 hover:border-rose-400 hover:shadow-rose-100',
  },
  {
    id: 'email',
    label: '이메일 마케팅',
    description: '전환율 높은 이메일 작성',
    icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    color: 'from-indigo-500 via-blue-600 to-indigo-600 border-indigo-300 shadow-indigo-200',
    bgIdle: 'bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:shadow-indigo-100',
  },
];

const toneOptions = [
  { value: '전문적이고 신뢰감 있는', label: '전문적' },
  { value: '친근하고 대화체의', label: '친근한' },
  { value: '설득력 있고 강렬한', label: '설득적' },
  { value: '간결하고 명확한', label: '간결한' },
  { value: '스토리텔링 중심의', label: '스토리텔링' },
];

export default function GeneratePage() {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [topic, setTopic] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [tone, setTone] = useState('전문적이고 신뢰감 있는');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleRegenerate = async () => {
    if (!selectedCategory || !result || !editNotes.trim()) return;
    setIsRegenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          topic: topic.trim(),
          targetKeyword: targetKeyword.trim() || undefined,
          tone,
          additionalNotes: `기존 생성된 콘텐츠를 아래 수정 요청에 따라 다시 작성해주세요.\n\n[수정/추가 요청]\n${editNotes.trim()}\n\n[기존 콘텐츠]\n${result.content}`,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '콘텐츠 재생성에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data);
      setEditNotes('');
      setShowEditInput(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !topic.trim()) return;
    setIsGenerating(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          topic: topic.trim(),
          targetKeyword: targetKeyword.trim() || undefined,
          tone,
          additionalNotes: additionalNotes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '콘텐츠 생성에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setTopic('');
    setTargetKeyword('');
    setTone('전문적이고 신뢰감 있는');
    setAdditionalNotes('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showApiKeyButton
        onToggleApiKey={() => setShowApiKeyInput(!showApiKeyInput)}
        apiKeyOpen={showApiKeyInput}
      />

      {/* API Key 입력 패널 */}
      <ApiKeyPanel visible={showApiKeyInput} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 결과가 없을 때: 카테고리 선택 + 입력 폼 */}
        {!result && (
          <>
            {/* 카테고리 선택 */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">콘텐츠 유형 선택</h2>
              <p className="text-sm text-gray-500 mb-5">생성할 콘텐츠의 유형을 선택하세요</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`relative p-4 rounded-xl text-left transition-all duration-200 border-2 ${
                        isSelected
                          ? `bg-gradient-to-br ${cat.color} text-white shadow-lg`
                          : `${cat.bgIdle} hover:shadow-md`
                      }`}
                    >
                      <svg
                        className={`w-6 h-6 mb-2 ${isSelected ? 'text-white' : 'text-gray-500'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cat.icon} />
                      </svg>
                      <p className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                        {cat.label}
                      </p>
                      <p className={`text-xs mt-0.5 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                        {cat.description}
                      </p>
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 입력 폼 */}
            {selectedCategory && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-sky-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">콘텐츠 정보 입력</h2>
                <p className="text-sm text-gray-500 mb-5">
                  {categories.find(c => c.id === selectedCategory)?.label} 생성을 위한 정보를 입력하세요
                </p>

                <div className="space-y-4">
                  {/* 주제 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      주제 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="예: 2024년 AI 마케팅 트렌드, 홈트레이닝 초보자 가이드"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* 타겟 키워드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">타겟 키워드 (선택)</label>
                    <input
                      type="text"
                      value={targetKeyword}
                      onChange={(e) => setTargetKeyword(e.target.value)}
                      placeholder="예: AI 마케팅, 홈트레이닝"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400"
                    />
                  </div>

                  {/* 톤/스타일 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">톤/스타일</label>
                    <div className="flex flex-wrap gap-2">
                      {toneOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setTone(opt.value)}
                          className={`px-4 py-2 text-sm rounded-xl border-2 transition-all ${
                            tone === opt.value
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-sky-300'
                              : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 추가 요구사항 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">추가 요구사항 (선택)</label>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="특별한 요구사항이 있다면 입력하세요..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 resize-none"
                    />
                  </div>

                  {/* 생성 버튼 */}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !topic.trim()}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-sky-300 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        AI 콘텐츠 생성 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AIO/GEO 최적화 콘텐츠 생성
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* 에러 */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* 로딩 애니메이션 */}
            {isGenerating && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-blue-200 p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI가 콘텐츠를 생성하고 있습니다</h3>
                <p className="text-sm text-gray-500">AIO/GEO에 최적화된 고품질 콘텐츠를 작성 중입니다...</p>
              </div>
            )}

            {/* 초기 안내 (카테고리 미선택 시) */}
            {!selectedCategory && !isGenerating && (
              <div className="bg-white rounded-2xl shadow-sm border-2 border-violet-200 p-12 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">콘텐츠 유형을 선택하세요</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  위에서 원하는 콘텐츠 유형을 선택하면 AIO/GEO에 최적화된
                  고품질 콘텐츠를 AI가 자동으로 생성합니다.
                </p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-lg mx-auto">
                  {[
                    { label: 'AIO 최적화', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
                    { label: 'E-E-A-T 내장', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
                    { label: 'FAQ 자동생성', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
                    { label: 'SEO 친화적', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
                  ].map((feature) => (
                    <div key={feature.label} className={`${feature.bg} rounded-xl px-3 py-2.5 border-2 ${feature.border}`}>
                      <p className={`text-xs font-semibold ${feature.text}`}>{feature.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* 결과 표시 */}
        {result && (
          <>
            {/* 결과 헤더 */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-emerald-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{result.title}</h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-gray-500">
                      {result.metadata.wordCount.toLocaleString()}자
                    </span>
                    <span className="text-xs text-gray-500">{result.metadata.estimatedReadTime}</span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border-2 border-emerald-200">
                      {categories.find(c => c.id === selectedCategory)?.label}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border-2 border-sky-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                    </svg>
                    {copied ? '복사됨!' : '복사'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all border-2 border-violet-300 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    새로 만들기
                  </button>
                </div>
              </div>

              {/* SEO 팁 */}
              {result.metadata.seoTips.length > 0 && (
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    AIO/GEO SEO 팁
                  </h3>
                  <ul className="space-y-1">
                    {result.metadata.seoTips.map((tip, i) => (
                      <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                        <span className="text-blue-400 mt-0.5">&#8226;</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 생성된 콘텐츠 */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6 relative">
              {/* 상단 버튼 그룹 */}
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!contentRef.current) return;
                    const range = document.createRange();
                    range.selectNodeContents(contentRef.current);
                    const selection = window.getSelection();
                    if (selection) {
                      selection.removeAllRanges();
                      selection.addRange(range);
                    }
                    const html = contentRef.current.innerHTML;
                    const blob = new Blob([html], { type: 'text/html' });
                    const textBlob = new Blob([contentRef.current.innerText], { type: 'text/plain' });
                    navigator.clipboard.write([
                      new ClipboardItem({
                        'text/html': blob,
                        'text/plain': textBlob,
                      }),
                    ]).then(() => {
                      selection?.removeAllRanges();
                      setCopiedContent(true);
                      setTimeout(() => setCopiedContent(false), 2000);
                    });
                  }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 ${
                    copiedContent
                      ? 'bg-emerald-500 text-white border-emerald-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:border-indigo-300'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedContent ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                  </svg>
                  {copiedContent ? '복사됨!' : '복사'}
                </button>
                <button
                  onClick={() => setShowEditInput(!showEditInput)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all border-2 ${
                    showEditInput
                      ? 'bg-violet-500 text-white border-violet-300'
                      : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100 hover:border-violet-300'
                  }`}
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  수정
                </button>
              </div>
              <div className="prose prose-sm max-w-none" ref={contentRef}>
                <div
                  className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: result.content
                      .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-gray-900 mt-6 mb-2">$1</h3>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>')
                      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
                      .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
                      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
                      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 py-1 my-3 bg-indigo-50 rounded-r-lg text-gray-700">$1</blockquote>')
                  }}
                />
              </div>

              {/* 수정 입력창 */}
              {showEditInput && (
                <div className="mt-6 pt-5 border-t-2 border-violet-200">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <h4 className="text-sm font-semibold text-violet-800">콘텐츠 수정 요청</h4>
                  </div>
                  <textarea
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="수정하거나 추가하고 싶은 내용을 입력하세요...&#10;예: '서론을 더 강렬하게', '통계 데이터 추가', 'FAQ 섹션 보강'"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-gray-400 resize-none bg-violet-50/50"
                  />
                  <button
                    onClick={handleRegenerate}
                    disabled={isRegenerating || !editNotes.trim()}
                    className="mt-3 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-violet-300 flex items-center justify-center gap-2"
                  >
                    {isRegenerating ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        수정 반영하여 재생성 중...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        재생성
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
