'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { createClient } from '@/lib/supabase-client';
import { getUserPlan, type PlanType } from '@/lib/usage';
import type { User } from '@supabase/supabase-js';

interface Question {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  content: string;
  answer: string | null;
  answered_at: string | null;
  created_at: string;
}

interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  content: string;
  created_at: string;
}

type Tab = 'questions' | 'reviews';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<Tab>('questions');
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<PlanType>('free');
  const [loading, setLoading] = useState(true);

  // 질문 상태
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qTitle, setQTitle] = useState('');
  const [qContent, setQContent] = useState('');
  const [qSubmitting, setQSubmitting] = useState(false);
  const [expandedQ, setExpandedQ] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [answering, setAnswering] = useState(false);

  // 후기 상태
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rRating, setRRating] = useState(5);
  const [rContent, setRContent] = useState('');
  const [rSubmitting, setRSubmitting] = useState(false);

  const [showQForm, setShowQForm] = useState(false);
  const [showRForm, setShowRForm] = useState(false);

  const isAdmin = plan === 'admin';

  useEffect(() => {
    const load = async () => {
      try {
        // 사용자 확인 (비로그인도 허용)
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const p = await getUserPlan();
          setPlan(p);
        }
        await loadData();
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const loadData = async () => {
    // 비로그인도 조회 가능하도록 API 사용
    const res = await fetch('/api/community/list');
    if (res.ok) {
      const data = await res.json();
      setQuestions(data.questions || []);
      setReviews(data.reviews || []);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  const handleSubmitQuestion = async () => {
    if (!qTitle.trim() || !qContent.trim() || !user) return;
    setQSubmitting(true);
    try {
      const supabase = createClient();
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자';
      const { error } = await supabase.from('questions').insert({
        user_id: user.id,
        user_name: userName,
        title: qTitle.trim(),
        content: qContent.trim(),
      });
      if (error) throw error;
      setQTitle('');
      setQContent('');
      setShowQForm(false);
      await loadData();
    } catch {
      alert('질문 등록에 실패했습니다.');
    } finally {
      setQSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!rContent.trim() || !user) return;
    setRSubmitting(true);
    try {
      const supabase = createClient();
      const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || '사용자';
      const { error } = await supabase.from('reviews').insert({
        user_id: user.id,
        user_name: userName,
        rating: rRating,
        content: rContent.trim(),
      });
      if (error) throw error;
      setRContent('');
      setRRating(5);
      setShowRForm(false);
      await loadData();
    } catch {
      alert('후기 등록에 실패했습니다.');
    } finally {
      setRSubmitting(false);
    }
  };

  const handleAnswer = async (questionId: string) => {
    if (!answerText.trim()) return;
    setAnswering(true);
    try {
      const res = await fetch('/api/community/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer: answerText.trim() }),
      });
      if (!res.ok) throw new Error();
      setAnswerText('');
      await loadData();
    } catch {
      alert('답변 등록에 실패했습니다.');
    } finally {
      setAnswering(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('질문을 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('questions').delete().eq('id', id);
    await loadData();
  };

  const handleDeleteReview = async (id: string) => {
    if (!confirm('후기를 삭제하시겠습니까?')) return;
    const supabase = createClient();
    await supabase.from('reviews').delete().eq('id', id);
    await loadData();
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-5">
            {/* 탭 헤더 */}
            <div className="bg-white rounded-xl shadow-sm border-2 border-indigo-200 overflow-hidden">
              <div className="flex border-b border-indigo-100">
                <button
                  onClick={() => setActiveTab('questions')}
                  className={`flex-1 py-3 text-sm font-bold text-center transition-all ${
                    activeTab === 'questions'
                      ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  질문 <span className="ml-1 text-xs font-normal text-gray-400">({questions.length})</span>
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-3 text-sm font-bold text-center transition-all ${
                    activeTab === 'reviews'
                      ? 'text-indigo-700 bg-indigo-50 border-b-2 border-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  후기 <span className="ml-1 text-xs font-normal text-gray-400">({reviews.length})</span>
                </button>
              </div>

              {/* ===================== 질문 탭 ===================== */}
              {activeTab === 'questions' && (
                <div className="p-5">
                  {/* 질문 작성 버튼 (로그인 시만) */}
                  {user && !showQForm && (
                    <button
                      onClick={() => setShowQForm(true)}
                      className="w-full mb-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
                    >
                      질문 작성하기
                    </button>
                  )}
                  {!user && (
                    <div className="mb-4 text-center py-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500">질문을 작성하려면 <a href="/login" className="text-indigo-600 font-semibold">로그인</a>이 필요합니다.</p>
                    </div>
                  )}

                  {/* 질문 작성 폼 */}
                  {showQForm && (
                    <div className="mb-5 bg-indigo-50/50 rounded-xl p-4 border border-indigo-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">새 질문 작성</h3>
                      <input
                        type="text"
                        placeholder="질문 제목"
                        value={qTitle}
                        onChange={(e) => setQTitle(e.target.value)}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 mb-2"
                      />
                      <textarea
                        placeholder="질문 내용을 입력하세요"
                        value={qContent}
                        onChange={(e) => setQContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-400 resize-none mb-3"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setShowQForm(false); setQTitle(''); setQContent(''); }}
                          className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSubmitQuestion}
                          disabled={qSubmitting || !qTitle.trim() || !qContent.trim()}
                          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {qSubmitting ? '등록 중...' : '등록'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 질문 목록 */}
                  {questions.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400">
                      아직 질문이 없습니다. 첫 번째 질문을 남겨보세요!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {questions.map((q) => (
                        <div key={q.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                          <button
                            onClick={() => { setExpandedQ(expandedQ === q.id ? null : q.id); setAnswerText(q.answer || ''); }}
                            className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-all"
                          >
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                              q.answer ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                            }`}>
                              {q.answer ? '답변 완료' : '대기 중'}
                            </span>
                            <span className="text-sm font-medium text-gray-900 flex-1 truncate">{q.title}</span>
                            <span className="text-[10px] text-gray-400 shrink-0">{q.user_name}</span>
                            <span className="text-[10px] text-gray-400 shrink-0">{formatDate(q.created_at)}</span>
                            <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${expandedQ === q.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {expandedQ === q.id && (
                            <div className="border-t border-gray-100 px-4 py-4 space-y-3">
                              {/* 질문 내용 */}
                              <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.content}</p>
                              </div>

                              {/* 답변 */}
                              {q.answer && (
                                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-500 text-white rounded">관리자 답변</span>
                                    {q.answered_at && (
                                      <span className="text-[10px] text-gray-400">{formatDate(q.answered_at)}</span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{q.answer}</p>
                                </div>
                              )}

                              {/* 관리자 답변 입력 */}
                              {isAdmin && (
                                <div className="bg-red-50/50 rounded-lg p-3 border border-red-200">
                                  <h4 className="text-xs font-bold text-red-700 mb-2">
                                    {q.answer ? '답변 수정' : '답변 작성'}
                                  </h4>
                                  <textarea
                                    placeholder="답변을 입력하세요"
                                    value={answerText}
                                    onChange={(e) => setAnswerText(e.target.value)}
                                    rows={3}
                                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-red-400 resize-none mb-2"
                                  />
                                  <button
                                    onClick={() => handleAnswer(q.id)}
                                    disabled={answering || !answerText.trim()}
                                    className="px-4 py-1.5 text-xs font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                                  >
                                    {answering ? '저장 중...' : '답변 저장'}
                                  </button>
                                </div>
                              )}

                              {/* 본인 질문 삭제 */}
                              {user?.id === q.user_id && (
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className="text-[10px] text-red-400 hover:text-red-600 transition-all"
                                  >
                                    삭제
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ===================== 후기 탭 ===================== */}
              {activeTab === 'reviews' && (
                <div className="p-5">
                  {/* 평균 별점 */}
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-3 mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-5 h-5 ${star <= Math.round(Number(avgRating)) ? 'text-amber-400' : 'text-gray-200'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-lg font-bold text-amber-700 tabular-nums">{avgRating}</span>
                      <span className="text-xs text-gray-500">({reviews.length}개 후기)</span>
                    </div>
                  )}

                  {/* 후기 작성 버튼 (로그인 시만) */}
                  {user && !showRForm && (
                    <button
                      onClick={() => setShowRForm(true)}
                      className="w-full mb-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
                    >
                      후기 작성하기
                    </button>
                  )}
                  {!user && (
                    <div className="mb-4 text-center py-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-xs text-gray-500">후기를 작성하려면 <a href="/login" className="text-indigo-600 font-semibold">로그인</a>이 필요합니다.</p>
                    </div>
                  )}

                  {/* 후기 작성 폼 */}
                  {showRForm && (
                    <div className="mb-5 bg-amber-50/50 rounded-xl p-4 border border-amber-200">
                      <h3 className="text-sm font-bold text-gray-900 mb-3">후기 작성</h3>
                      {/* 별점 선택 */}
                      <div className="mb-3">
                        <label className="text-xs font-medium text-gray-600 mb-1 block">별점</label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setRRating(star)}
                              className="focus:outline-none"
                            >
                              <svg
                                className={`w-7 h-7 transition-colors ${star <= rRating ? 'text-amber-400' : 'text-gray-200'} hover:text-amber-300`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            </button>
                          ))}
                          <span className="ml-2 text-sm font-bold text-amber-600">{rRating}점</span>
                        </div>
                      </div>
                      <textarea
                        placeholder="서비스 이용 후기를 남겨주세요"
                        value={rContent}
                        onChange={(e) => setRContent(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-400 resize-none mb-3"
                      />
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => { setShowRForm(false); setRContent(''); setRRating(5); }}
                          className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleSubmitReview}
                          disabled={rSubmitting || !rContent.trim()}
                          className="px-4 py-2 text-xs font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {rSubmitting ? '등록 중...' : '등록'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 후기 목록 */}
                  {reviews.length === 0 ? (
                    <div className="text-center py-10 text-sm text-gray-400">
                      아직 후기가 없습니다. 첫 번째 후기를 남겨보세요!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reviews.map((r) => (
                        <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <svg
                                    key={star}
                                    className={`w-3.5 h-3.5 ${star <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-xs font-medium text-gray-700">{r.user_name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400">{formatDate(r.created_at)}</span>
                              {user?.id === r.user_id && (
                                <button
                                  onClick={() => handleDeleteReview(r.id)}
                                  className="text-[10px] text-red-400 hover:text-red-600 transition-all"
                                >
                                  삭제
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{r.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
