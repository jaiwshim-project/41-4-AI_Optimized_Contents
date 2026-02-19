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

function planRow(feature: string, free: string, pro: string, max: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        width: { size: 3000, type: WidthType.DXA },
        children: [new Paragraph({ spacing: { before: 40, after: 40 }, children: [new TextRun({ text: feature, bold: true, size: 20, color: '374151' })] })],
      }),
      new TableCell({
        width: { size: 2166, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'f3f4f6' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: free, size: 20, color: '6b7280' })] })],
      }),
      new TableCell({
        width: { size: 2166, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'eff6ff' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: pro, size: 20, color: '1d4ed8' })] })],
      }),
      new TableCell({
        width: { size: 2166, type: WidthType.DXA },
        shading: { type: ShadingType.SOLID, color: 'f5f3ff' },
        children: [new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 40, after: 40 }, children: [new TextRun({ text: max, size: 20, color: '7c3aed' })] })],
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
          title('GEO-AIO'),
          subtitle('사용자 매뉴얼'),
          spacer(),

          // 소개
          h2('GEO-AIO란?'),
          body(
            'GEO-AIO는 AI 검색엔진(AI Overview, Generative Engine)에 최적화된 콘텐츠를 작성할 수 있도록 도와주는 종합 콘텐츠 플랫폼입니다. Gemini API를 활용하여 콘텐츠 분석, 생성, 키워드 경쟁 분석, 시리즈 기획, SNS 채널별 변환, A/B 테스트 등 다양한 기능을 제공하며, Make.com 연동을 통한 자동화도 지원합니다.'
          ),
          spacer(),

          // 메뉴 구조 안내
          h2('메뉴 구조 안내'),
          h3('주요 메뉴'),
          bullet('분석: 기존 콘텐츠의 GEO/AIO 점수를 분석합니다'),
          bullet('생성: AI가 최적화된 새 콘텐츠를 생성합니다'),
          bullet('키워드: 키워드 경쟁 분석 및 전략 수립'),
          bullet('시리즈: 에피소드 기반 콘텐츠 시리즈 기획'),
          spacer(),
          h3('부가 메뉴'),
          bullet('요금제: 플랜 확인 및 업그레이드'),
          bullet('자료실: GEO/AIO 관련 가이드 PDF'),
          bullet('커뮤니티: 질문, 후기, 정보 공유'),
          bullet('Make 연동: Make.com 자동화 연동 가이드'),
          spacer(),
          h3('요금제 뱃지'),
          body('로그인 후 헤더에 현재 요금제가 뱃지로 표시됩니다: FREE, PRO, MAX, TESTER, ADMIN'),
          spacer(),

          // 1. API 키 설정
          h2('1. API 키 설정'),
          h3('Gemini API Key (필수)'),
          body('콘텐츠 분석, 생성, AI 이미지 생성에 사용됩니다.'),
          body('발급 방법:'),
          bullet('1. Google AI Studio (https://aistudio.google.com/apikey) 접속'),
          bullet('2. Google 계정으로 로그인'),
          bullet('3. "API 키 만들기" 또는 "Create API Key" 버튼 클릭'),
          bullet('4. 생성된 키를 복사하여 API Key 입력란에 붙여넣기'),
          spacer(),
          h3('키 저장 방식'),
          body('입력한 API 키는 브라우저 로컬 스토리지에 안전하게 저장되며, 서버로 전송되지 않습니다. 브라우저를 닫아도 키가 유지됩니다.'),
          spacer(),

          // 2. 콘텐츠 분석
          h2('2. 콘텐츠 분석'),
          body('기존 콘텐츠의 GEO/AIO 최적화 수준을 분석합니다. 상단 메뉴에서 "분석"을 클릭하여 접근합니다.'),
          spacer(),
          h3('입력 항목'),
          bullet('콘텐츠 입력 (필수): 분석할 콘텐츠를 텍스트 영역에 붙여넣기'),
          bullet('타겟 키워드 (선택): 최적화하려는 주요 검색 키워드'),
          bullet('URL (선택): 콘텐츠가 게시된 URL'),
          spacer(),
          h3('분석 결과 (5개 탭)'),
          bullet('종합 개요: 전체 GEO/AIO 점수와 주요 지표 대시보드'),
          bullet('AIO 분석: Google AI Overview 인용 가능성 분석 (구조화 답변, 신뢰성, 간결성)'),
          bullet('GEO 분석: 생성형 AI 엔진의 콘텐츠 이해도 분석 (의미적 명확성, 전문성)'),
          bullet('키워드 분석: 콘텐츠 내 키워드 분포, 밀도, 관련성 및 타겟 키워드 최적화 상태'),
          bullet('개선 제안: 우선순위별 구체적인 콘텐츠 개선 제안 및 액션 아이템'),
          spacer(),

          // 3. 콘텐츠 생성
          h2('3. 콘텐츠 생성'),
          body('AI가 GEO/AIO에 최적화된 콘텐츠를 자동으로 생성합니다. 3단계(사업 정보 → 콘텐츠 유형 → 생성)로 진행됩니다.'),
          spacer(),
          h3('Step 1: 사업 정보 입력'),
          body('사업 정보를 입력하면 맥락에 맞는 고품질 콘텐츠가 생성됩니다.'),
          bullet('회사 정보: 회사명, 소재지, 웹사이트 URL'),
          bullet('브랜드 정보: 브랜드명, 슬로건'),
          bullet('업종: IT/소프트웨어, 의료/헬스케어, 교육, 금융, 쇼핑몰, 부동산, 요식업, 뷰티/패션, 여행/관광, 제조업, 법률/회계, 기타'),
          bullet('제품/서비스: 주요 제품 및 서비스 설명'),
          bullet('타겟 고객: 주요 고객층 설명'),
          bullet('강점/차별점: 경쟁 우위 요소'),
          body('프로필 저장/불러오기: 입력한 사업 정보를 프로필로 저장하면 다음에 바로 불러올 수 있습니다. 여러 브랜드/사업 프로필 관리 가능.'),
          spacer(),
          h3('Step 2: 콘텐츠 유형 선택'),
          bullet('카테고리: 블로그, 제품 설명, FAQ, How-to 가이드, 랜딩 페이지, 기술 문서, SNS 포스트, 이메일'),
          bullet('타겟 키워드: SEO에 활용할 핵심 키워드 지정'),
          bullet('톤/스타일: 전문적, 친근한, 설득력 있는, 간결한, 스토리텔링 중 선택'),
          bullet('A/B 테스트 모드: 활성화하면 3가지 톤으로 동시 생성하여 비교 가능'),
          spacer(),
          h3('참조 자료 활용 (RAG 방식)'),
          body('추가 요구사항 입력란에 참조 자료를 입력하거나, 파일을 업로드하면 해당 정보를 기반으로 더 정확한 콘텐츠를 생성합니다.'),
          bullet('텍스트 입력: 통계, 사실관계, 연구 결과 등을 직접 입력'),
          bullet('파일 업로드: 최대 5개 파일, 각 20MB 이하 (드래그앤드롭 지원)'),
          bullet2('지원 형식: TXT, MD, CSV, JSON, HTML, PDF, DOCX, DOC, XLS, XLSX, PPT, PPTX, PNG, JPG, JPEG, WEBP'),
          spacer(),
          h3('생성 결과 페이지 기능'),
          bullet('콘텐츠 헤더: 생성된 제목, 글자 수, 예상 읽기 시간, 카테고리 뱃지'),
          bullet('SEO 최적화 팁: AI가 생성한 SEO 최적화 제안'),
          bullet('AI 이미지 생성: 버튼 클릭으로 3장의 AI 이미지 생성, 다운로드 또는 본문 삽입'),
          bullet('수정/재생성: 수정 요청을 입력하면 AI가 반영하여 콘텐츠 재생성'),
          spacer(),

          // 4. 키워드 경쟁 분석
          h2('4. 키워드 경쟁 분석'),
          body('타겟 키워드의 AI 검색 경쟁도를 분석하고, 차별화 전략을 수립합니다. 상단 메뉴에서 "키워드"를 클릭하여 접근합니다.'),
          spacer(),
          h3('입력 항목'),
          bullet('분석 키워드 (필수): 분석할 키워드 입력 (예: "AI 마케팅 전략")'),
          bullet('산업 분야 (선택): IT/테크, 교육, 의료/건강, 금융/보험, 부동산, 여행/관광, 법률/컨설팅, 마케팅/광고, 이커머스, 요식업, 기타'),
          body('사용 흐름: 키워드 입력 → 산업 분야 선택(선택) → "분석 시작" 클릭 → 7개 섹션으로 결과 표시'),
          spacer(),
          h3('분석 결과 상세 (7개 섹션)'),
          bullet('① 분석 개요: 키워드명, 검색 의도 분류, 경쟁 난이도(상/중/하) 3개 카드로 표시'),
          bullet('② AI 인용 요소: AI가 콘텐츠 인용 시 중요 요소와 중요도(높음/중간/낮음) 뱃지'),
          bullet('③ 필수 다룰 주제: 해당 키워드로 반드시 포함해야 할 핵심 주제 번호순 목록'),
          bullet('④ 차별화 전략: 전략명, 설명, "구현 방법" 항목으로 구체적 실행 방안 카드'),
          bullet('⑤ 콘텐츠 추천: 유형별(블로그, 영상, 인포그래픽 등) 맞춤 추천 사항'),
          bullet('⑥ 연관 키워드: 함께 활용하면 좋은 연관 키워드 뱃지'),
          bullet('⑦ 경쟁사 인사이트: "인사이트"(현황 분석)와 "실행 방안"(구체적 행동) 짝으로 제시'),
          spacer(),

          // 5. 시리즈 기획
          h2('5. 콘텐츠 시리즈 기획'),
          body('하나의 주제로 연관된 시리즈 콘텐츠 기획안을 자동으로 생성합니다. 상단 메뉴에서 "시리즈"를 클릭하여 접근합니다.'),
          spacer(),
          h3('입력 항목'),
          bullet('시리즈 주제 (필수): 시리즈의 전체 주제 (예: "초보자를 위한 SEO 가이드")'),
          bullet('산업 분야 (선택): IT/테크, 교육, 의료/건강 등 11개 분야'),
          bullet('에피소드 수: 슬라이더로 3~12편 조절 (기본 7편)'),
          bullet('추가 요청사항 (선택): 타겟 독자층, 특정 키워드, 스타일 등'),
          body('사용 흐름: 주제 입력 → 산업 분야 선택 → 에피소드 수 조절 → "시리즈 기획하기" 클릭'),
          spacer(),
          h3('기획 결과 상세'),
          bullet('시리즈 개요: 전체 제목, 설명, 타겟 독자 뱃지'),
          bullet('에피소드별 기획 카드 (접기/펼치기):'),
          bullet2('접힌 상태: 에피소드 번호, 제목, 부제목, 요약 미리보기(2줄)'),
          bullet2('펼친 상태: 요약, 타겟 키워드 뱃지, 주요 포인트, 내부 링크 제안, 예상 분량'),
          bullet2('"이 시리즈로 콘텐츠 생성" 버튼: 해당 에피소드 주제로 생성 페이지 이동'),
          bullet('링킹 전략: 에피소드 간 내부 링크 구조로 SEO 시너지 극대화'),
          bullet('발행 일정: 권장 발행 주기와 순서 제안'),
          bullet('기대 효과: 시리즈 완성 시 예상 SEO/마케팅 효과'),
          spacer(),

          // 6. A/B 버전 생성 & SNS 채널별 변환
          h2('6. A/B 버전 생성 & SNS 채널별 변환'),
          body('같은 주제로 3가지 톤의 콘텐츠를 동시 생성하고, SNS 채널에 최적화된 형식으로 자동 변환합니다.'),
          spacer(),
          h3('A/B 버전 생성'),
          body('콘텐츠 생성 시 "A/B 버전 생성" 토글을 켜면 전문적/친근한/설득적 3가지 톤으로 동시 생성됩니다.'),
          bullet('1. 콘텐츠 생성 페이지에서 주제, 카테고리 등 기본 정보 입력'),
          bullet('2. "A/B 버전 생성" 토글을 켜기'),
          bullet('3. 생성 버튼 클릭 → 전문적 / 친근한 / 설득적 3가지 톤으로 동시 생성'),
          bullet('4. 결과 페이지에서 탭을 클릭하여 각 버전 비교'),
          bullet('5. 가장 적합한 버전을 선택하여 활용'),
          spacer(),
          body('3가지 톤: 전문적(신뢰감 있고 권위적인 어조), 친근한(대화체의 편안한 어조), 설득적(강렬하고 행동을 유도하는 어조)'),
          spacer(),
          h3('SNS 채널별 변환'),
          body('생성된 콘텐츠를 각 SNS 채널에 최적화된 형식으로 자동 변환합니다.'),
          bullet('인스타그램: 후킹 문구 + 핵심 포인트 + 이모지 + 해시태그 10-15개'),
          bullet('링크드인: 전문적 인사이트 + 번호 정리 + 토론 유도 + 해시태그 3-5개'),
          bullet('네이버 블로그: SEO 최적화 제목 + 목차 + 키워드 반복 + 이미지 위치 표시'),
          bullet('카드뉴스: 6-8장 슬라이드 구성 + 표지/본문/마무리 형식'),
          bullet('핵심 요약: 3줄 요약 + 키워드 5개 + 주요 포인트 + 한 줄 결론'),
          spacer(),
          body('사용 방법: 콘텐츠 생성 후 결과 페이지 하단의 "SNS 채널별 변환" 섹션에서 원하는 채널 버튼 클릭 → AI 자동 변환 → 복사 버튼으로 클립보드에 복사'),
          spacer(),

          // 7. 대시보드 활용
          h2('7. 대시보드 활용하기'),
          body('대시보드에서는 분석 및 생성한 모든 콘텐츠의 이력을 관리하고, 다양한 방식으로 활용할 수 있습니다.'),
          spacer(),
          h3('이력 목록'),
          body('생성하거나 분석한 모든 콘텐츠가 날짜순으로 정리됩니다. 각 항목에는 제목, 날짜, 카테고리가 표시되며, "보기" 버튼으로 상세 페이지 이동.'),
          spacer(),
          h3('상세 페이지 - 복사 기능 (4종)'),
          bullet('블로그 붙여넣기용 복사: 서식 그대로 복사 (제목, 표, 리스트 유지)'),
          bullet('제목 복사: 콘텐츠 제목만 클립보드에 복사'),
          bullet('본문 복사: 본문 내용을 HTML 서식과 함께 복사'),
          bullet('이미지로 복사: 콘텐츠를 PNG 이미지로 캡처하여 클립보드에 복사'),
          spacer(),
          h3('본문 수정 기능'),
          body('"본문 수정" 버튼을 클릭하면 마크다운 편집 모드로 전환됩니다. 상단에 편집 도구 바가 고정됩니다.'),
          bullet('편집 도구: 굵게, 기울임, 취소선, H1~H3 제목, 불릿/번호 목록, 인용문, 표 삽입, 구분선'),
          bullet('찾기/바꾸기: 텍스트 검색 및 일괄 바꾸기 (하나씩 또는 모두 바꾸기)'),
          spacer(),
          h3('수정본 관리'),
          body('수정/재생성한 이력이 있으면 "원본"과 "수정 #1, #2..." 버튼으로 각 버전을 전환하여 확인할 수 있습니다.'),
          spacer(),
          h3('콘텐츠 통계 & 차트'),
          body('콘텐츠 생성/분석 현황을 차트와 통계로 한눈에 파악합니다. 대시보드 상단의 "콘텐츠 통계" 섹션을 클릭하여 펼치기/접기 가능합니다.'),
          bullet('총 콘텐츠: 생성 + 분석 전체 수'),
          bullet('생성 수: AI로 생성한 콘텐츠'),
          bullet('분석 수: AIO 분석한 콘텐츠'),
          bullet('평균 AIO 점수: 분석 콘텐츠 평균 점수'),
          bullet('월별 생성 추이: 바 차트로 월별 콘텐츠 생성 수 시각화'),
          bullet('카테고리 분포: 파이 차트로 블로그, SNS, 제품설명 등 카테고리별 비율'),
          spacer(),

          // 8. 점수 해석 가이드
          h2('8. 점수 해석 가이드'),
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

          // 9. 용어 설명
          h2('9. 용어 설명'),
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

          // 10. 콘텐츠 구조 재구성법
          colorH2('10. 콘텐츠 구조 재구성법', 'e11d48'),
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
          body('각 문단은 하나의 명확한 주제만 다룹니다. 2~4문장으로 간결하게 작성하고, AI가 특정 문단을 독립적으로 인용할 수 있게 합니다.'),
          spacer(),

          // 11. 키워드 최적화 방법
          colorH2('11. 키워드 최적화 방법', 'd97706'),
          body('올바른 키워드 전략은 AI 검색 노출의 핵심입니다. 단순한 키워드 반복이 아닌, 의미 중심의 최적화가 필요합니다.'),
          spacer(),

          h3('키워드 배치 핵심 위치'),
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
          body('예시: 핵심 키워드가 "콘텐츠 마케팅"인 경우 → 콘텐츠 전략, SEO 최적화, 블로그 마케팅, 타겟 오디언스, CTA, 전환율 등을 자연스럽게 포함'),
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

          // 12. E-E-A-T 강화법
          colorH2('12. E-E-A-T 강화법', '7c3aed'),
          body('E-E-A-T(경험, 전문성, 권위, 신뢰)는 AI가 콘텐츠를 인용할지 결정하는 핵심 기준입니다.'),
          spacer(),
          h3('Experience (경험)'),
          bullet('"직접 테스트해본 결과..." 등 1인칭 경험 서술'),
          bullet('실제 사례, 스크린샷, 결과 데이터 포함'),
          bullet('구체적인 시행착오와 교훈 공유'),
          spacer(),
          h3('Expertise (전문성)'),
          bullet('전문 용어를 정확하게 사용하고 쉽게 설명'),
          bullet('깊이 있는 분석과 독자적인 인사이트 제시'),
          bullet('저자 프로필, 자격/경력 소개 포함'),
          spacer(),
          h3('Authoritativeness (권위)'),
          bullet('공신력 있는 출처 인용 (학술 논문, 공공 데이터 등)'),
          bullet('업계 전문가 인터뷰, 의견 인용'),
          bullet('수상 경력, 미디어 소개 등 사회적 증거'),
          spacer(),
          h3('Trustworthiness (신뢰)'),
          bullet('통계와 수치에 출처 명시'),
          bullet('최신 정보로 정기적 업데이트'),
          bullet('팩트 체크 완료 표시, 검수 과정 언급'),
          bullet('투명한 저자 정보, 연락처, 정정 정책'),
          spacer(),

          // 13. FAQ 섹션 생성법
          colorH2('13. FAQ 섹션 생성법', '0891b2'),
          body('FAQ는 AI Overview에 직접 인용될 확률이 가장 높은 콘텐츠 형식입니다.'),
          spacer(),
          h3('FAQ 작성 원칙'),
          bullet('실제 사용자 질문 기반 - Google 자동완성, "People Also Ask" 활용'),
          bullet('답변은 2~4문장으로 간결하게'),
          bullet('질문에 키워드 포함'),
          bullet('5~10개의 FAQ가 적정'),
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

          // 14. AI 인용 최적화
          colorH2('14. AI 인용 최적화 (Citability)', 'db2777'),
          body('AI가 콘텐츠를 인용하기 쉽게 만드는 것이 GEO/AIO의 최종 목표입니다.'),
          spacer(),
          h3('인용되기 쉬운 문장 작성법'),
          bullet('정의문 포함: "[주제]란 [정의]를 말합니다" 형태'),
          bullet('수치와 통계 활용: 구체적인 숫자를 포함하면 AI가 팩트로 인용'),
          bullet('단계별 설명: "첫째... 둘째... 셋째..." 형태'),
          bullet('비교/대조 문장: "A는 ~인 반면, B는 ~입니다" 형태'),
          spacer(),

          // 15. Make.com 연동
          h2('15. Make.com 자동화 연동'),
          body('Make.com(구 Integromat)을 활용하여 콘텐츠 분석/생성을 자동화할 수 있습니다. Webhook API를 통해 외부 시스템과 연결합니다.'),
          spacer(),
          h3('연동 개요'),
          bullet('1. Make.com에서 시나리오(Scenario) 생성'),
          bullet('2. HTTP 모듈로 Webhook URL 설정: /api/webhook'),
          bullet('3. API Key를 헤더에 설정 (X-API-Key 또는 Authorization: Bearer)'),
          bullet('4. JSON Body에 action과 필요한 데이터 전달'),
          spacer(),
          h3('지원 기능'),
          bullet('generate: AI 콘텐츠 생성 - 주제, 카테고리, 톤 지정'),
          bullet('analyze: 콘텐츠 GEO/AIO 분석 - 텍스트와 키워드 전달'),
          spacer(),

          // 16. 요금제 안내
          h2('16. 요금제 안내'),
          new Table({
            width: { size: 9500, type: WidthType.DXA },
            rows: [
              planRow('기능', 'FREE', 'PRO', 'MAX'),
              planRow('콘텐츠 분석', '월 3회', '월 15회', '월 50회'),
              planRow('콘텐츠 생성', '월 3회', '월 15회', '월 50회'),
              planRow('키워드 분석', '월 3회', '월 15회', '월 50회'),
              planRow('시리즈 기획', '월 3회', '월 15회', '월 50회'),
              planRow('A/B 버전 생성', '미지원', '지원', '지원'),
              planRow('SNS 변환', '미지원', '지원', '지원'),
              planRow('AI 이미지 생성', '미지원', '지원', '지원'),
              planRow('Make.com 연동', '미지원', '미지원', '지원'),
            ],
          }),
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
                text: 'GEO-AIO - AI 검색엔진 콘텐츠 최적화 플랫폼 | Powered by Gemini AI',
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
  saveAs(blob, 'GEO-AIO-사용자매뉴얼.docx');
}
