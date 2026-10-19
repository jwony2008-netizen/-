import { SiteConfig, PortfolioItem, QuoteRequest, ServiceDetail } from '../types';

export interface PersistedAppState {
  config: SiteConfig;
  portfolio: PortfolioItem[];
  quotes: QuoteRequest[];
  services?: ServiceDetail[];
  updatedAt: number;
}

const IDB_NAME = 'doge_clean_storage_db';
const IDB_STORE = 'app_state';
const IDB_KEY = 'current';

const LS_CONFIG_KEY = 'doge_clean_config_v7';
const LS_PORTFOLIO_KEY = 'doge_clean_portfolio_v6';
const LS_QUOTES_KEY = 'doge_clean_quotes_v6';
const LS_SERVICES_KEY = 'doge_clean_services_v1';
const LS_UPDATED_AT_KEY = 'doge_clean_updated_at';

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(IDB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveToIndexedDB(state: PersistedAppState): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.put(state, IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch (e) {
    console.warn('IndexedDB save warning:', e);
  }
}

async function loadFromIndexedDB(): Promise<PersistedAppState | null> {
  try {
    const db = await openDatabase();
    return await new Promise<PersistedAppState | null>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const store = tx.objectStore(IDB_STORE);
      const req = store.get(IDB_KEY);
      req.onsuccess = () => {
        db.close();
        resolve(req.result || null);
      };
      req.onerror = () => {
        db.close();
        reject(req.error);
      };
    });
  } catch {
    return null;
  }
}

async function clearIndexedDB(): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      const store = tx.objectStore(IDB_STORE);
      store.delete(IDB_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    });
  } catch {
    // ignore
  }
}

export function loadFromLocalStorage(): Partial<PersistedAppState> {
  try {
    const configRaw = localStorage.getItem(LS_CONFIG_KEY) || localStorage.getItem('doge_clean_config_v6');
    const portfolioRaw = localStorage.getItem(LS_PORTFOLIO_KEY);
    const quotesRaw = localStorage.getItem(LS_QUOTES_KEY);
    const servicesRaw = localStorage.getItem(LS_SERVICES_KEY);
    const updatedAtRaw = localStorage.getItem(LS_UPDATED_AT_KEY);

    return {
      config: configRaw ? JSON.parse(configRaw) : undefined,
      portfolio: portfolioRaw ? JSON.parse(portfolioRaw) : undefined,
      quotes: quotesRaw ? JSON.parse(quotesRaw) : undefined,
      services: servicesRaw ? JSON.parse(servicesRaw) : undefined,
      updatedAt: updatedAtRaw ? Number(updatedAtRaw) : 0,
    };
  } catch {
    return {};
  }
}

export function saveToLocalStorage(state: PersistedAppState): void {
  try {
    localStorage.setItem(LS_CONFIG_KEY, JSON.stringify(state.config));
    localStorage.setItem(LS_PORTFOLIO_KEY, JSON.stringify(state.portfolio));
    localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(state.quotes));
    if (state.services) {
      localStorage.setItem(LS_SERVICES_KEY, JSON.stringify(state.services));
    }
    localStorage.setItem(LS_UPDATED_AT_KEY, String(state.updatedAt));
  } catch (e) {
    console.warn('LocalStorage quota exceeded, relying on Firestore and IndexedDB:', e);
  }
}

export async function saveAppState(state: {
  config: SiteConfig;
  portfolio: PortfolioItem[];
  quotes: QuoteRequest[];
  services?: ServiceDetail[];
}): Promise<void> {
  const payload: PersistedAppState = {
    ...state,
    updatedAt: Date.now(),
  };

  saveToLocalStorage(payload);
  await saveToIndexedDB(payload);

  try {
    await fetch('/api/state', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Server state sync optional when Firestore is primary
  }
}

export async function loadAppState(): Promise<PersistedAppState | null> {
  const candidates: PersistedAppState[] = [];

  // 1. Check Server API
  try {
    const res = await fetch('/api/state', { cache: 'no-store' });
    if (res.ok) {
      const serverData = await res.json();
      if (serverData && serverData.portfolio && serverData.config) {
        candidates.push({
          config: serverData.config,
          portfolio: serverData.portfolio,
          quotes: serverData.quotes || [],
          services: serverData.services,
          updatedAt: serverData.updatedAt || 1,
        });
      }
    }
  } catch {
    // Server endpoint might not be reachable in static hosting
  }

  // 2. Check Static /site-state.json in public folder
  try {
    const staticRes = await fetch('/site-state.json', { cache: 'no-store' });
    if (staticRes.ok) {
      const staticData = await staticRes.json();
      if (staticData && staticData.portfolio && staticData.config) {
        candidates.push({
          config: staticData.config,
          portfolio: staticData.portfolio,
          quotes: staticData.quotes || [],
          services: staticData.services,
          updatedAt: staticData.updatedAt || 1,
        });
      }
    }
  } catch {
    // ignore
  }

  // 3. Check IndexedDB
  const idbData = await loadFromIndexedDB();
  if (idbData && idbData.portfolio && idbData.config) {
    candidates.push(idbData);
  }

  // 4. Check LocalStorage
  const lsData = loadFromLocalStorage();
  if (lsData.config && lsData.portfolio) {
    candidates.push({
      config: lsData.config,
      portfolio: lsData.portfolio,
      quotes: lsData.quotes || [],
      services: lsData.services,
      updatedAt: lsData.updatedAt || 1,
    });
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  const best = candidates[0];

  saveToLocalStorage(best);
  await saveToIndexedDB(best);

  return best;
}

export async function clearAppState(): Promise<void> {
  try {
    localStorage.removeItem(LS_CONFIG_KEY);
    localStorage.removeItem('doge_clean_config_v6');
    localStorage.removeItem(LS_PORTFOLIO_KEY);
    localStorage.removeItem(LS_QUOTES_KEY);
    localStorage.removeItem(LS_SERVICES_KEY);
    localStorage.removeItem(LS_UPDATED_AT_KEY);
  } catch {
    // ignore
  }
  await clearIndexedDB();
  try {
    await fetch('/api/state', { method: 'DELETE' });
  } catch {
    // ignore
  }
}

/**
 * Automatically resizes an uploaded image in the browser to width <= 800px
 * and compresses it as WebP or JPEG Base64 data URL so it can be stored directly
 * inside Firestore documents without using Firebase Storage.
 */
export function compressImageFile(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number; preserveAlpha?: boolean } = {}
): Promise<string> {
  const {
    maxWidth = 800,
    maxHeight = 800,
    quality = 0.78,
    preserveAlpha = false,
  } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (!dataUrl) {
        reject(new Error('이미지 데이터가 비어 있습니다.'));
        return;
      }

      const img = new Image();
      img.onerror = () => resolve(dataUrl);
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(dataUrl);
          return;
        }

        if (!preserveAlpha) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first (supports both alpha and high compression), fallback to JPEG
        let compressed = canvas.toDataURL('image/webp', quality);
        if (!compressed.startsWith('data:image/webp')) {
          compressed = canvas.toDataURL(preserveAlpha ? 'image/png' : 'image/jpeg', quality);
        }

        // Ensure Base64 length stays safely below 400KB for Firestore document storage
        if (compressed.length > 380000) {
          compressed = canvas.toDataURL('image/jpeg', 0.62);
        }

        resolve(compressed);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  });
}
