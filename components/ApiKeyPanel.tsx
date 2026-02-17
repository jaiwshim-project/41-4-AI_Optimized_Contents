'use client';

import { useState, useEffect } from 'react';

interface ApiKeyPanelProps {
  visible: boolean;
}

export default function ApiKeyPanel({ visible }: ApiKeyPanelProps) {
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [geminiKeyInput, setGeminiKeyInput] = useState('');
  const [isSavingKey, setIsSavingKey] = useState(false);
  const [isSavingGemini, setIsSavingGemini] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'none' | 'saved' | 'error'>('none');
  const [geminiKeyStatus, setGeminiKeyStatus] = useState<'none' | 'saved' | 'error'>('none');
  const [apiKeyMessage, setApiKeyMessage] = useState('');
  const [geminiKeyMessage, setGeminiKeyMessage] = useState('');
  const [hasAnthropicKey, setHasAnthropicKey] = useState(false);
  const [hasGeminiKey, setHasGeminiKey] = useState(false);

  useEffect(() => {
    fetch('/api/set-api-key')
      .then(res => res.json())
      .then(data => {
        setHasAnthropicKey(data.hasKey);
        setHasGeminiKey(data.hasGeminiKey);
      })
      .catch(() => {});
  }, []);

  const handleSaveAnthropicKey = async () => {
    if (!apiKeyInput.trim()) return;
    setIsSavingKey(true);
    setApiKeyStatus('none');
    try {
      const res = await fetch('/api/set-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKeyInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setApiKeyStatus('saved');
      setApiKeyMessage('Anthropic API Key가 저장되었습니다!');
      setApiKeyInput('');
      setHasAnthropicKey(true);
    } catch (err) {
      setApiKeyStatus('error');
      setApiKeyMessage(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSavingKey(false);
    }
  };

  const handleSaveGeminiKey = async () => {
    if (!geminiKeyInput.trim()) return;
    setIsSavingGemini(true);
    setGeminiKeyStatus('none');
    try {
      const res = await fetch('/api/set-api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geminiApiKey: geminiKeyInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setGeminiKeyStatus('saved');
      setGeminiKeyMessage('Gemini API Key가 저장되었습니다!');
      setGeminiKeyInput('');
      setHasGeminiKey(true);
    } catch (err) {
      setGeminiKeyStatus('error');
      setGeminiKeyMessage(err instanceof Error ? err.message : '저장에 실패했습니다.');
    } finally {
      setIsSavingGemini(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="border-b border-gray-200">
      {/* Anthropic API Key 섹션 */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="font-semibold text-amber-800">Anthropic API Key 설정</h3>
            {hasAnthropicKey && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                설정됨
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder="sk-ant-... 키를 입력하세요"
              className="flex-1 px-4 py-2.5 border-2 border-amber-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveAnthropicKey()}
            />
            <button
              onClick={handleSaveAnthropicKey}
              disabled={isSavingKey || !apiKeyInput.trim()}
              className="px-5 py-2.5 bg-amber-500 text-white text-sm font-medium rounded-xl hover:bg-amber-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border-2 border-amber-300"
            >
              {isSavingKey ? '저장 중...' : '저장'}
            </button>
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border-2 border-amber-300 text-amber-700 text-sm font-medium rounded-xl hover:bg-amber-100 transition-all whitespace-nowrap inline-flex items-center gap-1.5"
            >
              키 발급
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          {apiKeyStatus !== 'none' && (
            <p className={`text-sm mt-2 ${apiKeyStatus === 'saved' ? 'text-emerald-600' : 'text-red-600'}`}>
              {apiKeyMessage}
            </p>
          )}
        </div>
      </div>

      {/* Gemini API Key 섹션 */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
            <h3 className="font-semibold text-green-800">Gemini API Key 설정</h3>
            {hasGeminiKey && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                설정됨
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              value={geminiKeyInput}
              onChange={(e) => setGeminiKeyInput(e.target.value)}
              placeholder="AIza... Gemini API 키를 입력하세요"
              className="flex-1 px-4 py-2.5 border-2 border-green-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-400"
              onKeyDown={(e) => e.key === 'Enter' && handleSaveGeminiKey()}
            />
            <button
              onClick={handleSaveGeminiKey}
              disabled={isSavingGemini || !geminiKeyInput.trim()}
              className="px-5 py-2.5 bg-green-600 text-white text-sm font-medium rounded-xl hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap border-2 border-green-300"
            >
              {isSavingGemini ? '저장 중...' : '저장'}
            </button>
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-white border-2 border-green-300 text-green-700 text-sm font-medium rounded-xl hover:bg-green-100 transition-all whitespace-nowrap inline-flex items-center gap-1.5"
            >
              🍌 Nano Banana 키 발급
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
          {geminiKeyStatus !== 'none' && (
            <p className={`text-sm mt-2 ${geminiKeyStatus === 'saved' ? 'text-emerald-600' : 'text-red-600'}`}>
              {geminiKeyMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
