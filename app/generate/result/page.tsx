'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ApiKeyPanel from '@/components/ApiKeyPanel';
import type { ContentCategory, GenerateResponse } from '@/lib/types';
import { addRevision, generateId } from '@/lib/history';
import { uploadImage, getGenerateResult, saveGenerateResult, type GenerateResultData } from '@/lib/supabase-storage';

const categories: { id: ContentCategory; label: string }[] = [
  { id: 'blog', label: '블로그 포스트' },
  { id: 'product', label: '제품 설명' },
  { id: 'faq', label: 'FAQ 페이지' },
  { id: 'howto', label: 'How-to 가이드' },
  { id: 'landing', label: '랜딩 페이지' },
  { id: 'technical', label: '기술 문서' },
  { id: 'social', label: '소셜 미디어' },
  { id: 'email', label: '이메일 마케팅' },
];

interface StoredResult {
  result: GenerateResponse;
  category: ContentCategory;
  topic: string;
  targetKeyword: string;
  tone: string;
  historyId: string;
}

export default function GenerateResultPage() {
  const router = useRouter();
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [topic, setTopic] = useState('');
  const [targetKeyword, setTargetKeyword] = useState('');
  const [tone, setTone] = useState('');
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  const [copied, setCopied] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editNotes, setEditNotes] = useState('');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const [showFinalContent, setShowFinalContent] = useState(false);
  const [finalContentHtml, setFinalContentHtml] = useState('');
  const [copiedFinal, setCopiedFinal] = useState(false);
  const finalContentRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Supabase 또는 localStorage에서 결과 데이터 로드
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) {
      router.push('/generate');
      return;
    }
    getGenerateResult(id).then(data => {
      if (!data) {
        router.push('/generate');
        return;
      }
      setResult(data.result);
      setSelectedCategory(data.category);
      setTopic(data.topic);
      setTargetKeyword(data.targetKeyword);
      setTone(data.tone);
      setCurrentHistoryId(data.historyId);
    });
  }, [router]);

  const handleCopyTitle = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopy = async () => {
    if (!contentRef.current) return;
    try {
      const htmlBlob = new Blob([contentRef.current.innerHTML], { type: 'text/html' });
      const textBlob = new Blob([contentRef.current.innerText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      if (contentRef.current) {
        await navigator.clipboard.writeText(contentRef.current.innerText);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyAsImage = async () => {
    if (!contentRef.current) return;
    setIsCapturing(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob }),
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        } catch {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'content.png';
          a.click();
          URL.revokeObjectURL(url);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2000);
        }
        setIsCapturing(false);
      }, 'image/png');
    } catch {
      setIsCapturing(false);
    }
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
      // Supabase에 업데이트
      const params = new URLSearchParams(window.location.search);
      const resultId = params.get('id');
      if (resultId) {
        await saveGenerateResult({
          result: data,
          category: selectedCategory!,
          topic,
          targetKeyword,
          tone,
          historyId: currentHistoryId || '',
        });
      }
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

  const handleGenerateImages = async () => {
    if (!result) return;
    setIsGeneratingImages(true);
    setImageError(null);
    try {
      const geminiKey = localStorage.getItem('gemini-api-key') || (await (await import('@/lib/supabase-storage')).getApiKey('gemini')) || '';
      const response = await fetch('/api/generate-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: result.content, title: result.title, geminiApiKey: geminiKey }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || '이미지 생성에 실패했습니다.');
      }
      const data = await response.json();
      if (currentHistoryId && data.images) {
        const uploadedUrls = await Promise.all(
          data.images.map((img: string) => uploadImage(currentHistoryId, img, result.title))
        );
        setGeneratedImages(uploadedUrls);
      } else {
        setGeneratedImages(data.images);
      }
    } catch (err) {
      setImageError(err instanceof Error ? err.message : '이미지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const parseTable = (block: string): string => {
    const lines = block.trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 2) return '';
    const parseCells = (line: string) =>
      line.split('|').slice(1, -1).map(c => c.trim());
    const headers = parseCells(lines[0]);
    const startIdx = /^[\s|:-]+$/.test(lines[1]) ? 2 : 1;
    const rows = lines.slice(startIdx).map(parseCells);
    const thStyle = 'padding:10px 16px;text-align:left;font-weight:600;font-size:0.85em;color:#ffffff;background:linear-gradient(135deg,#6366f1,#8b5cf6);border:1px solid #818cf8;white-space:nowrap';
    const tdBaseStyle = 'padding:10px 16px;font-size:0.85em;border:1px solid #e5e7eb;color:#374151';
    let html = '<table style="width:100%;border-collapse:collapse;margin:20px 0;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08)">';
    html += '<thead><tr>' + headers.map(h => `<th style="${thStyle}">${h.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';
    rows.forEach((row, i) => {
      const bg = i % 2 === 0 ? '#ffffff' : '#f8fafc';
      html += '<tr>' + row.map(cell => `<td style="${tdBaseStyle};background:${bg}">${cell.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</td>`).join('') + '</tr>';
    });
    html += '</tbody></table>';
    return html;
  };

  const markdownToHtml = (text: string) => {
    const paragraphs = text.split(/\n\n+/);
    return paragraphs.map(para => {
      const lines = para.trim().split('\n');
      if (lines.length >= 2 && lines[0].trim().startsWith('|') && lines[1].trim().startsWith('|')) {
        return parseTable(para);
      }
      let html = para
        .replace(/^### (.*$)/gm, '<h3 style="font-size:1.1em;font-weight:bold;color:#1a1a1a;margin:24px 0 8px">$1</h3>')
        .replace(/^## (.*$)/gm, '<h2 style="font-size:1.25em;font-weight:bold;color:#1a1a1a;margin:32px 0 12px;padding-bottom:8px;border-bottom:1px solid #e5e7eb">$1</h2>')
        .replace(/^# (.*$)/gm, '<h1 style="font-size:1.5em;font-weight:bold;color:#1a1a1a;margin:32px 0 16px">$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^\- (.*$)/gm, '<li style="margin-left:20px;list-style:disc;margin-bottom:4px">$1</li>')
        .replace(/^\d+\. (.*$)/gm, '<li style="margin-left:20px;list-style:decimal;margin-bottom:4px">$1</li>')
        .replace(/^> (.*$)/gm, '<blockquote style="border-left:4px solid #818cf8;padding:4px 16px;margin:12px 0;background:#eef2ff;border-radius:0 8px 8px 0;color:#374151">$1</blockquote>');
      const trimmed = html.trim();
      const isBlock = /^<(h[1-6]|li|blockquote|ul|ol|figure|div|table)/.test(trimmed);
      if (isBlock) return html;
      html = html.replace(/\n/g, '<br>');
      return `<p style="margin-bottom:1em;line-height:1.8">${html}</p>`;
    }).join('');
  };

  const handleApplyImages = () => {
    if (!result || generatedImages.length === 0) return;

    const lines = result.content.split('\n');
    const headingIndices: number[] = [];
    lines.forEach((line, i) => {
      if (/^#{1,3}\s/.test(line)) headingIndices.push(i);
    });

    let insertPositions: number[];
    if (headingIndices.length >= 4) {
      const mid = Math.floor(headingIndices.length / 2);
      insertPositions = [
        headingIndices[1],
        headingIndices[mid],
        headingIndices[headingIndices.length - 1],
      ];
    } else {
      const step = Math.floor(lines.length / (generatedImages.length + 1));
      insertPositions = generatedImages.map((_, i) => step * (i + 1));
    }

    insertPositions = [...new Set(insertPositions)].sort((a, b) => a - b);

    const imageLabels = ['핵심 요약 인포그래픽', '프로세스 인포그래픽', '데이터 인포그래픽'];
    const imageTags = generatedImages.map((img, i) =>
      `\n<figure style="text-align:center;margin:32px 0"><img src="${img}" alt="${imageLabels[i] || `인포그래픽 ${i+1}`}" style="width:100%;max-width:720px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,0.1)" /><figcaption style="font-size:0.85em;color:#6b7280;margin-top:8px">${imageLabels[i] || `인포그래픽 ${i+1}`}</figcaption></figure>\n`
    );

    const resultLines: string[] = [];
    let imgIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (imgIdx < insertPositions.length && i === insertPositions[imgIdx]) {
        resultLines.push(imageTags[imgIdx] || '');
        imgIdx++;
      }
      resultLines.push(lines[i]);
    }
    while (imgIdx < imageTags.length) {
      resultLines.push(imageTags[imgIdx]);
      imgIdx++;
    }

    const mergedContent = resultLines.join('\n');
    const html = markdownToHtml(mergedContent);

    let fullHtml = `<h1 style="font-size:1.8em;font-weight:bold;color:#1a1a1a;margin-bottom:16px">${result.title}</h1>\n${html}`;
    if (result.hashtags && result.hashtags.length > 0) {
      const tags = result.hashtags.map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
      fullHtml += `\n<p style="margin-top:24px;color:#6366f1;font-size:0.9em">${tags}</p>`;
    }

    setFinalContentHtml(fullHtml);
    setShowFinalContent(true);
  };

  const handleCopyFinalContent = async () => {
    if (!finalContentRef.current) return;
    try {
      const htmlBlob = new Blob([finalContentRef.current.innerHTML], { type: 'text/html' });
      const textBlob = new Blob([finalContentRef.current.innerText], { type: 'text/plain' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      setCopiedFinal(true);
      setTimeout(() => setCopiedFinal(false), 2000);
    } catch {
      await navigator.clipboard.writeText(finalContentRef.current.innerText);
      setCopiedFinal(true);
      setTimeout(() => setCopiedFinal(false), 2000);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('aio-generate-result');
    router.push('/generate');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        showApiKeyButton
        onToggleApiKey={() => setShowApiKeyInput(!showApiKeyInput)}
        apiKeyOpen={showApiKeyInput}
      />
      <ApiKeyPanel visible={showApiKeyInput} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 에러 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

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
                onClick={handleCopyAsImage}
                disabled={isCapturing}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] disabled:opacity-50 ${
                  copiedImage
                    ? 'bg-emerald-500 text-white border-emerald-300'
                    : 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                }`}
              >
                {isCapturing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedImage ? 'M5 13l4 4L19 7' : 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'} />
                  </svg>
                )}
                {copiedImage ? '복사됨!' : isCapturing ? '캡처 중...' : '이미지로 복사'}
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

        {/* 수정 입력창 */}
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
                const html = contentRef.current.innerHTML;
                const text = contentRef.current.innerText;
                const blob = new Blob([html], { type: 'text/html' });
                const textBlob = new Blob([text], { type: 'text/plain' });
                navigator.clipboard.write([
                  new ClipboardItem({
                    'text/html': blob,
                    'text/plain': textBlob,
                  }),
                ]).then(() => {
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
              className="text-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: markdownToHtml(result.content)
              }}
            />
            {/* 해시태그 - 본문 안에 포함하여 복사 시 함께 복사됨 */}
            {result.hashtags && result.hashtags.length > 0 && (
              <div className="mt-8 pt-4 flex flex-wrap gap-2">
                {result.hashtags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-100 hover:scale-105 transition-all duration-200 cursor-default">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* AI 이미지 생성 */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            {generatedImages.length === 0 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-semibold text-gray-700">AI 이미지 생성</span>
                  <span className="text-xs text-gray-400">Gemini로 콘텐츠 관련 이미지 3장을 생성합니다</span>
                </div>
                <button
                  onClick={handleGenerateImages}
                  disabled={isGeneratingImages}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-300 hover:from-emerald-600 hover:to-teal-600 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                >
                  {isGeneratingImages ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      생성 중...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      이미지 3장 생성
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    AI 생성 이미지 ({generatedImages.length}장)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleApplyImages}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 border-2 border-indigo-300 text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 hover:shadow-lg hover:scale-105 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      본문에 삽입
                    </button>
                    <button
                      onClick={handleGenerateImages}
                      disabled={isGeneratingImages}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 border-2 border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md hover:scale-105 disabled:opacity-50"
                    >
                      {isGeneratingImages ? (
                        <>
                          <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          재생성 중...
                        </>
                      ) : '다시 생성'}
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {generatedImages.map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200">
                      <img src={img} alt={`AI 생성 이미지 ${i + 1}`} className="w-full aspect-video object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                        <a
                          href={img}
                          download={`ai-image-${i + 1}.png`}
                          className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 text-gray-800 text-xs font-medium rounded-lg shadow-md hover:bg-white transition-all"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          다운로드
                        </a>
                      </div>
                      <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {i + 1}/{generatedImages.length}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {imageError && (
              <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-red-700">{imageError}</p>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />

      {/* 최종 콘텐츠 모달 (이미지 + 글) */}
      {showFinalContent && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto p-4 sm:p-8">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4">
            <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900">최종 콘텐츠</h3>
                <span className="text-xs text-gray-400">글 + 인포그래픽 이미지</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFinalContent}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-105 ${
                    copiedFinal
                      ? 'bg-emerald-500 text-white border-emerald-300'
                      : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300 hover:from-indigo-600 hover:to-purple-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedFinal ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                  </svg>
                  {copiedFinal ? '복사됨!' : '블로그에 붙여넣기용 복사'}
                </button>
                <button
                  onClick={() => setShowFinalContent(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  닫기
                </button>
              </div>
            </div>
            <div className="px-6 py-8" ref={finalContentRef}>
              <div
                className="prose prose-sm max-w-none text-gray-800 leading-relaxed"
                style={{ lineHeight: '1.8' }}
                dangerouslySetInnerHTML={{ __html: finalContentHtml }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
