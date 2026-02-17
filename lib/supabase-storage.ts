import { supabase as supabaseClient, isSupabaseConfigured } from './supabase';
import type { HistoryItem, RevisionItem, ContentCategory, GenerateResponse } from './types';

// isSupabaseConfigured()가 true일 때만 호출되므로 non-null assertion 안전
function getSupabase() {
  return supabaseClient!;
}

// ============================
// 프로필 CRUD
// ============================

export interface ProfileData {
  companyName: string;
  brandName: string;
  industry: string;
  customIndustry: string;
  mainProduct: string;
  productDescription: string;
  priceRange: string;
  mainBenefit: string;
  targetAudience: string;
  customerNeeds: string;
  strengths: string[];
  uniquePoint: string;
  location: string;
  website: string;
}

export interface Profile {
  id: string;
  name: string;
  data: ProfileData;
  savedAt: string;
}

export async function getProfiles(): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return getProfilesLocal();
  try {
    const { data, error } = await getSupabase()
      .from('business_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      name: row.name,
      data: row.data as ProfileData,
      savedAt: new Date(row.created_at).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\. /g, '-').replace('.', ''),
    }));
  } catch {
    return getProfilesLocal();
  }
}

export async function saveProfile(name: string, data: ProfileData): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveProfileLocal(name, data);
    return;
  }
  try {
    // upsert by name
    const { data: existing } = await getSupabase()
      .from('business_profiles')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (existing) {
      const { error } = await getSupabase()
        .from('business_profiles')
        .update({ data, created_at: new Date().toISOString() })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await getSupabase()
        .from('business_profiles')
        .insert({ name, data });
      if (error) throw error;
    }
  } catch {
    saveProfileLocal(name, data);
  }
}

export async function deleteProfile(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteProfileLocal(id);
    return;
  }
  try {
    const { error } = await getSupabase().from('business_profiles').delete().eq('id', id);
    if (error) throw error;
  } catch {
    deleteProfileLocal(id);
  }
}

// localStorage 폴백
function getProfilesLocal(): Profile[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('aio-business-profiles');
    if (!raw) return [];
    const arr = JSON.parse(raw) as { name: string; data: ProfileData; savedAt: string }[];
    return arr.map((p, i) => ({ id: String(i), name: p.name, data: p.data, savedAt: p.savedAt }));
  } catch {
    return [];
  }
}

function saveProfileLocal(name: string, data: ProfileData): void {
  if (typeof window === 'undefined') return;
  const profiles = getProfilesLocal();
  const existing = profiles.findIndex(p => p.name === name);
  const now = new Date();
  const savedAt = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
  const profile: Profile = { id: String(Date.now()), name, data, savedAt };
  if (existing >= 0) {
    profiles[existing] = profile;
  } else {
    profiles.unshift(profile);
    if (profiles.length > 10) profiles.length = 10;
  }
  localStorage.setItem('aio-business-profiles', JSON.stringify(profiles.map(p => ({ name: p.name, data: p.data, savedAt: p.savedAt }))));
}

function deleteProfileLocal(id: string): void {
  if (typeof window === 'undefined') return;
  const profiles = getProfilesLocal().filter(p => p.id !== id);
  localStorage.setItem('aio-business-profiles', JSON.stringify(profiles.map(p => ({ name: p.name, data: p.data, savedAt: p.savedAt }))));
}

// ============================
// 이력 CRUD
// ============================

export async function getHistoryItems(): Promise<HistoryItem[]> {
  if (!isSupabaseConfigured()) return getHistoryLocal();
  try {
    const { data, error } = await getSupabase()
      .from('history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    return (data || []).map(row => ({
      id: row.id,
      type: row.type,
      title: row.title,
      summary: row.summary || '',
      date: row.date,
      category: row.category || undefined,
      targetKeyword: row.target_keyword || undefined,
      analysisResult: row.analysis_result || undefined,
      originalContent: row.original_content || undefined,
      generateResult: row.generate_result || undefined,
      topic: row.topic || undefined,
      tone: row.tone || undefined,
      revisions: row.revisions || [],
    }));
  } catch {
    return getHistoryLocal();
  }
}

export async function saveHistoryItemSupabase(item: HistoryItem): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveHistoryLocal(item);
    return;
  }
  try {
    const { error } = await getSupabase().from('history').insert({
      id: item.id,
      type: item.type,
      title: item.title,
      summary: item.summary,
      date: item.date,
      category: item.category || null,
      target_keyword: item.targetKeyword || null,
      analysis_result: item.analysisResult || null,
      original_content: item.originalContent || null,
      generate_result: item.generateResult || null,
      topic: item.topic || null,
      tone: item.tone || null,
      revisions: item.revisions || [],
    });
    if (error) throw error;
  } catch {
    saveHistoryLocal(item);
  }
}

export async function deleteHistoryItemSupabase(id: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteHistoryLocal(id);
    return;
  }
  try {
    const { error } = await getSupabase().from('history').delete().eq('id', id);
    if (error) throw error;
  } catch {
    deleteHistoryLocal(id);
  }
}

export async function addRevisionSupabase(historyId: string, revision: RevisionItem): Promise<void> {
  if (!isSupabaseConfigured()) {
    addRevisionLocal(historyId, revision);
    return;
  }
  try {
    // 기존 revisions 가져오기
    const { data, error: fetchError } = await getSupabase()
      .from('history')
      .select('revisions')
      .eq('id', historyId)
      .single();
    if (fetchError) throw fetchError;

    const revisions = [...(data?.revisions || []), revision];
    const { error } = await getSupabase()
      .from('history')
      .update({ revisions })
      .eq('id', historyId);
    if (error) throw error;
  } catch {
    addRevisionLocal(historyId, revision);
  }
}

