'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { GEOScore } from '@/lib/types';

interface GEOAnalysisProps {
  geo: GEOScore;
}

export default function GEOAnalysis({ geo }: GEOAnalysisProps) {
  const eeatData = [
    { name: '경험', score: geo.eeat.experience, fill: '#3b82f6' },
    { name: '전문성', score: geo.eeat.expertise, fill: '#8b5cf6' },
    { name: '권위성', score: geo.eeat.authoritativeness, fill: '#f59e0b' },
    { name: '신뢰성', score: geo.eeat.trustworthiness, fill: '#10b981' },
  ];

  const geoMetrics = [
    { label: 'AI 검색 친화도', score: geo.aiSearchFriendliness, color: 'bg-blue-500' },
    { label: '구조화 데이터', score: geo.structuredData, color: 'bg-purple-500' },
    { label: '의미적 완성도', score: geo.semanticCompleteness, color: 'bg-green-500' },
  ];

  return (
    <div className="bg-purple-50 rounded-2xl shadow-sm border-2 border-purple-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-1">GEO 분석</h2>
      <p className="text-sm text-gray-500 mb-5">Generative Engine에서의 콘텐츠 최적화 수준을 분석합니다</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GEO 메트릭 바 */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-700">GEO 핵심 지표</h3>
          {geoMetrics.map((metric) => (
            <div key={metric.label}>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">{metric.label}</span>
                <span className="text-sm font-semibold text-gray-900">{metric.score}점</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`${metric.color} h-2.5 rounded-full transition-all duration-1000`}
                  style={{ width: `${metric.score}%` }}
                />
              </div>
            </div>
          ))}

          {/* 상세 분석 */}
          {geo.details.length > 0 && (
            <div className="mt-4 space-y-3">
              {geo.details.map((detail, i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-800">{detail.category}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${detail.score >= 70 ? 'bg-green-100 text-green-700' : detail.score >= 40 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>
                      {detail.score}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{detail.description}</p>
                  {detail.suggestions.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {detail.suggestions.map((s, j) => (
                        <li key={j} className="text-xs text-purple-600 flex items-start gap-1.5">
                          <span className="mt-1 w-1 h-1 rounded-full bg-purple-400 flex-shrink-0" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* E-E-A-T 차트 */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">E-E-A-T 신호 분석</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eeatData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={55} />
                <Tooltip
                  formatter={(value) => [`${value}점`, '점수']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '13px' }}
                />
                <Bar dataKey="score" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 p-3 bg-indigo-50 rounded-xl">
            <p className="text-xs text-indigo-700">
              <strong>E-E-A-T</strong>는 Google과 AI 검색엔진이 콘텐츠 품질을 평가하는 핵심 기준입니다.
              경험(Experience), 전문성(Expertise), 권위성(Authoritativeness), 신뢰성(Trustworthiness)을 높이면
              AI 인용 확률이 크게 향상됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
