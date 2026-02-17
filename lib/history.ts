import type { HistoryItem, RevisionItem } from './types';

const HISTORY_KEY = 'aio-optimizer-history';

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveHistoryItem(item: HistoryItem): void {
  const history = getHistory();
  history.unshift(item);
  // 최대 100개까지 보관
  if (history.length > 100) history.length = 100;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function addRevision(historyId: string, revision: RevisionItem): void {
  const history = getHistory();
  const item = history.find(h => h.id === historyId);
  if (item) {
    if (!item.revisions) item.revisions = [];
    item.revisions.push(revision);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

export function deleteHistoryItem(id: string): void {
  const history = getHistory().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
