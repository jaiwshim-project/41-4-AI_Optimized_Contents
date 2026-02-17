'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { HistoryItem } from '@/lib/types';
import { getHistoryAsync } from '@/lib/history';

export default function DashboardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem] = useState<HistoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [revisionId, setRevisionId] = useState<string | null>(null);
  const [copiedBlog, setCopiedBlog] = useState(false);
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

  const renderContent = (content: string) => {
    return content
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-bold text-gray-900 mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold text-gray-900 mt-8 mb-3 pb-2 border-b border-gray-200">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
      .replace(/^\- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4 list-decimal">$1</li>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-300 pl-4 py-1 my-3 bg-indigo-50 rounded-r-lg text-gray-700">$1</blockquote>');
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
          <div ref={contentRef}>
            <div
              className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-800 leading-relaxed"
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
