import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  Packer,
} from 'docx';
import { saveAs } from 'file-saver';

function title(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { after: 100 },
    children: [new TextRun({ text, bold: true, size: 48, color: '1e3a5f' })],
  });
}

function subtitle(text: string): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 400 },
    children: [new TextRun({ text, size: 22, color: '6b7280' })],
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '4f46e5' } },
    children: [new TextRun({ text, bold: true, size: 32, color: '1e40af' })],
  });
}

function h3(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, color: '374151' })],
  });
}

function body(text: string): Paragraph {
  return new Paragraph({
    spacing: { after: 150 },
    children: [new TextRun({ text, size: 22, color: '4b5563' })],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 80 },
    children: [new TextRun({ text, size: 22, color: '4b5563' })],
  });
}

function bullet2(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 1 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 20, color: '4b5563' })],
  });
}

function beforeAfterRow(before: string, after: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 4750, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'fef2f2' },
        children: [
          new Paragraph({ spacing: { before: 40, after: 20 }, children: [new TextRun({ text: 'Before', bold: true, size: 18, color: 'ef4444' })] }),
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: before, size: 20, color: '4b5563' })] }),
        ],
      }),
      new TableCell({
        width: { size: 4750, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'f0fdf4' },
        children: [
          new Paragraph({ spacing: { before: 40, after: 20 }, children: [new TextRun({ text: 'After', bold: true, size: 18, color: '22c55e' })] }),
          new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: after, size: 20, color: '4b5563' })] }),
        ],
      }),
    ],
  });
}

function colorH2(text: string, color: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 400, after: 200 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color } },
    children: [new TextRun({ text, bold: true, size: 32, color })],
  });
}

function spacer(): Paragraph {
  return new Paragraph({ spacing: { after: 200 }, children: [] });
}

function termRow(term: string, desc: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 2500, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'eff6ff' },
        children: [
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: term, bold: true, size: 22, color: '1e40af' })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 7000, type: WidthType.DXA },
        children: [
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [new TextRun({ text: desc, size: 22, color: '4b5563' })],
          }),
        ],
      }),
    ],
  });
}

function scoreCell(range: string, label: string, desc: string, color: string, bgColor: string): TableCell {
  return new TableCell({
    width: { size: 3166, type: WidthType.DXA },
    shading: { type: ShadingType.SOLID, color: bgColor },
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 40 },
        children: [new TextRun({ text: range, bold: true, size: 32, color })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 40 },
        children: [new TextRun({ text: label, bold: true, size: 22, color })],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        children: [new TextRun({ text: desc, size: 18, color })],
      }),
    ],
  });
}

