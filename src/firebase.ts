import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { SiteConfig, PortfolioItem, ServiceDetail } from './types';

// Initialize Firebase SDK with provisioned configuration
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

// Sanitize ID to match ^[a-zA-Z0-9_\-]+$ and length 1..128
export function sanitizeDocId(rawId: string, prefix = 'item'): string {
  const cleaned = rawId.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  return cleaned.length > 0 ? cleaned : `${prefix}-${Date.now()}`;
}

function clampStr(val: string | undefined | null, maxLen: number, fallback = ''): string {
  const str = (val ?? fallback).trim();
  if (str.length === 0 && fallback.length > 0) {
    return fallback.slice(0, maxLen);
  }
  return str.slice(0, maxLen);
}

/**
 * Load site content, services, and portfolio items from Firestore.
 * Returns null if no data has been saved in Firestore yet (so caller uses fallback defaults).
 */
export async function loadSiteDataFromFirestore(): Promise<{
  config: Partial<SiteConfig>;
  services?: ServiceDetail[];
  portfolio?: PortfolioItem[];
} | null> {
  const mainPath = 'site_content/main';
  try {
    const mainSnap = await getDoc(doc(db, 'site_content', 'main'));
    if (!mainSnap.exists()) {
      return null;
    }

    const data = mainSnap.data();
    const config: Partial<SiteConfig> = {
      brandName: data.brandName,
      heroBadge: data.heroBadge,
      heroTitle: data.heroTitle,
      heroSubtitle: data.heroSubtitle,
      primaryPhone: data.primaryPhone,
      secondaryPhone: data.secondaryPhone,
      kakaoUrl: data.kakaoUrl,
      daangnUrl: data.daangnUrl,
      naverBlogUrl: data.naverBlogUrl,
      instagramUrl: data.instagramUrl,
      operatingHours: data.operatingHours,
      companyAddress: data.companyAddress,
      ceoName: data.ceoName,
      businessNumber: data.businessNumber,
      primaryColor: data.primaryColor,
      fontMode: data.fontMode,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      formspreeEndpoint: data.formspreeEndpoint,
      logoUrl: data.logoUrl,
    };

    const serviceIds: string[] = Array.isArray(data.serviceIds) ? data.serviceIds : [];
    const portfolioIds: string[] = Array.isArray(data.portfolioIds) ? data.portfolioIds : [];

    const [serviceSnaps, portfolioSnaps] = await Promise.all([
      Promise.all(
        serviceIds.map(async (sid) => {
          const sPath = `service_items/${sid}`;
          try {
            return await getDoc(doc(db, 'service_items', sid));
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, sPath);
          }
        })
      ),
      Promise.all(
        portfolioIds.map(async (pid) => {
          const pPath = `portfolio_items/${pid}`;
          try {
            return await getDoc(doc(db, 'portfolio_items', pid));
          } catch (err) {
            handleFirestoreError(err, OperationType.GET, pPath);
          }
        })
      ),
    ]);

    const services: ServiceDetail[] = [];
    for (const snap of serviceSnaps) {
      if (snap && snap.exists()) {
        const s = snap.data();
        services.push({
          id: s.id,
          title: s.title,
          category: s.category,
          tag: s.tag,
          target: s.target,
          duration: s.duration,
          priceStart: s.priceStart,
          summary: s.summary,
          features: Array.isArray(s.features) ? s.features : [],
          recommendedPeriod: s.recommendedPeriod,
        });
      }
    }

    const portfolio: PortfolioItem[] = [];
    for (const snap of portfolioSnaps) {
      if (snap && snap.exists()) {
        const p = snap.data();
        portfolio.push({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          beforeImage: p.beforeImage,
          afterImage: p.afterImage,
          description: p.description,
          highlights: Array.isArray(p.highlights) ? p.highlights : [],
          date: p.date,
        });
      }
    }

    return {
      config,
      services: services.length > 0 ? services : undefined,
      portfolio: portfolio.length > 0 ? portfolio : undefined,
    };
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, mainPath);
  }
}

