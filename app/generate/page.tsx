'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiKeyPanel from '@/components/ApiKeyPanel';
import type { ContentCategory, GenerateResponse } from '@/lib/types';
import { saveHistoryItem, addRevision, generateId } from '@/lib/history';

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
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    industry: '',
    customIndustry: '',
    mainProduct: '',
    productDescription: '',
    priceRange: '',
    mainBenefit: '',
    targetAudience: '',
    customerNeeds: '',
    strengths: [] as string[],
    newStrength: '',
    uniquePoint: '',
    location: '',
    website: '',
  });
  const [bizSaved, setBizSaved] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // localStorage에서 비즈니스 정보 로드
  useEffect(() => {
    const saved = localStorage.getItem('aio-business-info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBusinessInfo(prev => ({ ...prev, ...parsed, newStrength: '' }));
      } catch {}
    }
  }, []);

  // 변경 시 자동 저장 (1초 디바운스)
  const autoSave = useCallback((info: typeof businessInfo) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      const toSave = { ...info, newStrength: '' };
      localStorage.setItem('aio-business-info', JSON.stringify(toSave));
      setBizSaved(true);
      setTimeout(() => setBizSaved(false), 2000);
    }, 1000);
  }, []);

  const saveBusinessInfo = () => {
    const toSave = { ...businessInfo, newStrength: '' };
    localStorage.setItem('aio-business-info', JSON.stringify(toSave));
  };

  const updateBiz = (field: string, value: string) => {
    setBusinessInfo(prev => {
      const next = { ...prev, [field]: value };
      autoSave(next);
      return next;
    });
  };

  const addStrength = () => {
    const val = businessInfo.newStrength.trim();
    if (val && businessInfo.strengths.length < 5 && !businessInfo.strengths.includes(val)) {
      setBusinessInfo(prev => {
        const next = { ...prev, strengths: [...prev.strengths, val], newStrength: '' };
        autoSave(next);
        return next;
      });
    }
  };

  const removeStrength = (index: number) => {
    setBusinessInfo(prev => {
      const next = { ...prev, strengths: prev.strengths.filter((_, i) => i !== index) };
      autoSave(next);
      return next;
    });
  };

  const industries = [
    { value: '음식/요식업', label: '음식/요식업' },
    { value: '소매/유통', label: '소매/유통' },
    { value: '뷰티/미용', label: '뷰티/미용' },
    { value: '헬스/피트니스', label: '헬스/피트니스' },
    { value: '교육/학원', label: '교육/학원' },
    { value: 'IT/테크', label: 'IT/테크' },
    { value: '의료/건강', label: '의료/건강' },
    { value: '금융/보험', label: '금융/보험' },
    { value: '부동산', label: '부동산' },
    { value: '여행/관광/숙박', label: '여행/관광/숙박' },
    { value: '법률/컨설팅', label: '법률/컨설팅' },
    { value: '기타', label: '기타' },
  ];

  const buildAdditionalNotes = () => {
    const parts: string[] = [];
    if (additionalNotes.trim()) parts.push(additionalNotes.trim());
    const biz = businessInfo;
    const bizParts: string[] = [];
    if (biz.companyName) bizParts.push(`회사/브랜드: ${biz.companyName}`);
    const ind = biz.industry === '기타' ? biz.customIndustry : biz.industry;
    if (ind) bizParts.push(`산업 분야: ${ind}`);
    if (biz.mainProduct) bizParts.push(`주요 제품/서비스: ${biz.mainProduct}`);
    if (biz.productDescription) bizParts.push(`제품 설명: ${biz.productDescription}`);
    if (biz.priceRange) bizParts.push(`가격대: ${biz.priceRange}`);
    if (biz.mainBenefit) bizParts.push(`주요 혜택: ${biz.mainBenefit}`);
    if (biz.targetAudience) bizParts.push(`타겟 고객: ${biz.targetAudience}`);
    if (biz.customerNeeds) bizParts.push(`고객 니즈: ${biz.customerNeeds}`);
    if (biz.strengths.length > 0) bizParts.push(`강점: ${biz.strengths.join(', ')}`);
    if (biz.uniquePoint) bizParts.push(`차별점: ${biz.uniquePoint}`);
    if (biz.location) bizParts.push(`위치: ${biz.location}`);
    if (biz.website) bizParts.push(`웹사이트: ${biz.website}`);
    if (bizParts.length > 0) parts.push(`[비즈니스 정보]\n${bizParts.join('\n')}`);
    return parts.length > 0 ? parts.join('\n\n') : undefined;
  };

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
      // 수정 이력 저장
      if (currentHistoryId) {
        const now = new Date();
        addRevision(currentHistoryId, {
          id: generateId(),
          date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
          editNotes: editNotes.trim(),
          result: data,
        });
      }
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
          additionalNotes: buildAdditionalNotes(),
        }),
      });

      // 비즈니스 정보 자동 저장
      saveBusinessInfo();

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '콘텐츠 생성에 실패했습니다.');
      }

      const data = await response.json();
      setResult(data);
      // 이력 저장
      const now = new Date();
      const historyId = generateId();
      setCurrentHistoryId(historyId);
      saveHistoryItem({
        id: historyId,
        type: 'generation',
        title: data.title || topic.trim(),
        summary: `${categories.find(c => c.id === selectedCategory)?.label || ''} | ${topic.trim()}`,
        date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
        category: selectedCategory || undefined,
        targetKeyword: targetKeyword.trim() || undefined,
        generateResult: data,
        topic: topic.trim(),
        tone,
        revisions: [],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const [copiedTitle, setCopiedTitle] = useState(false);

  const handleCopyTitle = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
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
            {/* 히어로 스텝 가이드 */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-100 p-5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-50/40 via-indigo-50/40 to-purple-50/40 pointer-events-none" />
              <div className="relative flex items-center justify-center gap-0">
                {/* 1단계 */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${showBusinessInfo ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 scale-105' : 'bg-teal-50 text-teal-700 border-2 border-teal-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${showBusinessInfo ? 'bg-white/20 text-white' : 'bg-teal-200 text-teal-700'}`}>1</div>
                  <div className="text-left">
                    <p className={`text-xs font-bold ${showBusinessInfo ? 'text-white/80' : 'text-teal-500'}`}>STEP 1</p>
                    <p className="text-sm font-semibold whitespace-nowrap">비즈니스 정보 입력</p>
                  </div>
                  <svg className={`w-4 h-4 shrink-0 ${showBusinessInfo ? 'text-white/60' : 'text-teal-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>

                {/* 화살표 커넥터 */}
                <div className="flex items-center px-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-teal-300 to-indigo-300" />
                  <svg className="w-5 h-5 text-indigo-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* 2단계 */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${selectedCategory ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-200 scale-105' : 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${selectedCategory ? 'bg-white/20 text-white' : 'bg-indigo-200 text-indigo-700'}`}>2</div>
                  <div className="text-left">
                    <p className={`text-xs font-bold ${selectedCategory ? 'text-white/80' : 'text-indigo-500'}`}>STEP 2</p>
                    <p className="text-sm font-semibold whitespace-nowrap">콘텐츠 유형 선택</p>
                  </div>
                  <svg className={`w-4 h-4 shrink-0 ${selectedCategory ? 'text-white/60' : 'text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                </div>

                {/* 화살표 커넥터 */}
                <div className="flex items-center px-3">
                  <div className="w-12 h-0.5 bg-gradient-to-r from-indigo-300 to-purple-300" />
                  <svg className="w-5 h-5 text-purple-400 -ml-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* 3단계 */}
                <div className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 ${isGenerating ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-200 scale-105 animate-pulse' : 'bg-purple-50 text-purple-700 border-2 border-purple-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${isGenerating ? 'bg-white/20 text-white' : 'bg-purple-200 text-purple-700'}`}>3</div>
                  <div className="text-left">
                    <p className={`text-xs font-bold ${isGenerating ? 'text-white/80' : 'text-purple-500'}`}>STEP 3</p>
                    <p className="text-sm font-semibold whitespace-nowrap">콘텐츠 생성</p>
                  </div>
                  <svg className={`w-4 h-4 shrink-0 ${isGenerating ? 'text-white/60' : 'text-purple-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* 비즈니스 정보 입력 (접이식) */}
            <div className="bg-white rounded-2xl shadow-sm border-2 border-teal-200 overflow-hidden">
              <button
                onClick={() => setShowBusinessInfo(!showBusinessInfo)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-teal-50 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      비즈니스 정보 입력
                      {bizSaved && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 animate-pulse">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          자동 저장됨
                        </span>
                      )}
                      {!bizSaved && businessInfo.companyName && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          저장된 정보 있음
                        </span>
                      )}
                    </h2>
                    <p className="text-xs text-gray-500">회사, 제품, 타겟 고객 정보를 입력하면 더 정확한 콘텐츠를 생성합니다</p>
                  </div>
                </div>
                <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showBusinessInfo ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showBusinessInfo && (
                <div className="px-6 pb-6 space-y-5 border-t border-teal-100 bg-gradient-to-b from-teal-50/30 to-white">
                  {/* 회사/브랜드 정보 */}
                  <div className="pt-5 bg-white/80 rounded-xl p-4 border border-teal-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">1</span>
                      회사/브랜드 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" value={businessInfo.companyName} onChange={e => updateBiz('companyName', e.target.value)} placeholder="회사/브랜드명" className="px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                      <input type="text" value={businessInfo.location} onChange={e => updateBiz('location', e.target.value)} placeholder="지역/위치 (예: 서울 강남구)" className="px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                    </div>
                    <input type="text" value={businessInfo.website} onChange={e => updateBiz('website', e.target.value)} placeholder="웹사이트/SNS (예: www.example.com)" className="mt-3 w-full px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                  </div>

                  {/* 산업 분야 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-amber-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">2</span>
                      산업 분야
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {industries.map(ind => (
                        <button
                          key={ind.value}
                          type="button"
                          onClick={() => updateBiz('industry', ind.value)}
                          className={`px-3 py-1.5 text-xs rounded-lg border-2 transition-all duration-200 hover:shadow-md hover:scale-105 ${
                            businessInfo.industry === ind.value
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-300 shadow-sm'
                              : 'bg-amber-50/50 text-amber-700 border-amber-200 hover:border-amber-400 hover:bg-amber-50'
                          }`}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>
                    {businessInfo.industry === '기타' && (
                      <input type="text" value={businessInfo.customIndustry} onChange={e => updateBiz('customIndustry', e.target.value)} placeholder="산업 분야를 직접 입력" className="mt-3 w-full px-4 py-2.5 bg-amber-50/50 border-2 border-amber-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-amber-400/60" />
                    )}
                  </div>

                  {/* 제품/서비스 정보 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-sky-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-sky-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">3</span>
                      제품/서비스 정보
                    </h3>
                    <input type="text" value={businessInfo.mainProduct} onChange={e => updateBiz('mainProduct', e.target.value)} placeholder="주요 제품/서비스 (예: 프리미엄 커피, 영어 회화 수업)" className="w-full px-4 py-2.5 bg-sky-50/50 border-2 border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder-sky-400/60" />
                    <textarea value={businessInfo.productDescription} onChange={e => updateBiz('productDescription', e.target.value)} placeholder="제품/서비스 상세 설명 (특징, 장점, 차별점)" rows={2} className="mt-3 w-full px-4 py-2.5 bg-sky-50/50 border-2 border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent resize-none placeholder-sky-400/60" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      <input type="text" value={businessInfo.priceRange} onChange={e => updateBiz('priceRange', e.target.value)} placeholder="가격대 (예: 5,000원~15,000원)" className="px-4 py-2.5 bg-sky-50/50 border-2 border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder-sky-400/60" />
                      <input type="text" value={businessInfo.mainBenefit} onChange={e => updateBiz('mainBenefit', e.target.value)} placeholder="주요 혜택 (예: 30% 할인, 무료 배송)" className="px-4 py-2.5 bg-sky-50/50 border-2 border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent placeholder-sky-400/60" />
                    </div>
                  </div>

                  {/* 타겟 고객 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-violet-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-violet-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">4</span>
                      타겟 고객
                    </h3>
                    <input type="text" value={businessInfo.targetAudience} onChange={e => updateBiz('targetAudience', e.target.value)} placeholder="주요 타겟 고객층 (예: 20-30대 직장인)" className="w-full px-4 py-2.5 bg-violet-50/50 border-2 border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-violet-400/60" />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['10대 청소년', '20대 대학생', '20-30대 직장인', '30-40대 주부', '40-50대 중년층', '시니어'].map(t => (
                        <button key={t} type="button" onClick={() => updateBiz('targetAudience', businessInfo.targetAudience ? `${businessInfo.targetAudience}, ${t}` : t)}
                          className="px-2.5 py-1 text-xs bg-violet-50 text-violet-600 rounded-lg border border-violet-200 hover:bg-violet-100 hover:border-violet-400 hover:scale-105 transition-all duration-200"
                        >{t}</button>
                      ))}
                    </div>
                    <textarea value={businessInfo.customerNeeds} onChange={e => updateBiz('customerNeeds', e.target.value)} placeholder="고객의 주요 고민/니즈" rows={2} className="mt-3 w-full px-4 py-2.5 bg-violet-50/50 border-2 border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-none placeholder-violet-400/60" />
                  </div>

                  {/* 강점 및 차별점 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-rose-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-rose-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">5</span>
                      강점 및 차별점
                    </h3>
                    {businessInfo.strengths.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {businessInfo.strengths.map((s, i) => (
                          <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-xs rounded-full shadow-sm">
                            {s}
                            <button type="button" onClick={() => removeStrength(i)} className="hover:text-rose-200 transition-colors">x</button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input type="text" value={businessInfo.newStrength} onChange={e => updateBiz('newStrength', e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addStrength())} placeholder="강점 입력 (최대 5개)" className="flex-1 px-4 py-2.5 bg-rose-50/50 border-2 border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent placeholder-rose-400/60" />
                      <button type="button" onClick={addStrength} className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium rounded-xl hover:from-rose-600 hover:to-pink-700 hover:shadow-md hover:scale-105 transition-all duration-200 border-2 border-rose-300 shadow-sm">추가</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {['합리적인 가격', '전문가 상담', '풍부한 경험', '빠른 서비스', '고품질', '친절한 응대'].map(s => (
                        <button key={s} type="button" onClick={() => { if (businessInfo.strengths.length < 5 && !businessInfo.strengths.includes(s)) setBusinessInfo(prev => { const next = { ...prev, strengths: [...prev.strengths, s] }; autoSave(next); return next; }); }}
                          className="px-2.5 py-1 text-xs bg-rose-50 text-rose-600 rounded-lg border border-rose-200 hover:bg-rose-100 hover:border-rose-400 hover:scale-105 transition-all duration-200"
                        >{s}</button>
                      ))}
                    </div>
                    <textarea value={businessInfo.uniquePoint} onChange={e => updateBiz('uniquePoint', e.target.value)} placeholder="경쟁사 대비 차별점" rows={2} className="mt-3 w-full px-4 py-2.5 bg-rose-50/50 border-2 border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent resize-none placeholder-rose-400/60" />
                  </div>
                </div>
              )}
            </div>

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
                    onClick={handleCopyTitle}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] ${
                      copiedTitle
                        ? 'bg-emerald-500 text-white border-emerald-300'
                        : 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedTitle ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                    </svg>
                    {copiedTitle ? '복사됨!' : '제목 복사'}
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] ${
                      copied
                        ? 'bg-emerald-500 text-white border-emerald-300'
                        : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                    </svg>
                    {copied ? '복사됨!' : '본문 복사'}
                  </button>
                  <button
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 border-violet-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03]"
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

            {/* 수정 입력창 (콘텐츠 위에 배치) */}
            {showEditInput && (
              <div className="bg-violet-50 rounded-2xl shadow-sm border-2 border-violet-300 p-5">
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
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-violet-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent placeholder-gray-400 resize-none bg-white"
                />
                <button
                  onClick={handleRegenerate}
                  disabled={isRegenerating || !editNotes.trim()}
                  className="mt-3 w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-medium rounded-xl hover:from-violet-700 hover:to-purple-700 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed border-2 border-violet-300 flex items-center justify-center gap-2"
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border-2 hover:shadow-md hover:scale-105 ${
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
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border-2 hover:shadow-md hover:scale-105 ${
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

              {/* 해시태그 */}
              {result.hashtags && result.hashtags.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                  {result.hashtags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:scale-105 transition-all duration-200 cursor-default">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
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
