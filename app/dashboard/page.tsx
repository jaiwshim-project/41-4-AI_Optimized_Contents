'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import type { HistoryItem } from '@/lib/types';
import { getHistory, deleteHistoryItem } from '@/lib/history';

type TabType = 'analysis' | 'generation';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>('generation');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [viewItem, setViewItem] = useState<HistoryItem | null>(null);
  const [expandedRevisions, setExpandedRevisions] = useState<Set<string>>(new Set());
  const [viewRevisionId, setViewRevisionId] = useState<string | null>(null);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const filteredHistory = history.filter(h => h.type === activeTab);

  const handleDelete = (id: string) => {
    deleteHistoryItem(id);
    setHistory(getHistory());
    if (viewItem?.id === id) setViewItem(null);
  };

  const toggleRevisions = (id: string) => {
    setExpandedRevisions(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  // 상세 보기 모드
  if (viewItem) {
    const isGeneration = viewItem.type === 'generation';
    const content = isGeneration
      ? (viewRevisionId
          ? viewItem.revisions?.find(r => r.id === viewRevisionId)?.result.content
          : viewItem.generateResult?.content)
      : viewItem.originalContent;

    const hashtags = isGeneration
      ? (viewRevisionId
          ? viewItem.revisions?.find(r => r.id === viewRevisionId)?.result.hashtags
          : viewItem.generateResult?.hashtags)
      : undefined;

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* 뒤로가기 */}
          <button
            onClick={() => { setViewItem(null); setViewRevisionId(null); }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-indigo-300 hover:shadow-md transition-all"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            목록으로 돌아가기
          </button>

          {/* 헤더 정보 */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">{viewItem.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-gray-500">{viewItem.date}</span>
                  {viewItem.category && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 border border-indigo-200">
                      {viewItem.category}
                    </span>
                  )}
                  {viewRevisionId && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
                      수정본
                    </span>
                  )}
                </div>
              </div>
              {/* 수정 이력 선택 */}
              {isGeneration && viewItem.revisions && viewItem.revisions.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewRevisionId(null)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all hover:shadow-md ${
                      !viewRevisionId ? 'bg-indigo-600 text-white border-indigo-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    원본
                  </button>
                  {viewItem.revisions.map((rev, i) => (
                    <button
                      key={rev.id}
                      onClick={() => setViewRevisionId(rev.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-all hover:shadow-md ${
                        viewRevisionId === rev.id ? 'bg-violet-600 text-white border-violet-300' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-violet-300'
                      }`}
                    >
                      수정 #{i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 분석 결과 점수 (분석인 경우) */}
          {!isGeneration && viewItem.analysisResult && (
            <div className="bg-white rounded-2xl shadow-sm border-2 border-sky-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">분석 점수</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{viewItem.analysisResult.overallScore}</p>
                  <p className="text-xs text-gray-500 mt-1">종합 점수</p>
                </div>
                <div className="text-center p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                  <p className="text-2xl font-bold text-indigo-600">{viewItem.analysisResult.aio.total}</p>
                  <p className="text-xs text-gray-500 mt-1">AIO 점수</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <p className="text-2xl font-bold text-purple-600">{viewItem.analysisResult.geo.total}</p>
                  <p className="text-xs text-gray-500 mt-1">GEO 점수</p>
                </div>
              </div>
            </div>
          )}

          {/* 콘텐츠 */}
          <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
            <div
              className="prose prose-sm max-w-none whitespace-pre-wrap text-sm text-gray-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderContent(content || '') }}
            />
            {hashtags && hashtags.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-200">
                    {tag.startsWith('#') ? tag : `#${tag}`}
                  </span>
                ))}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // 목록 모드
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* 페이지 제목 */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">대시보드</h2>
          <p className="text-sm text-gray-500 mt-1">콘텐츠 분석 및 생성 작업 이력을 관리합니다</p>
        </div>

        {/* 탭 */}
        <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-1.5 flex gap-1">
          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 hover:shadow-md ${
              activeTab === 'analysis'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm border-sky-300'
                : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-indigo-200'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              콘텐츠 분석
              <span className="text-xs opacity-75">({history.filter(h => h.type === 'analysis').length})</span>
            </span>
          </button>
          <button
            onClick={() => setActiveTab('generation')}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border-2 hover:shadow-md ${
              activeTab === 'generation'
                ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-sm border-purple-300'
                : 'text-gray-600 hover:bg-gray-50 border-transparent hover:border-purple-200'
            }`}
          >
            <span className="inline-flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              콘텐츠 생성
              <span className="text-xs opacity-75">({history.filter(h => h.type === 'generation').length})</span>
            </span>
          </button>
        </div>

        {/* 이력 목록 */}
        {filteredHistory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">아직 이력이 없습니다</h3>
            <p className="text-sm text-gray-500">
              {activeTab === 'analysis' ? '콘텐츠 분석' : '콘텐츠 생성'}을 시작하면 이곳에서 이력을 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <div key={item.id}>
                {/* 메인 항목 */}
                <div className="bg-white rounded-2xl shadow-sm border-2 border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 px-6 py-4">
                    {/* 날짜 */}
                    <div className="text-center min-w-[60px]">
                      <p className="text-xs text-gray-400">{item.date.split(' ')[0]}</p>
                      <p className="text-xs text-gray-400">{item.date.split(' ')[1]}</p>
                    </div>

                    {/* 구분선 */}
                    <div className="w-px h-10 bg-gray-200" />

                    {/* 제목 & 요약 */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{item.title}</h4>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{item.summary}</p>
                    </div>

                    {/* 점수 (분석인 경우) */}
                    {item.type === 'analysis' && item.analysisResult && (
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${
                          item.analysisResult.overallScore >= 70 ? 'bg-emerald-100 text-emerald-700' :
                          item.analysisResult.overallScore >= 40 ? 'bg-amber-100 text-amber-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {item.analysisResult.overallScore}점
                        </span>
                      </div>
                    )}

                    {/* 수정 이력 개수 (생성인 경우) */}
                    {item.type === 'generation' && item.revisions && item.revisions.length > 0 && (
                      <button
                        onClick={() => toggleRevisions(item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200 hover:bg-violet-200 hover:shadow-md transition-all"
                      >
                        <svg className={`w-3 h-3 transition-transform ${expandedRevisions.has(item.id) ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        수정 {item.revisions.length}건
                      </button>
                    )}

                    {/* 버튼 */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setViewItem(item); setViewRevisionId(null); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-indigo-50 text-indigo-600 border-2 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-400 hover:shadow-md transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        보기
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="inline-flex items-center p-1.5 text-xs rounded-lg text-gray-400 border-2 border-transparent hover:text-red-500 hover:bg-red-50 hover:border-red-200 hover:shadow-md transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 수정 이력 하위 목록 */}
                {expandedRevisions.has(item.id) && item.revisions && item.revisions.length > 0 && (
                  <div className="ml-8 mt-1 space-y-1">
                    {item.revisions.map((rev, i) => (
                      <div
                        key={rev.id}
                        className="bg-violet-50 rounded-xl border-2 border-violet-200 hover:border-violet-400 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4 px-5 py-3">
                          <div className="text-center min-w-[60px]">
                            <p className="text-xs text-violet-400">{rev.date.split(' ')[0]}</p>
                            <p className="text-xs text-violet-400">{rev.date.split(' ')[1]}</p>
                          </div>
                          <div className="w-px h-8 bg-violet-200" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-violet-800">수정 #{i + 1}</h4>
                            <p className="text-xs text-violet-500 truncate mt-0.5">{rev.editNotes}</p>
                          </div>
                          <button
                            onClick={() => { setViewItem(item); setViewRevisionId(rev.id); }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-violet-600 border-2 border-violet-200 hover:bg-violet-100 hover:border-violet-400 hover:shadow-md transition-all"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            보기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
