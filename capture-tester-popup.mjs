import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: white; }
  .container { width: 480px; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.15); }
  .header { background: linear-gradient(to right, #fbbf24, #f97316, #ef4444); padding: 24px 28px; text-align: center; position: relative; }
  .logo { position: absolute; top: 12px; left: 12px; height: 32px; }
  .download-btn { position: absolute; top: 12px; right: 52px; width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
  .close-btn { position: absolute; top: 12px; right: 12px; width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .icon-circle { width: 56px; height: 56px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
  .header-content { display: flex; align-items: center; justify-content: center; gap: 12px; }
  .header h2 { font-size: 24px; font-weight: 800; color: white; }
  .header p { font-size: 14px; color: rgba(255,255,255,0.8); margin-top: 4px; }
  .qr-img { width: 72px; height: 72px; border-radius: 8px; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.15); background: white; padding: 4px; }
  .body { padding: 24px 28px; }
  .section { border-radius: 12px; padding: 16px; margin-bottom: 16px; }
  .section:last-child { margin-bottom: 0; }
  .amber-section { background: #fffbeb; border: 1px solid #fde68a; }
  .emerald-section { background: #ecfdf5; border: 1px solid #a7f3d0; }
  .blue-section { background: #eff6ff; border: 1px solid #bfdbfe; }
  .violet-section { background: #f5f3ff; border: 1px solid #ddd6fe; }
  .gray-section { background: #f9fafb; border: 1px solid #e5e7eb; }
  .section-title { font-size: 14px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; gap: 8px; }
  .num { width: 24px; height: 24px; border-radius: 50%; color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .amber-num { background: #f59e0b; }
  .emerald-num { background: #10b981; }
  .blue-num { background: #3b82f6; }
  .violet-num { background: #8b5cf6; }
  .amber-title { color: #92400e; }
  .emerald-title { color: #065f46; }
  .blue-title { color: #1e40af; }
  .violet-title { color: #5b21b6; }
  .content { font-size: 13px; color: #374151; line-height: 1.8; }
  .content p { margin-bottom: 4px; }
  .content strong { font-weight: 700; }
  .check-list { list-style: none; }
  .check-list li { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 6px; }
  .check { color: #10b981; font-weight: 700; margin-top: 2px; }
  .bullet { color: #8b5cf6; font-weight: 700; margin-top: 2px; }
  .note { font-size: 12px; color: #6b7280; line-height: 1.6; }
  .footer { padding: 16px 28px; border-top: 1px solid #f3f4f6; display: flex; gap: 12px; }
  .apply-btn { flex: 1; text-align: center; padding: 10px 16px; background: linear-gradient(to right, #f59e0b, #f97316); color: white; font-size: 14px; font-weight: 700; border-radius: 12px; text-decoration: none; }
  .close-text-btn { padding: 10px 16px; color: #6b7280; font-size: 14px; font-weight: 500; border-radius: 12px; border: 1px solid #e5e7eb; background: white; }
  ol { padding-left: 0; list-style-position: inside; }
  ol li { margin-bottom: 6px; font-size: 13px; color: #374151; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <img src="file://${__dirname.replace(/\\/g, '/')}/public/images/logo-geoaio.png" alt="GEO-AIO" class="logo" />
    <div class="download-btn">
      <svg width="20" height="20" fill="none" stroke="#f97316" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
    </div>
    <div class="close-btn">
      <svg width="20" height="20" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </div>
    <div class="icon-circle">
      <svg width="32" height="32" fill="none" stroke="white" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/></svg>
    </div>
    <div class="header-content">
      <div>
        <h2>테스터 모집 안내</h2>
        <p>GEO-AIO 베타 테스터를 모집합니다</p>
      </div>
      <img src="file://${__dirname.replace(/\\/g, '/')}/public/qr-tester.jpg" alt="QR" class="qr-img" />
    </div>
  </div>

  <div class="body">
    <div class="section amber-section">
      <div class="section-title amber-title"><span class="num amber-num">1</span> 모집 개요</div>
      <div class="content">
        <p><strong>모집 기간:</strong> 상시 모집</p>
        <p><strong>모집 인원:</strong> 선착순 제한 없음</p>
        <p><strong>테스트 기간:</strong> 가입일로부터 30일</p>
        <p><strong>대상:</strong> 블로거, 마케터, 콘텐츠 크리에이터, SEO 담당자 등</p>
      </div>
    </div>

    <div class="section emerald-section">
      <div class="section-title emerald-title"><span class="num emerald-num">2</span> 테스터 혜택</div>
      <ul class="check-list content">
        <li><span class="check">✓</span><span>30일간 <strong>Max 등급</strong> 기능 무료 사용</span></li>
        <li><span class="check">✓</span><span>콘텐츠 분석 <strong>월 50회</strong> 이용</span></li>
        <li><span class="check">✓</span><span>콘텐츠 생성 <strong>월 50회</strong> 이용</span></li>
        <li><span class="check">✓</span><span>키워드 분석 <strong>월 50회</strong> 이용</span></li>
        <li><span class="check">✓</span><span>시리즈 기획 <strong>월 50회</strong> 이용</span></li>
        <li><span class="check">✓</span><span>A/B 버전 생성, SNS 채널별 변환 등 모든 기능</span></li>
      </ul>
    </div>

    <div class="section blue-section">
      <div class="section-title blue-title"><span class="num blue-num">3</span> 참여 방법</div>
      <ol class="content">
        <li>무료 회원가입 후 로그인합니다</li>
        <li>아래 "테스터 신청하기" 버튼을 클릭하여 설문지를 작성합니다</li>
        <li>관리자 확인 후 테스터 등급이 부여됩니다</li>
        <li>30일간 맥스(Max) 등급 기능을 자유롭게 사용합니다</li>
      </ol>
    </div>

    <div class="section violet-section">
      <div class="section-title violet-title"><span class="num violet-num">4</span> 테스터 의무사항</div>
      <ul class="check-list content">
        <li><span class="bullet">•</span><span>테스트 기간 동안 주요 기능을 최소 1회 이상 사용</span></li>
        <li><span class="bullet">•</span><span>버그 발견 시 제보 (커뮤니티 게시판 또는 이메일)</span></li>
        <li><span class="bullet">•</span><span>테스트 종료 후 간단한 사용 후기 작성 (선택)</span></li>
      </ul>
    </div>

    <div class="section gray-section">
      <p class="note">※ 테스트 기간 종료 후 유료 전환 의무는 없습니다. 자동 결제되지 않으며, 무료 계정으로 전환됩니다. 기존에 생성/저장한 콘텐츠는 그대로 유지됩니다.</p>
    </div>
  </div>

  <div class="footer">
    <a href="#" class="apply-btn">테스터 신청하기</a>
    <button class="close-text-btn">닫기</button>
  </div>
</div>
</body>
</html>`;

async function main() {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 520, height: 1200, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const element = await page.$('.container');
  const outputPath = path.join(__dirname, '1 자료모음', 'GEO-AIO-테스터모집안내.png');
  await element.screenshot({ path: outputPath, type: 'png' });

  console.log('캡처 완료:', outputPath);
  await browser.close();
}

main().catch(console.error);
