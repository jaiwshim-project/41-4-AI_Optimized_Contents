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
    period: '/월',
    description: '기본 기능을 체험해보세요',
    limit: 3,
    color: 'from-gray-500 to-gray-600',
    border: 'border-gray-300',
    bg: 'bg-gray-50',
    badge: '',
  },
  {
    id: 'pro' as PlanType,
    name: '프로',
    price: '₩29,000',
    period: '/월',
    description: '전문적인 콘텐츠 최적화',
    limit: 15,
    color: 'from-blue-600 to-indigo-600',
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    badge: '인기',
  },
  {
    id: 'max' as PlanType,
    name: '맥스',
    price: '₩79,000',
    period: '/월',
    description: '대량 콘텐츠 최적화에 최적',
    limit: 50,
    color: 'from-violet-600 to-purple-600',
    border: 'border-violet-300',
    bg: 'bg-violet-50',
    badge: '최대',
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">요금제</h2>
          <p className="text-gray-500">필요에 맞는 플랜을 선택하세요</p>
        </div>

        {/* 요금제 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 border-2 ${plan.border} ${plan.bg} ${
                  isCurrent ? 'ring-2 ring-indigo-400 shadow-lg' : 'shadow-sm'
                } transition-all`}
              >
                {plan.badge && (
                  <span className={`absolute -top-3 right-4 px-3 py-0.5 bg-gradient-to-r ${plan.color} text-white text-xs font-bold rounded-full`}>
                    {plan.badge}
                  </span>
                )}
                {isCurrent && (
                  <span className="absolute -top-3 left-4 px-3 py-0.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                    현재 플랜
                  </span>
                )}

                <h3 className="text-lg font-bold text-gray-900 mb-1">{plan.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{plan.description}</p>

                <div className="mb-6">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>

                <div className="space-y-3 mb-6">
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
          <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">이번 달 사용량</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {usage.map((u) => {
                const percentage = Math.min((u.current / u.limit) * 100, 100);
                const isOver = u.current >= u.limit;
                return (
                  <div key={u.feature} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-2">{u.label}</p>
                    <div className="flex items-end gap-1 mb-2">
                      <span className={`text-2xl font-bold ${isOver ? 'text-red-600' : 'text-gray-900'}`}>
                        {u.current}
                      </span>
                      <span className="text-sm text-gray-500 mb-0.5">/ {u.limit}회</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isOver ? 'bg-red-500' : percentage > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 비교표 */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border-2 border-gray-200 overflow-hidden">
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