// localStorage 폴백
const HISTORY_KEY = 'aio-optimizer-history';

function getHistoryLocal(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveHistoryLocal(item: HistoryItem): void {
  if (typeof window === 'undefined') return;
  const history = getHistoryLocal();
  history.unshift(item);
  if (history.length > 100) history.length = 100;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function deleteHistoryLocal(id: string): void {
  if (typeof window === 'undefined') return;
  const history = getHistoryLocal().filter(h => h.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function addRevisionLocal(historyId: string, revision: RevisionItem): void {
  if (typeof window === 'undefined') return;
  const history = getHistoryLocal();
  const item = history.find(h => h.id === historyId);
  if (item) {
    if (!item.revisions) item.revisions = [];
    item.revisions.push(revision);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }
}

// ============================
// API 키 CRUD
// ============================

export async function getApiKey(keyType: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return getApiKeyLocal(keyType);
  try {
    const { data, error } = await getSupabase()
      .from('api_keys')
      .select('encrypted_key')
      .eq('key_type', keyType)
      .maybeSingle();
    if (error) throw error;
    return data?.encrypted_key || null;
  } catch {
    return getApiKeyLocal(keyType);
  }
}

export async function saveApiKey(keyType: string, key: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    saveApiKeyLocal(keyType, key);
    return;
  }
  try {
    const { data: existing } = await getSupabase()
      .from('api_keys')
      .select('id')
      .eq('key_type', keyType)
      .maybeSingle();

    if (existing) {
      const { error } = await getSupabase()
        .from('api_keys')
        .update({ encrypted_key: key })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await getSupabase()
        .from('api_keys')
        .insert({ key_type: keyType, encrypted_key: key });
      if (error) throw error;
    }
  } catch {
    saveApiKeyLocal(keyType, key);
  }
}

export async function deleteApiKey(keyType: string): Promise<void> {
  if (!isSupabaseConfigured()) {
    deleteApiKeyLocal(keyType);
    return;
  }
  try {
    const { error } = await getSupabase().from('api_keys').delete().eq('key_type', keyType);
    if (error) throw error;
  } catch {
    deleteApiKeyLocal(keyType);
  }
}

// localStorage 폴백
function getApiKeyLocal(keyType: string): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(`${keyType}-api-key`);
}

function saveApiKeyLocal(keyType: string, key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${keyType}-api-key`, key);
}

function deleteApiKeyLocal(keyType: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${keyType}-api-key`);
}

// ============================
// 생성 결과 저장/조회
// ============================

export interface GenerateResultData {
  result: GenerateResponse;
  category: ContentCategory;
  topic: string;
  targetKeyword: string;
  tone: string;
  historyId: string;
}

export async function saveGenerateResult(data: GenerateResultData): Promise<string> {
  const id = `gr_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  if (!isSupabaseConfigured()) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aio-generate-result', JSON.stringify({ id, ...data }));
    }
    return id;
  }
  try {
    const { error } = await getSupabase()
      .from('generate_results')
      .insert({ id, data });
    if (error) throw error;
    return id;
  } catch {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aio-generate-result', JSON.stringify({ id, ...data }));
    }
    return id;
  }
}

export async function getGenerateResult(id: string): Promise<GenerateResultData | null> {
  if (!isSupabaseConfigured()) {
    return getGenerateResultLocal();
  }
  try {
    const { data, error } = await getSupabase()
      .from('generate_results')
      .select('data')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data?.data as GenerateResultData || null;
  } catch {
    return getGenerateResultLocal();
  }
}

function getGenerateResultLocal(): GenerateResultData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('aio-generate-result');
    if (!raw) return null;
    return JSON.parse(raw) as GenerateResultData;
  } catch {
    return null;
  }
}

// ============================
// 이미지 업로드/조회
// ============================

export async function uploadImage(historyId: string, base64: string, prompt: string): Promise<string> {
  if (!isSupabaseConfigured()) return base64; // 폴백: base64 그대로 반환

  try {
    // base64 데이터에서 실제 바이너리 추출
    const matches = base64.match(/^data:(.+);base64,(.+)$/);
    if (!matches) return base64;

    const contentType = matches[1];
    const b64data = matches[2];
    const byteString = atob(b64data);
    const bytes = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      bytes[i] = byteString.charCodeAt(i);
    }

    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const fileName = `${historyId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await getSupabase().storage
      .from('generated-images')
      .upload(fileName, bytes, { contentType, upsert: true });
    if (uploadError) throw uploadError;

    const { data: urlData } = getSupabase().storage
      .from('generated-images')
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // DB에 메타데이터 저장
    await getSupabase().from('generated_images').insert({
      history_id: historyId,
      image_url: imageUrl,
      prompt,
    });

    return imageUrl;
  } catch {
    return base64; // 실패 시 base64 폴백
  }
}

export async function getImages(historyId: string): Promise<{ url: string; prompt: string }[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const { data, error } = await getSupabase()
      .from('generated_images')
      .select('image_url, prompt')
      .eq('history_id', historyId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return (data || []).map(row => ({ url: row.image_url, prompt: row.prompt || '' }));
  } catch {
    return [];
  }
}
