'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiKeyPanel from '@/components/ApiKeyPanel';
import type { ContentCategory } from '@/lib/types';
import { saveHistoryItem, generateId } from '@/lib/history';
import { getProfiles, saveProfile, deleteProfile as deleteProfileSupabase, type Profile, type ProfileData } from '@/lib/supabase-storage';
import { canUseFeature, incrementUsage } from '@/lib/usage';

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
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [topic, setTopic] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [tone, setTone] = useState('전문적이고 신뢰감 있는');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [referenceFiles, setReferenceFiles] = useState<{ name: string; content: string }[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abTestMode, setAbTestMode] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [showBusinessInfo, setShowBusinessInfo] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    companyName: '',
    brandName: '',
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
  const [showProfileList, setShowProfileList] = useState(false);
  const [savedProfiles, setSavedProfiles] = useState<Profile[]>([]);
  const [profileSaveMsg, setProfileSaveMsg] = useState('');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileListRef = useRef<HTMLDivElement>(null);

  // Supabase에서 프로필 목록 로드
  useEffect(() => {
    getProfiles().then(profiles => setSavedProfiles(profiles));
  }, []);

  // 프로필 목록 외부 클릭 시 닫기
  useEffect(() => {
    if (!showProfileList) return;
    const handler = (e: MouseEvent) => {
      if (profileListRef.current && !profileListRef.current.contains(e.target as Node)) {
        setShowProfileList(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showProfileList]);

  const saveAsProfile = async () => {
    const name = businessInfo.companyName.trim() || '이름 없음';
    const { newStrength, ...dataToSave } = businessInfo;
    await saveProfile(name, dataToSave as ProfileData);
    const updated = await getProfiles();
    setSavedProfiles(updated);
    setProfileSaveMsg(`"${name}" 저장 완료`);
    setTimeout(() => setProfileSaveMsg(''), 2000);
  };

  const loadProfile = (profile: Profile) => {
    setBusinessInfo({ ...profile.data, newStrength: '' });
    autoSave({ ...profile.data, newStrength: '' });
    setShowProfileList(false);
  };

  const handleDeleteProfile = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteProfileSupabase(id);
    const updated = await getProfiles();
    setSavedProfiles(updated);
  };

  // 변경 시 자동 저장 표시 (디바운스)
  const autoSave = useCallback((_info: typeof businessInfo) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setBizSaved(true);
      setTimeout(() => setBizSaved(false), 2000);
    }, 1000);
  }, []);

  const saveBusinessInfo = () => {
    // Supabase 프로필로 저장은 saveAsProfile에서 처리
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
    { value: '음식/요식업', label: '🍽️ 음식/요식업' },
    { value: '소매/유통', label: '🏪 소매/유통' },
    { value: '뷰티/미용', label: '💅 뷰티/미용' },
    { value: '헬스/피트니스', label: '🏋️ 헬스/피트니스' },
    { value: '교육/학원', label: '🎓 교육/학원' },
    { value: 'IT/테크', label: '💻 IT/테크' },
    { value: '의료/건강', label: '🏥 의료/건강' },
    { value: '금융/보험', label: '💰 금융/보험' },
    { value: '부동산', label: '🏠 부동산' },
    { value: '여행/관광/숙박', label: '✈️ 여행/관광/숙박' },
    { value: '법률/컨설팅', label: '⚖️ 법률/컨설팅' },
    { value: '기타', label: '📦 기타' },
  ];

  const [fileUploading, setFileUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [fileErrors, setFileErrors] = useState<string[]>([]);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  const MAX_FILE_COUNT = 5;

  const processFiles = async (files: File[]) => {
    setFileUploading(true);
    setFileErrors([]);
    const newFiles: { name: string; content: string }[] = [];
    const errors: string[] = [];
    const remainingSlots = MAX_FILE_COUNT - referenceFiles.length;
    if (remainingSlots <= 0) {
      setFileErrors([`최대 ${MAX_FILE_COUNT}개까지만 업로드할 수 있습니다.`]);
      setFileUploading(false);
      return;
    }
    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      errors.push(`${files.length - remainingSlots}개 파일 건너뜀 (최대 ${MAX_FILE_COUNT}개 제한)`);
    }
    for (const file of filesToProcess) {
      try {
        const ext = file.name.split('.').pop()?.toLowerCase() || '';
        const supportedExts = ['txt', 'md', 'csv', 'json', 'html', 'xml', 'log', 'pdf', 'docx', 'pptx', 'jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
        if (!supportedExts.includes(ext)) {
          errors.push(`${file.name}: 지원하지 않는 파일 형식 (.${ext})`);
          continue;
        }
        if (file.size > MAX_FILE_SIZE) {
          errors.push(`${file.name}: 파일 크기 초과 (${(file.size / 1024 / 1024).toFixed(1)}MB, 최대 20MB)`);
          continue;
        }
        const textExts = ['txt', 'md', 'csv', 'json', 'html', 'xml', 'log'];
        if (textExts.includes(ext)) {
          const text = await file.text();
          newFiles.push({ name: file.name, content: text.substring(0, 15000) });
        } else {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/parse-file', { method: 'POST', body: formData });
          if (res.ok) {
            const data = await res.json();
            if (data.text) {
              newFiles.push({ name: data.fileName || file.name, content: data.text });
            } else {
              errors.push(`${file.name}: 텍스트를 추출할 수 없습니다`);
            }
          } else {
            const errData = await res.json().catch(() => ({}));
            errors.push(`${file.name}: ${errData.error || '파일 처리 실패'}`);
          }
        }
      } catch {
        errors.push(`${file.name}: 파일 처리 중 오류 발생`);
      }
    }
    setReferenceFiles(prev => [...prev, ...newFiles]);
    if (errors.length > 0) setFileErrors(errors);
    setFileUploading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    await processFiles(Array.from(files));
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const removeFile = (index: number) => {
    setReferenceFiles(prev => prev.filter((_, i) => i !== index));
  };

  const buildAdditionalNotes = () => {
    const parts: string[] = [];
    if (additionalNotes.trim()) parts.push(`[사용자 요구사항]\n${additionalNotes.trim()}`);
    // 업로드된 참조 파일을 RAG 컨텍스트로 포함
    if (referenceFiles.length > 0) {
      const refParts = referenceFiles.map(f =>
        `--- 참조자료: ${f.name} ---\n${f.content}\n--- 끝 ---`
      ).join('\n\n');
      parts.push(`[참조 자료 - 아래 자료의 정보, 수치, 사실, 표현을 적극 활용하여 콘텐츠를 작성하세요]\n${refParts}`);
    }
    const biz = businessInfo;
    const bizParts: string[] = [];
    if (biz.companyName) bizParts.push(`회사명: ${biz.companyName}`);
    if (biz.brandName) bizParts.push(`브랜드명: ${biz.brandName}`);
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

  const handleGenerate = async () => {
    if (!selectedCategory || !topic.trim()) return;
    setIsGenerating(true);
    setError(null);

    try {
      // 사용량 체크
      const usage = await canUseFeature('generate');
      if (!usage.allowed) {
        setError(`이번 달 콘텐츠 생성 사용 횟수(${usage.limit}회)를 모두 소진했습니다. 요금제를 업그레이드하세요.`);
        setIsGenerating(false);
        return;
      }

      saveBusinessInfo();
      const notes = buildAdditionalNotes();

      if (abTestMode) {
        // A/B 버전: 3가지 톤으로 동시 생성
        const tones = [
          { value: '전문적이고 신뢰감 있는', label: '전문적' },
          { value: '친근하고 대화체의', label: '친근한' },
          { value: '설득력 있고 강렬한', label: '설득적' },
        ];
        const results = await Promise.all(
          tones.map(async (t) => {
            const res = await fetch('/api/generate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                category: selectedCategory,
                topic: topic.trim(),
                targetKeyword: targetKeyword.trim() || undefined,
                tone: t.value,
                additionalNotes: notes,
              }),
            });
            if (!res.ok) throw new Error('생성 실패');
            const data = await res.json();
            return { ...data, toneName: t.label };
          })
        );
        // A/B 결과를 localStorage에 저장하고 결과 페이지로
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        // 각 버전을 이력에 저장
        for (const r of results) {
          const hid = generateId();
          await saveHistoryItem({
            id: hid, type: 'generation',
            title: `[${r.toneName}] ${r.title || topic.trim()}`,
            summary: `A/B 테스트 | ${r.toneName} 버전`,
            date: dateStr, category: selectedCategory || undefined,
            targetKeyword: targetKeyword.trim() || undefined,
            generateResult: r, topic: topic.trim(), tone: r.toneName, revisions: [],
          });
        }
        await incrementUsage('generate');
        // 첫 번째 결과를 메인으로 저장
        const { saveGenerateResult } = await import('@/lib/supabase-storage');
        const mainResult = { ...results[0], abVersions: results };
        const resultId = await saveGenerateResult({
          result: mainResult, category: selectedCategory,
          topic: topic.trim(), targetKeyword: targetKeyword.trim(),
          tone: 'A/B 테스트', historyId: generateId(),
        });
        router.push(`/generate/result?id=${resultId}`);
      } else {
        // 일반 단일 생성
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            category: selectedCategory,
            topic: topic.trim(),
            targetKeyword: targetKeyword.trim() || undefined,
            tone,
            additionalNotes: notes,
          }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || '콘텐츠 생성에 실패했습니다.');
        }

        const data = await response.json();
        await incrementUsage('generate');
        const now = new Date();
        const historyId = generateId();
        await saveHistoryItem({
          id: historyId, type: 'generation',
          title: data.title || topic.trim(),
          summary: `${categories.find(c => c.id === selectedCategory)?.label || ''} | ${topic.trim()}`,
          date: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
          category: selectedCategory || undefined,
          targetKeyword: targetKeyword.trim() || undefined,
          generateResult: data, topic: topic.trim(), tone, revisions: [],
        });
        const { saveGenerateResult } = await import('@/lib/supabase-storage');
        const resultId = await saveGenerateResult({
          result: data, category: selectedCategory,
          topic: topic.trim(), targetKeyword: targetKeyword.trim(),
          tone, historyId,
        });
        router.push(`/generate/result?id=${resultId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-4">
        {/* 카테고리 선택 + 입력 폼 */}
        {(
          <>
            {/* 히어로 스텝 가이드 */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-100 p-4 overflow-hidden relative">
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
                <div className="px-4 pb-4 space-y-4 border-t border-teal-100 bg-gradient-to-b from-teal-50/30 to-white">
                  {/* 프로필 저장/불러오기 */}
                  <div className="pt-4 flex items-center justify-center gap-3 relative">
                    {/* 저장 정보 가져오기 */}
                    <div className="relative" ref={profileListRef}>
                      <button
                        type="button"
                        onClick={() => setShowProfileList(!showProfileList)}
                        className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border-2 hover:shadow-lg hover:scale-105 ${
                          showProfileList
                            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white border-indigo-300 shadow-md'
                            : 'bg-white text-indigo-700 border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        저장 정보 가져오기
                        {savedProfiles.length > 0 && (
                          <span className={`ml-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${showProfileList ? 'bg-white/30 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                            {savedProfiles.length}
                          </span>
                        )}
                      </button>

                      {/* 프로필 모달 */}
                      {showProfileList && (
                        <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center p-4" onClick={() => setShowProfileList(false)}>
                          <div ref={profileListRef} onClick={e => e.stopPropagation()} className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 overflow-hidden">
                            {/* 헤더 */}
                            <div className="px-6 py-4 bg-gradient-to-r from-indigo-50 to-violet-50 border-b border-indigo-100 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-indigo-800">저장된 비즈니스 프로필</p>
                                  <p className="text-[10px] text-indigo-500">{savedProfiles.length}개 프로필 저장됨</p>
                                </div>
                              </div>
                              <button type="button" onClick={() => setShowProfileList(false)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                              </button>
                            </div>

                            {/* 본문 */}
                            {savedProfiles.length === 0 ? (
                              <div className="px-6 py-12 text-center">
                                <svg className="w-12 h-12 text-gray-200 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p className="text-sm font-medium text-gray-400">저장된 프로필이 없습니다</p>
                                <p className="text-xs text-gray-300 mt-1">&quot;현재 정보 저장&quot; 버튼으로 비즈니스 정보를 저장하세요</p>
                              </div>
                            ) : (
                              <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-100">
                                {savedProfiles.map((profile) => (
                                  <div
                                    key={profile.id}
                                    className="px-6 py-4 hover:bg-indigo-50/50 transition-all duration-150 cursor-pointer group"
                                    onClick={() => loadProfile(profile)}
                                  >
                                    <div className="flex items-start justify-between gap-4">
                                      {/* 왼쪽: 프로필 정보 */}
                                      <div className="flex items-start gap-4 min-w-0 flex-1">
                                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                                          <span className="text-white text-lg font-bold">{profile.name.charAt(0)}</span>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                          <div className="flex items-center gap-2 mb-1.5">
                                            <p className="text-sm font-bold text-gray-900">{profile.name}</p>
                                            {profile.data.brandName && (
                                              <span className="text-[10px] font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-200">{profile.data.brandName}</span>
                                            )}
                                            <span className="text-[10px] text-gray-400">{profile.savedAt}</span>
                                          </div>
                                          {/* 상세 정보 그리드 */}
                                          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
                                            {profile.data.industry && (
                                              <p className="text-xs text-gray-500"><span className="font-medium text-gray-600">산업:</span> {profile.data.industry === '기타' ? profile.data.customIndustry : profile.data.industry}</p>
                                            )}
                                            {profile.data.mainProduct && (
                                              <p className="text-xs text-gray-500"><span className="font-medium text-gray-600">제품:</span> {profile.data.mainProduct}</p>
                                            )}
                                            {profile.data.targetAudience && (
                                              <p className="text-xs text-gray-500"><span className="font-medium text-gray-600">타겟:</span> {profile.data.targetAudience}</p>
                                            )}
                                            {profile.data.location && (
                                              <p className="text-xs text-gray-500"><span className="font-medium text-gray-600">위치:</span> {profile.data.location}</p>
                                            )}
                                          </div>
                                          {profile.data.strengths && profile.data.strengths.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1.5">
                                              {profile.data.strengths.map((s: string, si: number) => (
                                                <span key={si} className="text-[10px] font-medium text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full border border-violet-200">{s}</span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* 오른쪽: 액션 */}
                                      <div className="flex items-center gap-2 shrink-0 pt-1">
                                        <span className="text-xs text-indigo-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-200">선택</span>
                                        <button
                                          type="button"
                                          onClick={(e) => handleDeleteProfile(profile.id, e)}
                                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 현재 정보 저장 */}
                    <button
                      type="button"
                      onClick={saveAsProfile}
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border-2 bg-white text-teal-700 border-teal-300 hover:bg-teal-50 hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      현재 정보 저장
                    </button>

                    {/* 저장 완료 메시지 */}
                    {profileSaveMsg && (
                      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[11px] font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 whitespace-nowrap animate-pulse">
                        {profileSaveMsg}
                      </span>
                    )}
                  </div>

                  {/* 회사 정보 */}
                  <div className="pt-5 bg-white/80 rounded-xl p-4 border border-teal-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-teal-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">1</span>
                      회사 정보
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input type="text" value={businessInfo.companyName} onChange={e => updateBiz('companyName', e.target.value)} placeholder="회사명 (예: ○○주식회사)" className="px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                      <input type="text" value={businessInfo.location} onChange={e => updateBiz('location', e.target.value)} placeholder="지역/위치 (예: 서울 강남구)" className="px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                    </div>
                    <input type="text" value={businessInfo.website} onChange={e => updateBiz('website', e.target.value)} placeholder="웹사이트/SNS (예: www.example.com)" className="mt-3 w-full px-4 py-2.5 bg-teal-50/50 border-2 border-teal-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent placeholder-teal-400/60" />
                  </div>

                  {/* 브랜드 정보 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-cyan-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-cyan-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">✦</span>
                      브랜드 정보
                    </h3>
                    <input type="text" value={businessInfo.brandName} onChange={e => updateBiz('brandName', e.target.value)} placeholder="브랜드명 (예: 브랜드 이름, 서비스명)" className="w-full px-4 py-2.5 bg-cyan-50/50 border-2 border-cyan-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent placeholder-cyan-400/60" />
                  </div>

                  {/* 산업 분야 */}
                  <div className="bg-white/80 rounded-xl p-4 border border-amber-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-amber-800 mb-3 flex items-center gap-2">
                      <span className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg text-center text-xs leading-6 font-bold text-white shadow-sm">2</span>
                      🏭 산업 분야 선택
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {industries.map(ind => {
                        const emoji = ind.label.split(' ')[0];
                        const text = ind.label.split(' ').slice(1).join(' ');
                        return (
                          <button
                            key={ind.value}
                            type="button"
                            onClick={() => updateBiz('industry', ind.value)}
                            className={`flex flex-col items-center justify-center gap-1 px-2 py-3 rounded-xl border-2 transition-all duration-200 hover:shadow-md hover:scale-105 ${
                              businessInfo.industry === ind.value
                                ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white border-amber-300 shadow-md'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-amber-400 hover:bg-amber-50/50'
                            }`}
                          >
                            <span className="text-2xl">{emoji}</span>
                            <span className="text-[11px] font-semibold leading-tight text-center">{text}</span>
                          </button>
                        );
                      })}
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

                  {/* 하단 현재 정보 저장 버튼 */}
                  <div className="flex justify-center relative">
                    <button
                      type="button"
                      onClick={saveAsProfile}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 border-2 bg-white text-teal-700 border-teal-300 hover:bg-teal-50 hover:shadow-lg hover:scale-105"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      현재 정보 저장
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 카테고리 선택 */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">콘텐츠 유형 선택</h2>
              <p className="text-sm text-gray-500 mb-3">생성할 콘텐츠의 유형을 선택하세요</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`relative p-3 rounded-xl text-left transition-all duration-200 border-2 ${
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
              <div className="bg-white rounded-xl shadow-sm border-2 border-sky-200 p-5">
                <h2 className="text-lg font-semibold text-gray-900 mb-1">콘텐츠 정보 입력</h2>
                <p className="text-sm text-gray-500 mb-3">
                  {categories.find(c => c.id === selectedCategory)?.label} 생성을 위한 정보를 입력하세요
                </p>

                <div className="space-y-3">
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

                  {/* 추가 요구사항 + 참조 파일 업로드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">참조 자료 & 추가 요구사항 (선택)</label>
                    <p className="text-xs text-gray-400 mb-2">입력된 텍스트와 업로드된 파일의 정보를 기반으로 콘텐츠를 생성합니다 (RAG 방식)</p>
                    <textarea
                      value={additionalNotes}
                      onChange={(e) => setAdditionalNotes(e.target.value)}
                      placeholder="콘텐츠에 반영할 정보를 입력하세요...&#10;예: 제품 스펙, 통계 데이터, 전문 용어, 인용할 내용, 특별 요구사항 등"
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent placeholder-gray-400 resize-none"
                    />
                    {/* 파일 업로드 (클릭 + 드래그 앤 드롭) */}
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`mt-3 relative rounded-xl border-2 border-dashed transition-all duration-200 ${
                        dragOver
                          ? 'border-indigo-500 bg-indigo-100 scale-[1.01] shadow-lg'
                          : 'border-indigo-300 bg-indigo-50 hover:border-indigo-400 hover:bg-indigo-100'
                      }`}
                    >
                      <label className="flex flex-col items-center gap-2 px-4 py-5 cursor-pointer">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          dragOver ? 'bg-indigo-500 text-white scale-110' : 'bg-indigo-200 text-indigo-600'
                        }`}>
                          {fileUploading ? (
                            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          )}
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-indigo-700">
                            {fileUploading ? '파일 처리 중...' : dragOver ? '여기에 놓으세요!' : '클릭하여 파일 선택 또는 드래그 앤 드롭'}
                          </p>
                          <p className="text-xs text-indigo-400 mt-1">PDF, DOCX, PPTX, 이미지(JPG/PNG), TXT, CSV 등 | 최대 20MB/파일, {referenceFiles.length}/{MAX_FILE_COUNT}개</p>
                        </div>
                        <input
                          type="file"
                          multiple
                          accept=".txt,.md,.csv,.json,.html,.xml,.log,.pdf,.docx,.pptx,.jpg,.jpeg,.png,.gif,.webp,.bmp"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    {/* 업로드된 파일 목록 */}
                    {referenceFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {referenceFiles.map((file, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                            <svg className="w-4 h-4 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-xs font-medium text-indigo-700 flex-1 truncate">{file.name}</span>
                            <span className="text-[10px] text-indigo-400">{(file.content.length / 1000).toFixed(1)}K자</span>
                            <button
                              onClick={() => removeFile(i)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-0.5"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* 파일 업로드 에러 메시지 */}
                    {fileErrors.length > 0 && (
                      <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-1.5 mb-1">
                          <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <span className="text-xs font-semibold text-red-700">업로드 실패한 파일</span>
                          <button onClick={() => setFileErrors([])} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        {fileErrors.map((err, i) => (
                          <p key={i} className="text-xs text-red-600 ml-5.5">{err}</p>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* A/B 테스트 모드 */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-2 border-amber-200">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={abTestMode}
                        onChange={(e) => setAbTestMode(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                    <div>
                      <p className="text-sm font-semibold text-amber-800">A/B 버전 생성</p>
                      <p className="text-[10px] text-amber-600">전문적 / 친근한 / 설득적 3가지 톤으로 동시 생성하여 비교</p>
                    </div>
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
                <div>
                  <p className="text-sm text-red-700">{error}</p>
                  {error.includes('소진했습니다') && (
                    <Link href="/pricing" className="inline-block mt-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 underline">
                      요금제 확인하기 &rarr;
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* 로딩 애니메이션 */}
            {isGenerating && (
              <div className="bg-white rounded-xl shadow-sm border-2 border-blue-200 p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-3 relative">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI가 콘텐츠를 생성하고 있습니다</h3>
                <p className="text-sm text-gray-500">AIO/GEO에 최적화된 고품질 콘텐츠를 작성 중입니다...</p>
              </div>
            )}

            {/* 초기 안내 (카테고리 미선택 시) */}
            {!selectedCategory && !isGenerating && (
              <div className="bg-white rounded-xl shadow-sm border-2 border-violet-200 p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-violet-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">콘텐츠 유형을 선택하세요</h3>
                <p className="text-sm text-gray-500 max-w-md mx-auto">
                  위에서 원하는 콘텐츠 유형을 선택하면 AIO/GEO에 최적화된
                  고품질 콘텐츠를 AI가 자동으로 생성합니다.
                </p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2 max-w-lg mx-auto">
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

      </main>

      <Footer />

    </div>
  );
}
