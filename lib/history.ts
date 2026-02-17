import type { HistoryItem, RevisionItem } from './types';
import {
  getHistoryItems,
  saveHistoryItemSupabase,
  deleteHistoryItemSupabase,
  addRevisionSupabase,
  updateHistoryContentSupabase,
} from './supabase-storage';

// 비동기 Supabase 버전
export async function getHistoryAsync(): Promise<HistoryItem[]> {
  return getHistoryItems();
}

// 동기 버전 호환 (빈 배열 반환 - 비동기로 전환 권장)
export function getHistory(): HistoryItem[] {
  return [];
}

export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  await saveHistoryItemSupabase(item);
}

export async function addRevision(historyId: string, revision: RevisionItem): Promise<void> {
  await addRevisionSupabase(historyId, revision);
}

export async function updateHistoryContent(id: string, content: string): Promise<void> {
  await updateHistoryContentSupabase(id, content);
}

export async function deleteHistoryItem(id: string): Promise<void> {
  await deleteHistoryItemSupabase(id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
