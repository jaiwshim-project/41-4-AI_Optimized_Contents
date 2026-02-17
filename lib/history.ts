import type { HistoryItem, RevisionItem } from './types';
import {
  getHistoryItems,
  saveHistoryItemSupabase,
  deleteHistoryItemSupabase,
  addRevisionSupabase,
  updateHistoryContentSupabase,
} from './supabase-storage';

const HISTORY_KEY = 'aio-optimizer-history';

// 동기 localStorage 함수 (기존 호환용)
function getHistoryLocal(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// 동기 버전 (기존 코드 호환)
export function getHistory(): HistoryItem[] {
  return getHistoryLocal();
}

// 비동기 Supabase 버전
export async function getHistoryAsync(): Promise<HistoryItem[]> {
  return getHistoryItems();
}

export function saveHistoryItem(item: HistoryItem): void {
  // localStorage에 즉시 저장 (동기)
  const history = getHistoryLocal();
  history.unshift(item);
  if (history.length > 100) history.length = 100;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  // Supabase에도 비동기로 저장
  saveHistoryItemSupabase(item).catch(() => {});
}

export function addRevision(historyId: string, revision: RevisionItem): void {
  // localStorage에 즉시 저장 (동기)
  const history = getHistoryLocal();
  const item = history.find(h => h.id === historyId);
  if (item) {
    if (!item.revisions) item.revisions = [];
    item.revisions.push(revision);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  // Supabase에도 비동기로 저장
  addRevisionSupabase(historyId, revision).catch(() => {});
}

export async function updateHistoryContent(id: string, content: string): Promise<void> {
  // localStorage에 즉시 저장 (동기)
  const history = getHistoryLocal();
  const item = history.find(h => h.id === id);
  if (item) {
    if (item.type === 'generation' && item.generateResult) {
      item.generateResult.content = content;
    } else {
      item.originalContent = content;
    }
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
  // Supabase에도 비동기로 저장
  await updateHistoryContentSupabase(id, content).catch(() => {});
}

export function deleteHistoryItem(id: string): void {
  // localStorage에서 즉시 삭제 (동기)
  const history = getHistoryLocal().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  // Supabase에서도 비동기로 삭제
  deleteHistoryItemSupabase(id).catch(() => {});
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
