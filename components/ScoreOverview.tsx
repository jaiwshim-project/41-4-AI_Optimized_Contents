'use client';

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import type { AnalysisResponse } from '@/lib/types';

interface ScoreOverviewProps {
  result: AnalysisResponse;
}

export default function ScoreOverview({ result }: ScoreOverviewProps) {
  const radarData = [
    { subject: '구조화 답변', value: result.aio.structuredAnswer },
    { subject: '명확성', value: result.aio.clarity },
    { subject: '인용 가능성', value: result.aio.citability },
    { subject: 'AI검색 친화', value: result.geo.aiSearchFriendliness },
    { subject: 'E-E-A-T', value: Math.round((result.geo.eeat.experience + result.geo.eeat.expertise + result.geo.eeat.authoritativeness + result.geo.eeat.trustworthiness) / 4) },
    { subject: '의미 완성도', value: result.geo.semanticCompleteness },
  ];

  const overallColor = result.overallScore >= 80 ? 'text-green-600' : result.overallScore >= 60 ? 'text-blue-600' : result.overallScore >= 40 ? 'text-orange-600' : 'text-red-600';

  return (
    <div className="bg-indigo-50 rounded-2xl shadow-sm border-2 border-indigo-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">종합 분석 결과</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 종합 점수 */}
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="68" fill="none" strokeWidth="12" className="stroke-gray-100" />
              <circle
                cx="80" cy="80" r="68" fill="none" strokeWidth="12"
                className={result.overallScore >= 80 ? 'stroke-green-500' : result.overallScore >= 60 ? 'stroke-blue-500' : result.overallScore >= 40 ? 'stroke-orange-500' : 'stroke-red-500'}
                strokeDasharray={2 * Math.PI * 68}
                strokeDashoffset={2 * Math.PI * 68 * (1 - result.overallScore / 100)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-4xl font-bold ${overallColor}`}>{result.overallScore}</span>
              <span className="text-xs text-gray-400 mt-1">/ 100</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 text-center">
            {result.overallScore >= 80 && 'AI 검색엔진 최적화가 매우 잘 되어있습니다!'}
            {result.overallScore >= 60 && result.overallScore < 80 && '양호하지만 개선할 부분이 있습니다.'}
            {result.overallScore >= 40 && result.overallScore < 60 && '기본적인 최적화가 필요합니다.'}
            {result.overallScore < 40 && 'AI 검색 최적화를 위한 상당한 개선이 필요합니다.'}
          </p>

          <div className="grid grid-cols-2 gap-3 mt-4 w-full">
            <div className="text-center bg-blue-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-blue-600">{result.aio.total}</p>
              <p className="text-xs text-gray-500 mt-1">AIO 점수</p>
            </div>
            <div className="text-center bg-purple-50 rounded-xl p-3">
              <p className="text-2xl font-bold text-purple-600">{result.geo.total}</p>
              <p className="text-xs text-gray-500 mt-1">GEO 점수</p>
            </div>
          </div>
        </div>

        {/* 레이더 차트 */}
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="점수" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