export async function downloadManualDocx() {
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Malgun Gothic', size: 22 },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 },
          },
        },
        children: [
          // 타이틀
          spacer(),
          title('GEOAIO'),
          subtitle('사용자 매뉴얼'),
          spacer(),

          // 소개
          h2('GEOAIO란?'),
          body(
            'GEOAIO는 AI 검색엔진(AI Overview, Generative Engine)에 최적화된 콘텐츠를 작성할 수 있도록 도와주는 분석 도구입니다. Claude API를 활용하여 콘텐츠를 다각도로 분석하고, AI 검색 결과에 노출될 가능성을 높이기 위한 구체적인 개선 방안을 제시합니다.'
          ),
          spacer(),

          // 시작하기
          h2('1. 시작하기'),
          h3('콘텐츠 입력'),
          body(
            '분석하고 싶은 콘텐츠(블로그 글, 기사, 웹페이지 텍스트 등)를 텍스트 입력 영역에 붙여넣기 합니다.'
          ),
          h3('타겟 키워드 (선택)'),
          body(
            '최적화하려는 주요 검색 키워드를 입력합니다. 입력하면 해당 키워드에 대한 맞춤 분석을 제공합니다.'
          ),
          h3('URL (선택)'),
          body(
            '콘텐츠가 게시된 URL을 입력하면 추가적인 컨텍스트를 바탕으로 분석합니다.'
          ),
          spacer(),

          // 분석 결과
          h2('2. 분석 결과 이해하기'),
          h3('종합 개요'),
          body(
            '전체 GEO/AIO 점수와 주요 지표를 한눈에 확인할 수 있는 대시보드입니다. 콘텐츠의 전반적인 AI 최적화 수준을 빠르게 파악할 수 있습니다.'
          ),
          h3('AIO 분석 (AI Overview)'),
          body(
            'Google AI Overview에 콘텐츠가 인용될 가능성을 분석합니다. 구조화된 답변 형식, 신뢰성, 간결성 등 AIO 노출에 영향을 미치는 요소를 평가합니다.'
          ),
          h3('GEO 분석 (Generative Engine Optimization)'),
          body(
            '생성형 AI 엔진이 콘텐츠를 이해하고 활용하기 쉬운 정도를 분석합니다. 의미적 명확성, 전문성, 컨텍스트 완성도 등을 평가합니다.'
          ),
          h3('키워드 분석'),
          body(
            '콘텐츠 내 주요 키워드의 분포, 밀도, 관련성을 분석합니다. 타겟 키워드가 입력된 경우 해당 키워드의 최적화 상태를 집중적으로 확인합니다.'
          ),
          h3('개선 제안'),
          body(
            '분석 결과를 바탕으로 콘텐츠 개선을 위한 구체적이고 실행 가능한 제안을 제공합니다. 우선순위별로 정리되어 효율적인 최적화 작업이 가능합니다.'
          ),
          spacer(),

          // 점수 해석
          h2('3. 점수 해석 가이드'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              new TableRow({
                children: [
                  scoreCell('0 ~ 39', '개선 필요', 'AI 검색엔진 최적화가 부족한 상태입니다.', 'dc2626', 'fef2f2'),
                  scoreCell('40 ~ 69', '보통', '기본적인 최적화는 되어 있으나 추가 개선이 필요합니다.', 'ca8a04', 'fefce8'),
                  scoreCell('70 ~ 100', '우수', 'AI 검색엔진에 잘 최적화된 콘텐츠입니다.', '16a34a', 'f0fdf4'),
                ],
              }),
            ],
          }),
          spacer(),

          // 용어 설명
          h2('4. 용어 설명'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              termRow('AIO', 'AI Overview의 약자. Google 검색 결과 상단에 AI가 생성하는 요약 답변입니다.'),
              termRow('GEO', 'Generative Engine Optimization의 약자. 생성형 AI 검색엔진에 최적화하는 전략입니다.'),
              termRow('키워드 밀도', '전체 콘텐츠 대비 특정 키워드가 차지하는 비율입니다.'),
              termRow('구조화 데이터', 'AI가 콘텐츠를 쉽게 이해할 수 있도록 정리된 형식(리스트, 표, Q&A 등)의 데이터입니다.'),
              termRow('E-E-A-T', '경험(Experience), 전문성(Expertise), 권위(Authoritativeness), 신뢰성(Trustworthiness)의 약자입니다.'),
            ],
          }),
          spacer(),

          // ===== GEO/AIO 최적화 실전 가이드 =====

          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 600, after: 400 },
            border: {
              top: { style: BorderStyle.SINGLE, size: 8, color: '6366f1' },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: '6366f1' },
            },
            children: [new TextRun({ text: 'GEO/AIO 최적화 실전 가이드', bold: true, size: 36, color: '4f46e5' })],
          }),

          // 5. 콘텐츠 구조 재구성법
          colorH2('5. 콘텐츠 구조 재구성법', 'e11d48'),
          body('AI 검색엔진은 잘 구조화된 콘텐츠를 선호합니다. 다음 원칙에 따라 콘텐츠를 재구성하면 GEO/AIO 점수가 크게 향상됩니다.'),
          spacer(),

          h3('① 역피라미드 구조 적용'),
          body('가장 중요한 정보를 글 상단에, 세부 내용은 하단에 배치합니다. AI는 상단 콘텐츠를 우선적으로 인용합니다.'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              beforeAfterRow(
                '서론 → 배경 설명 → 상세 내용 → 핵심 결론',
                '핵심 결론/답변 → 상세 근거 → 배경 설명 → 부가 정보'
              ),
            ],
          }),
          spacer(),

          h3('② 명확한 헤딩 계층 구조'),
          body('H1 → H2 → H3 순서로 논리적인 계층을 만듭니다. 각 헤딩은 해당 섹션의 내용을 정확히 요약해야 합니다.'),
          bullet('H1: 페이지 전체 제목 (1개)'),
          bullet('H2: 주요 섹션 제목 (3~7개)'),
          bullet('H3: 세부 항목 제목 (필요시)'),
          spacer(),

          h3('③ 리스트와 표 적극 활용'),
          body('AI는 글 형태보다 리스트, 표, 단계별 가이드 형식의 데이터를 더 쉽게 파싱하고 인용합니다.'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              beforeAfterRow(
                '콘텐츠 최적화를 위해서는 키워드를 적절히 배치하고 헤딩 구조를 잡아야 하며 내부 링크를 활용하는 것이 좋습니다.',
                '콘텐츠 최적화 3단계:\n1. 키워드를 제목, 소제목, 본문에 자연스럽게 배치\n2. H1~H3 헤딩으로 논리적 구조 설계\n3. 관련 페이지로의 내부 링크 추가'
              ),
            ],
          }),
          spacer(),

          h3('④ 한 문단 한 주제 원칙'),
          body('각 문단은 하나의 명확한 주제만 다룹니다. 2~4문장으로 간결하게 작성하고, AI가 특정 문단을 독립적으로 인용할 수 있게 합니다. 긴 문단은 여러 개로 분리하세요.'),
          spacer(),

          // 6. 키워드 최적화 방법
          colorH2('6. 키워드 최적화 방법', 'd97706'),
          body('올바른 키워드 전략은 AI 검색 노출의 핵심입니다. 단순한 키워드 반복이 아닌, 의미 중심의 최적화가 필요합니다.'),
          spacer(),

          h3('키워드 배치 핵심 위치'),
          body('핵심 키워드는 아래 4곳에 반드시 포함시키세요. AI는 이 위치의 텍스트를 콘텐츠 주제 파악에 가장 많이 활용합니다.'),
          bullet('제목 (H1)'),
          bullet('소제목 (H2~H3)'),
          bullet('첫 문단 (100자 이내)'),
          bullet('메타 디스크립션'),
          spacer(),

          h3('적정 키워드 밀도'),
          bullet('핵심 키워드: 1.5% ~ 2.5% (적정)'),
          bullet2('1% 미만이면 주제 인식 부족, 3% 초과하면 키워드 스터핑으로 감점'),
          bullet('관련 키워드 / LSI 키워드: 0.5% ~ 1.5%'),
          bullet2('핵심 키워드의 동의어, 유사어를 자연스럽게 분산 배치'),
          spacer(),

          h3('의미적 키워드 확장 (Semantic SEO)'),
          body('AI는 단순 키워드 매칭이 아니라 의미를 이해합니다. 관련 주제를 폭넓게 다뤄야 합니다.'),
          body('예시: 핵심 키워드가 "콘텐츠 마케팅"인 경우 → 콘텐츠 전략, SEO 최적화, 블로그 마케팅, 타겟 오디언스, CTA, 전환율, 콘텐츠 캘린더, B2B 마케팅, 스토리텔링, 데이터 기반 마케팅 등을 자연스럽게 포함'),
          spacer(),

          h3('롱테일 키워드 활용'),
          body('구체적인 질문형 롱테일 키워드를 소제목이나 FAQ에 활용하면 AI 검색 노출 확률이 높아집니다.'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              beforeAfterRow(
                '일반 키워드: 콘텐츠 최적화',
                '롱테일 키워드: AI 검색엔진에 콘텐츠를 최적화하는 방법'
              ),
            ],
          }),
          spacer(),

          // 7. E-E-A-T 강화법
          colorH2('7. E-E-A-T 강화법', '7c3aed'),
          body('E-E-A-T(경험, 전문성, 권위, 신뢰)는 AI가 콘텐츠를 인용할지 결정하는 핵심 기준입니다. 각 요소를 강화하는 구체적인 방법을 안내합니다.'),
          spacer(),

          h3('Experience (경험)'),
          body('실제 경험을 바탕으로 한 콘텐츠임을 보여주세요.'),
          bullet('"직접 테스트해본 결과..." 등 1인칭 경험 서술'),
          bullet('실제 사례, 스크린샷, 결과 데이터 포함'),
          bullet('구체적인 시행착오와 교훈 공유'),
          bullet('날짜, 기간 등 시간적 맥락 제시'),
          spacer(),

          h3('Expertise (전문성)'),
          body('해당 분야의 깊이 있는 지식을 증명하세요.'),
          bullet('전문 용어를 정확하게 사용하고 쉽게 설명'),
          bullet('깊이 있는 분석과 독자적인 인사이트 제시'),
          bullet('저자 프로필, 자격/경력 소개 포함'),
          bullet('관련 연구, 논문, 보고서 인용'),
          spacer(),

          h3('Authoritativeness (권위)'),
          body('해당 분야에서의 권위를 구축하세요.'),
          bullet('공신력 있는 출처 인용 (학술 논문, 공공 데이터 등)'),
          bullet('업계 전문가 인터뷰, 의견 인용'),
          bullet('수상 경력, 미디어 소개 등 사회적 증거'),
          bullet('관련 주제에 대한 다수의 콘텐츠 보유'),
          spacer(),

          h3('Trustworthiness (신뢰)'),
          body('콘텐츠의 정확성과 신뢰도를 높이세요.'),
          bullet('통계와 수치에 출처 명시 (예: "2025년 가트너 보고서에 따르면...")'),
          bullet('최신 정보로 정기적 업데이트 ("최종 수정: 2026.02")'),
          bullet('팩트 체크 완료 표시, 검수 과정 언급'),
          bullet('투명한 저자 정보, 연락처, 정정 정책'),
          spacer(),

          // 8. FAQ 섹션 생성법
          colorH2('8. FAQ 섹션 생성법', '0891b2'),
          body('FAQ는 AI Overview에 직접 인용될 확률이 가장 높은 콘텐츠 형식입니다. 효과적인 FAQ를 만드는 방법을 안내합니다.'),
          spacer(),

          h3('FAQ 작성 원칙'),
          bullet('실제 사용자 질문 기반 - Google 자동완성, "People Also Ask", 네이버 연관검색어에서 실제 질문을 수집'),
          bullet('답변은 2~4문장으로 간결하게 - AI가 그대로 인용할 수 있는 길이가 이상적'),
          bullet('질문에 키워드 포함 - 질문 자체에 타겟 키워드가 자연스럽게 들어가도록 구성'),
          bullet('5~10개의 FAQ가 적정 - 너무 적으면 커버리지 부족, 너무 많으면 품질 저하'),
          spacer(),

          h3('효과적인 FAQ 예시'),
          body('Q: AIO(AI Overview)에 콘텐츠가 노출되려면 어떻게 해야 하나요?'),
          body('A: AIO에 노출되려면 콘텐츠를 질문-답변 형식으로 구성하고, 핵심 답변을 2~3문장으로 간결하게 작성해야 합니다. 또한 통계와 출처를 포함하여 신뢰도를 높이고, 명확한 헤딩 구조로 AI가 내용을 쉽게 파악할 수 있도록 해야 합니다.'),
          spacer(),
          body('Q: GEO 최적화와 기존 SEO의 차이점은 무엇인가요?'),
          body('A: 기존 SEO가 검색엔진 랭킹 알고리즘에 초점을 맞추는 반면, GEO는 생성형 AI가 콘텐츠를 이해하고 인용하기 쉽도록 최적화하는 전략입니다. 의미적 완성도, E-E-A-T 신호, 구조화된 데이터 형식이 GEO의 핵심 요소입니다.'),
          spacer(),

          h3('FAQ 질문 유형별 템플릿'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              termRow('정의형', '"[키워드]란 무엇인가요?"'),
              termRow('방법형', '"[키워드]를 하는 방법은?"'),
              termRow('비교형', '"[A]와 [B]의 차이점은?"'),
              termRow('이유형', '"[키워드]가 중요한 이유는?"'),
              termRow('목록형', '"[키워드]의 종류/유형은?"'),
              termRow('비용/시간형', '"[키워드]에 얼마나 걸리나요?"'),
            ],
          }),
          spacer(),

          // 9. AI 인용 최적화
          colorH2('9. AI 인용 최적화 (Citability)', 'db2777'),
          body('AI가 콘텐츠를 인용하기 쉽게 만드는 것이 GEO/AIO의 최종 목표입니다.'),
          spacer(),

          h3('인용되기 쉬운 문장 작성법'),

          body('■ 정의문 포함'),
          body('"[주제]란 [정의]를 말합니다" 형태의 명확한 정의를 포함하세요.'),
          bullet2('예: "AIO란 Google 검색 결과 상단에 AI가 자동 생성하는 요약 답변입니다."'),
          spacer(),

          body('■ 수치와 통계 활용'),
          body('구체적인 숫자를 포함하면 AI가 팩트로 인용합니다.'),
          bullet2('예: "2025년 기준 전체 검색의 약 40%에서 AI Overview가 표시됩니다."'),
          spacer(),

          body('■ 단계별 설명'),
          body('"첫째... 둘째... 셋째..." 형태의 순서가 있는 설명'),
          bullet2('예: "GEO 최적화는 3단계로 진행됩니다. 첫째, 콘텐츠 구조화..."'),
          spacer(),

          body('■ 비교/대조 문장'),
          body('"A는 ~인 반면, B는 ~입니다" 형태'),
          bullet2('예: "SEO는 키워드 랭킹에 집중하는 반면, GEO는 AI의 의미 이해에 초점을 맞춥니다."'),
          spacer(),

          // 최적화 팁
          h2('최적화 팁'),
          bullet('질문-답변 형식으로 콘텐츠를 구성하면 AI Overview에 인용될 확률이 높아집니다.'),
          bullet('통계, 수치, 출처를 포함하여 콘텐츠의 신뢰도를 높이세요.'),
          bullet('명확한 헤딩 구조(H1, H2, H3)와 리스트를 활용하여 콘텐츠를 구조화하세요.'),
          bullet('핵심 정보를 글 상단에 배치하여 AI가 빠르게 핵심을 파악할 수 있도록 하세요.'),
          bullet('분석 후 개선 제안을 적용하고 재분석하여 점수 변화를 확인하세요.'),
          spacer(),

          // 푸터
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 400 },
            border: { top: { style: BorderStyle.SINGLE, size: 4, color: 'e5e7eb' } },
            children: [
              new TextRun({
                text: 'GEOAIO - AI 검색엔진 콘텐츠 최적화 도구 | Powered by AI',
                size: 18,
                color: '9ca3af',
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'AIO-GEO-Optimizer-사용자매뉴얼.docx');
}