/**
 * Subscribe to real-time updates on `site_content/main` in Firestore.
 */
export function subscribeToSiteData(
  onData: (data: {
    config: Partial<SiteConfig>;
    services?: ServiceDetail[];
    portfolio?: PortfolioItem[];
  }) => void
) {
  const mainRef = doc(db, 'site_content', 'main');
  return onSnapshot(
    mainRef,
    async (snap) => {
      if (!snap.exists()) return;
      try {
        const loaded = await loadSiteDataFromFirestore();
        if (loaded) {
          onData(loaded);
        }
      } catch (e) {
        console.warn('Realtime sync fetch warning:', e);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, 'site_content/main');
    }
  );
}

/**
 * Save site configuration, services (pricing), and portfolio items (with Base64 images) to Firestore.
 */
export async function saveAllSiteDataToFirestore(params: {
  config: SiteConfig;
  services: ServiceDetail[];
  portfolio: PortfolioItem[];
}): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('관리자 로그인이 필요합니다.');
  }

  const uid = user.uid;
  const { config, services, portfolio } = params;

  // 1. Save each service item document
  const validServices = services.slice(0, 30);
  const serviceIds: string[] = [];

  for (const s of validServices) {
    const sid = sanitizeDocId(s.id, 'srv');
    serviceIds.push(sid);
    const sRef = doc(db, 'service_items', sid);
    const sPath = `service_items/${sid}`;
    try {
      const existingSnap = await getDoc(sRef);
      const createdAtVal = existingSnap.exists()
        ? existingSnap.data().createdAt
        : serverTimestamp();

      const featuresList = (Array.isArray(s.features) && s.features.length > 0
        ? s.features
        : ['전문 엔지니어 정밀 세척']
      )
        .slice(0, 15)
        .map((f) => clampStr(f, 200, '전문 세척 시공'));

      await setDoc(sRef, {
        id: sid,
        title: clampStr(s.title, 150, '전문 세척 서비스'),
        category: s.category === 'icemaker' ? 'icemaker' : 'aircon',
        tag: clampStr(s.tag, 100, '기본 케어'),
        target: clampStr(s.target, 150, '가정 및 매장'),
        duration: clampStr(s.duration, 100, '약 1시간'),
        priceStart: clampStr(s.priceStart, 100, '상담 문의'),
        summary: clampStr(s.summary, 500, '꼼꼼한 분해 세척 서비스입니다.'),
        features: featuresList,
        recommendedPeriod: clampStr(s.recommendedPeriod, 100, '6개월~1년 주기'),
        updatedBy: uid,
        createdAt: createdAtVal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, sPath);
    }
  }

  // 2. Save each portfolio item document (with Base64 images <= 800px width)
  const validPortfolio = portfolio.slice(0, 50);
  const portfolioIds: string[] = [];
  const allowedCategories = [
    '에어컨 정밀세척',
    '업소용 제빙기',
    '시스템/기업',
    '가정용 토탈케어',
  ];

  for (const p of validPortfolio) {
    const pid = sanitizeDocId(p.id, 'case');
    portfolioIds.push(pid);
    const pRef = doc(db, 'portfolio_items', pid);
    const pPath = `portfolio_items/${pid}`;
    try {
      const existingSnap = await getDoc(pRef);
      const createdAtVal = existingSnap.exists()
        ? existingSnap.data().createdAt
        : serverTimestamp();

      const highlightsList = (Array.isArray(p.highlights) && p.highlights.length > 0
        ? p.highlights
        : ['분해 고압 세척 완료']
      )
        .slice(0, 15)
        .map((h) => clampStr(h, 200, '정밀 세척'));

      const cat = allowedCategories.includes(p.category)
        ? p.category
        : '에어컨 정밀세척';

      await setDoc(pRef, {
        id: pid,
        title: clampStr(p.title, 200, '시공 사례'),
        category: cat,
        location: clampStr(p.location, 150, '전북 전 지역'),
        beforeImage: clampStr(p.beforeImage, 450000, '/images/ac_detail.jpg'),
        afterImage: clampStr(p.afterImage, 450000, '/images/hero.jpg'),
        description: clampStr(p.description, 1000, '전문 엔지니어 정밀 시공 사례입니다.'),
        highlights: highlightsList,
        date: clampStr(p.date, 30, '2026.10'),
        updatedBy: uid,
        createdAt: createdAtVal,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, pPath);
    }
  }

  // 3. Save main site_content/main document
  const mainRef = doc(db, 'site_content', 'main');
  const mainPath = 'site_content/main';
  try {
    const existingMain = await getDoc(mainRef);
    const mainCreatedAt = existingMain.exists()
      ? existingMain.data().createdAt
      : serverTimestamp();

    const fontMode =
      config.fontMode === 'serif' || config.fontMode === 'clean'
        ? config.fontMode
        : 'pretendard';

    await setDoc(mainRef, {
      brandName: clampStr(config.brandName, 100, '도지클린시스템'),
      heroBadge: clampStr(config.heroBadge, 200, '전북 전 지역 출장 케어'),
      heroTitle: clampStr(config.heroTitle, 300, '보이지 않는 곳의 곰팡이와 세균까지 완벽 케어'),
      heroSubtitle: clampStr(
        config.heroSubtitle,
        1000,
        '에어컨 완전 분해 고압 세척 및 업소용 제빙기 130℃ 고온 스팀 살균 전문.'
      ),
      primaryPhone: clampStr(config.primaryPhone, 50, '010-9189-1496'),
      secondaryPhone: (config.secondaryPhone ?? '').trim().slice(0, 50),
      kakaoUrl: (config.kakaoUrl ?? '').trim().slice(0, 500),
      daangnUrl: (config.daangnUrl ?? '').trim().slice(0, 500),
      naverBlogUrl: (config.naverBlogUrl ?? '').trim().slice(0, 500),
      instagramUrl: (config.instagramUrl ?? '').trim().slice(0, 500),
      operatingHours: clampStr(config.operatingHours, 200, '연중무휴 08:00 - 22:00'),
      companyAddress: clampStr(config.companyAddress, 300, '전북특별자치도 익산시 인북로32길 25'),
      ceoName: clampStr(config.ceoName, 100, '정원영'),
      businessNumber: clampStr(config.businessNumber, 50, '688-13-01885'),
      primaryColor: clampStr(config.primaryColor, 20, '#0062FF'),
      fontMode,
      seoTitle: clampStr(config.seoTitle, 200, '도지클린시스템 | 에어컨·제빙기 전문 세척'),
      seoDescription: clampStr(
        config.seoDescription,
        500,
        '에어컨 정밀 분해 세척 및 제빙기 스팀 살균 전문 도지클린시스템'
      ),
      formspreeEndpoint: (config.formspreeEndpoint ?? '').trim().slice(0, 500),
      logoUrl: (config.logoUrl ?? '').trim().slice(0, 350000),
      serviceIds,
      portfolioIds,
      updatedBy: uid,
      createdAt: mainCreatedAt,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, mainPath);
  }
}

export async function removePortfolioDocFromFirestore(rawId: string): Promise<void> {
  if (!auth.currentUser) return;
  const pid = sanitizeDocId(rawId, 'case');
  try {
    const ref = doc(db, 'portfolio_items', pid);
    const snap = await getDoc(ref);
    if (snap.exists() && snap.data().updatedBy === auth.currentUser.uid) {
      await deleteDoc(ref);
    }
  } catch {
    // Non-fatal if doc was only in fallback or already removed from portfolioIds
  }
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
};
export type { User };
