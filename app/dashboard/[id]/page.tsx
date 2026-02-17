'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { HistoryItem } from '@/lib/types';
import { getHistoryAsync, updateHistoryContent } from '@/lib/history';

export default function DashboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [revisionId, setRevisionId] = useState<string | null>(null);
  const [copiedBlog, setCopiedBlog] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // URL query에서 revision 파라미터 확인
    const searchParams = new URLSearchParams(window.location.search);
    const rev = searchParams.get('revision');
    if (rev) setRevisionId(rev);

    getHistoryAsync().then(history => {
      const found = history.find(h => h.id === id);
      if (!found) {
        router.push('/dashboard');
        return;
      }
      setItem(found);
      setLoading(false);
    });
  }, [id, router]);

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

  const renderContent = (content: string) => {
    const paragraphs = content.split(/\n\n+/);
    return paragraphs.map(para => {
      // 테이블 감지: 줄이 |로 시작하는 블록
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

  const handleCopyBlog = async () => {
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
      setCopiedBlog(true);
      setTimeout(() => setCopiedBlog(false), 2000);
    } catch {
      await navigator.clipboard.writeText(contentRef.current.innerText);
      setCopiedBlog(true);
      setTimeout(() => setCopiedBlog(false), 2000);
    }
  };

  const handleCopyTitle = async () => {
    if (!item) return;
    const isGen = item.type === 'generation';
    const title = isGen
      ? (revisionId
          ? item.revisions?.find(r => r.id === revisionId)?.result.title || item.title
          : item.generateResult?.title || item.title)
      : item.title;
    await navigator.clipboard.writeText(title);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2000);
  };

  const handleCopyContent = async () => {
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
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch {
      await navigator.clipboard.writeText(contentRef.current.innerText);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
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
        logging: false,
      });
      const dataUrl = canvas.toDataURL('image/png');
      const res = await fetch(dataUrl);
      const blob = await res.blob();

      try {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      } catch {
        // 클립보드 이미지 복사 미지원 시 다운로드
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `content-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2000);
      }
    } catch (err) {
      console.error('Image capture error:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleStartEdit = () => {
    const isGen = item?.type === 'generation';
    const currentContent = isGen
      ? (revisionId
          ? item?.revisions?.find(r => r.id === revisionId)?.result.content
          : item?.generateResult?.content)
      : item?.originalContent;
    setEditContent(currentContent || '');
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!item) return;
    // item의 content를 업데이트
    if (item.type === 'generation' && item.generateResult) {
      if (revisionId) {
        const rev = item.revisions?.find(r => r.id === revisionId);
        if (rev) rev.result.content = editContent;
      } else {
        item.generateResult.content = editContent;
      }
    } else {
      item.originalContent = editContent;
    }
    setItem({ ...item });
    await updateHistoryContent(item.id, editContent);
    setIsEditing(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  if (loading || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 relative">
          <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
          <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  const isGeneration = item.type === 'generation';
  const content = isGeneration
    ? (revisionId
        ? item.revisions?.find(r => r.id === revisionId)?.result.content
        : item.generateResult?.content)
    : item.originalContent;

  const hashtags = isGeneration
    ? (revisionId
        ? item.revisions?.find(r => r.id === revisionId)?.result.hashtags
        : item.generateResult?.hashtags)
    : undefined;

  const handleRevisionChange = (rev: string | null) => {
    setRevisionId(rev);
    const url = rev ? `/dashboard/${id}?revision=${rev}` : `/dashboard/${id}`;
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 뒤로가기 */}
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          목록으로 돌아가기
        </button>

        {/* 헤더 정보 */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{item.title}</h2>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-gray-500">{item.date}</span>
                {item.category && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {item.category}
                  </span>
                )}
                {revisionId && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                    수정본
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {/* 블로그 붙여넣기 복사 */}
              <button
                onClick={handleCopyBlog}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] ${
                  copiedBlog
                    ? 'bg-emerald-500 text-white border-emerald-300'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-300 hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedBlog ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                </svg>
                {copiedBlog ? '복사됨!' : '블로그 붙여넣기용 복사'}
              </button>
              {/* 제목 복사 */}
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
              {/* 본문 복사 */}
              <button
                onClick={handleCopyContent}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] ${
                  copiedContent
                    ? 'bg-emerald-500 text-white border-emerald-300'
                    : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copiedContent ? 'M5 13l4 4L19 7' : 'M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'} />
                </svg>
                {copiedContent ? '복사됨!' : '본문 복사'}
              </button>
              {/* 이미지로 복사 */}
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
              {/* 본문 수정 */}
              <button
                onClick={isEditing ? handleSaveEdit : handleStartEdit}
                className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 hover:shadow-md hover:scale-[1.03] ${
                  savedMessage
                    ? 'bg-emerald-500 text-white border-emerald-300'
                    : isEditing
                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border-emerald-300 hover:from-emerald-600 hover:to-green-700'
                    : 'border-violet-300 bg-violet-50 text-violet-700 hover:bg-violet-100'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={savedMessage ? 'M5 13l4 4L19 7' : 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'} />
                </svg>
                {savedMessage ? '저장됨!' : isEditing ? '저장하기' : '본문 수정'}
              </button>
              {isEditing && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 border-2 border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100 hover:shadow-md hover:scale-[1.03]"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  취소
                </button>
              )}
              {/* 수정 이력 선택 */}
              {isGeneration && item.revisions && item.revisions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRevisionChange(null)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all hover:shadow-md ${
                      !revisionId ? 'bg-indigo-600 text-white border-indigo-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    원본
                  </button>
                  {item.revisions.map((rev, i) => (
                    <button
                      key={rev.id}
                      onClick={() => handleRevisionChange(rev.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all hover:shadow-md ${
                        revisionId === rev.id ? 'bg-violet-600 text-white border-violet-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      수정 #{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 분석 결과 점수 (분석인 경우) */}
        {!isGeneration && item.analysisResult && (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-sky-200 p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">분석 점수</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-2xl font-bold text-blue-600">{item.analysisResult.overallScore}</p>
                <p className="text-xs text-gray-500 mt-1">종합 점수</p>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                <p className="text-2xl font-bold text-indigo-600">{item.analysisResult.aio.total}</p>
                <p className="text-xs text-gray-500 mt-1">AIO 점수</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-2xl font-bold text-purple-600">{item.analysisResult.geo.total}</p>
                <p className="text-xs text-gray-500 mt-1">GEO 점수</p>
              </div>
            </div>
          </div>
        )}

        {/* 콘텐츠 */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
          {isEditing ? (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-semibold text-violet-700">본문 수정 모드</span>
                <span className="text-xs text-gray-400">마크다운 형식으로 편집하세요</span>
              </div>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[500px] px-4 py-3 border-2 border-violet-200 rounded-xl text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-transparent resize-y bg-gray-50"
              />
            </div>
          ) : (
            <div ref={contentRef}>
              <div
                className="prose prose-sm max-w-none text-sm text-gray-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderContent(content || '') }}
              />
              {hashtags && hashtags.length > 0 && (
                <div className="mt-8 pt-4 flex flex-wrap gap-2">
                  {hashtags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                      {tag.startsWith('#') ? tag : `#${tag}`}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
