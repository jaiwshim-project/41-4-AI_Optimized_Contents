'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getUserPlan, getUsageSummary, type PlanType, type FeatureType } from '@/lib/usage';

const plans = [
  {
    id: 'free' as PlanType,
    name: '무료',
    price: '₩0',
    originalPrice: '',
    period: '/월',
    description: '기본 기능을 체험해보세요',
    limit: 3,
    color: 'from-gray-500 to-gray-600',
    border: 'border-gray-300',
    bg: 'bg-gray-50',
    badge: '',
    discount: '',
  },
  {
    id: 'pro' as PlanType,
    name: '프로',
    price: '₩29,000',
    originalPrice: '₩59,000',
    period: '/월',
    description: '전문적인 콘텐츠 최적화',
    limit: 15,
    color: 'from-blue-600 to-indigo-600',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    badge: '인기',
    discount: '51% OFF',
  },
  {
    id: 'max' as PlanType,
    name: '맥스',
    price: '₩79,000',
    originalPrice: '₩149,000',
    period: '/월',
    description: '대량 콘텐츠 최적화에 최적',
    limit: 50,
    color: 'from-violet-600 to-purple-600',
    border: 'border-violet-300',
    bg: 'bg-violet-50',
    badge: '최대',
    discount: '47% OFF',
  },
];

const features = [
  { key: 'analyze' as FeatureType, label: '콘텐츠 분석' },
  { key: 'generate' as FeatureType, label: '콘텐츠 생성' },
  { key: 'keyword' as FeatureType, label: '키워드 분석' },
  { key: 'series' as FeatureType, label: '시리즈 기획' },
];

export default function PricingPage() {
  const [currentPlan, setCurrentPlan] = useState<PlanType>('free');
  const [usage, setUsage] = useState<{ feature: FeatureType; label: string; current: number; limit: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserPlan(), getUsageSummary()])
      .then(([plan, summary]) => {
        setCurrentPlan(plan);
        setUsage(summary);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900 mb-3">요금제</h2>
          <p className="text-gray-500">필요에 맞는 플랜을 선택하세요</p>
        </div>

        {/* 프로모션 배너 */}
        <div className="mb-6 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-xl p-5 text-white shadow-lg border-2 border-orange-300 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full" />
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold">Grand Open 프로모션</h3>
                <span className="px-2.5 py-0.5 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">SALE</span>
              </div>
              <p className="text-white/90 text-sm">그랜드 오픈을 기념하여 <strong>최대 51% 할인</strong>된 특별 가격으로 제공합니다</p>
            </div>
          </div>
        </div>

        {/* 관리자 배너 */}
        {!loading && currentPlan === 'admin' && (
          <div className="mb-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl p-5 text-white shadow-lg border-2 border-red-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold">관리자 계정</h3>
                <p className="text-white/80 text-sm">모든 기능을 무제한으로 사용할 수 있습니다</p>
              </div>
            </div>
          </div>
        )}

        {/* 요금제 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-xl p-5 border-2 ${plan.border} ${plan.bg} ${
                  isCurrent ? 'ring-2 ring-indigo-400 shadow-lg' : 'shadow-sm'
                } transition-all`}
              >
                {plan.discount && (
                  <span className="absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full">
                    {plan.discount}
                  </span>
                )}
                {plan.badge && !plan.discount && (
                  <span className={`absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r ${plan.color} text-white text-xs font-bold rounded-full`}>
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    현재 플랜
                  </span>
                )}

                <h3 className="text-sm font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{plan.description}</p>

                <div className="mb-4">
                  {plan.originalPrice && (
                    <div className="mb-1">
                      <span className="text-sm text-gray-400 line-through">{plan.originalPrice}</span>
                    </div>
                  )}
                  <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                  {plan.originalPrice && (
                    <span className="ml-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      프로모션가
                    </span>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  {features.map((f) => (
                    <div key={f.key} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{f.label}</span>
                      <span className={`font-semibold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                        {plan.limit}회/월
                      </span>
                    </div>
                  ))}
                </div>

                {plan.id === 'free' ? (
                  <button
                    disabled
                    className="w-full py-2.5 bg-gray-200 text-gray-500 font-semibold rounded-xl cursor-not-allowed text-sm"
                  >
                    기본 플랜
                  </button>
                ) : (
                  <button
                    className={`w-full py-2.5 bg-gradient-to-r ${plan.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-md border-2 ${plan.border} text-sm`}
                  >
                    준비 중
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* 이번 달 사용량 */}
        {!loading && usage.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border-2 border-red-400 p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              이번 달 사용량
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                currentPlan === 'admin' ? 'bg-red-100 text-red-700 border-red-300'
                : currentPlan === 'pro' ? 'bg-blue-100 text-blue-700 border-blue-300'
                : currentPlan === 'max' ? 'bg-violet-100 text-violet-700 border-violet-300'
                : 'bg-gray-100 text-gray-700 border-gray-300'
              }`}>
                {currentPlan === 'admin' ? '관리자' : currentPlan === 'pro' ? '프로' : currentPlan === 'max' ? '맥스' : '무료'}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {usage.map((u) => {
                const isUnlimited = currentPlan === 'admin';
                const percentage = isUnlimited ? 0 : Math.min((u.current / u.limit) * 100, 100);
                const isOver = !isUnlimited && u.current >= u.limit;
                return (
                  <div key={u.feature} className="bg-gray-50 rounded-xl p-4 border-2 border-violet-300">
                    <p className="text-sm font-medium text-gray-700 mb-2">{u.label}</p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className={`text-xl font-bold ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                        {u.current}
                      </span>
                      <span className="text-sm text-gray-500 mb-0.5">
                        {isUnlimited ? '/ 무제한' : `/ ${u.limit}회`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isUnlimited ? 'bg-emerald-500' : isOver ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: isUnlimited ? '100%' : `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 비교표 */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border-2 border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 font-semibold text-gray-700">기능</th>
                <th className="text-center px-4 py-4 font-semibold text-gray-700">무료</th>
                <th className="text-center px-4 py-4 font-semibold text-blue-700">프로</th>
                <th className="text-center px-4 py-4 font-semibold text-violet-700">맥스</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-orange-50/50 border-b border-orange-100">
                <td className="px-6 py-3 text-gray-700 font-medium">월 요금</td>
                <td className="text-center px-4 py-3 text-gray-600">₩0</td>
                <td className="text-center px-4 py-3">
                  <span className="text-xs text-gray-400 line-through block">₩59,000</span>
                  <span className="text-blue-600 font-bold">₩29,000</span>
                </td>
                <td className="text-center px-4 py-3">
                  <span className="text-xs text-gray-400 line-through block">₩149,000</span>
                  <span className="text-violet-600 font-bold">₩79,000</span>
                </td>
              </tr>
              {features.map((f, i) => (
                <tr key={f.key} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 text-gray-700">{f.label}</td>
                  <td className="text-center px-4 py-3 text-gray-600">3회/월</td>
                  <td className="text-center px-4 py-3 text-blue-600 font-medium">15회/월</td>
                  <td className="text-center px-4 py-3 text-violet-600 font-medium">50회/월</td>
                </tr>
              ))}
              <tr className="bg-white border-t border-gray-200">
                <td className="px-6 py-3 text-gray-700">대시보드</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="px-6 py-3 text-gray-700">API 키 관리</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
                <td className="text-center px-4 py-3 text-emerald-600">&#10003;</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
      <Footer />
    </div>
  );
}
