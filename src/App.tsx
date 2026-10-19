/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  SiteConfig,
  PortfolioItem,
  QuoteRequest,
  ServiceDetail,
} from './types';
import {
  initialSiteConfig,
  initialPortfolio,
  initialServices,
  initialReviews,
  initialQuotes,
  initialUpdatedAt,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { ProcessSection } from './components/ProcessSection';
import { ReviewsSection } from './components/ReviewsSection';
import { QuoteModal } from './components/QuoteModal';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminEditBar } from './components/AdminEditBar';
import { Footer } from './components/Footer';
import { Phone, ArrowUp } from 'lucide-react';
import { loadAppState, saveAppState, clearAppState } from './utils/storage';
import {
  auth,
  onAuthStateChanged,
  signOut,
  User,
  loadSiteDataFromFirestore,
  subscribeToSiteData,
  saveAllSiteDataToFirestore,
  removePortfolioDocFromFirestore,
} from './firebase';

export default function App() {
  // 1. Default Fallback State (shown immediately and used when Firestore is empty)
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const lsUpdatedAt = Number(localStorage.getItem('doge_clean_updated_at') || '0');
      const saved = localStorage.getItem('doge_clean_config_v7');
      if (saved && lsUpdatedAt >= initialUpdatedAt) {
        return { ...initialSiteConfig, ...JSON.parse(saved) };
      }
      return initialSiteConfig;
    } catch {
      return initialSiteConfig;
    }
  });

  const [services, setServices] = useState<ServiceDetail[]>(() => {
    try {
      const saved = localStorage.getItem('doge_clean_services_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialServices;
    } catch {
      return initialServices;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const lsUpdatedAt = Number(localStorage.getItem('doge_clean_updated_at') || '0');
      const saved = localStorage.getItem('doge_clean_portfolio_v6');
      if (saved && lsUpdatedAt >= initialUpdatedAt) {
        return JSON.parse(saved);
      }
      return initialPortfolio;
    } catch {
      return initialPortfolio;
    }
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const lsUpdatedAt = Number(localStorage.getItem('doge_clean_updated_at') || '0');
      const saved = localStorage.getItem('doge_clean_quotes_v6');
      if (saved && lsUpdatedAt >= initialUpdatedAt) {
        return JSON.parse(saved);
      }
      return initialQuotes;
    } catch {
      return initialQuotes;
    }
  });

  // Firebase Auth & Real-time Admin Mode State
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isInlineEditing, setIsInlineEditing] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginModalMode, setLoginModalMode] = useState<'login' | 'register'>('login');
  const [isSavingFirestore, setIsSavingFirestore] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const isHydratedRef = useRef(false);
  const isEditingDirtyRef = useRef(false);

  const showSaveToast = (msg: string) => {
    setSaveMessage(msg);
    setTimeout(() => setSaveMessage(''), 4000);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAdminUser(user);
      if (user) {
        setIsInlineEditing(true);
      } else {
        setIsInlineEditing(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Load initial data from Firestore (with Fallback to existing default content if DB is empty)
  useEffect(() => {
    let mounted = true;

    async function hydrateAll() {
      // First load local/server fallback state
      try {
        const localLoaded = await loadAppState();
        if (mounted && localLoaded) {
          if (localLoaded.config) {
            setConfig((prev) => ({ ...prev, ...localLoaded.config }));
          }
          if (Array.isArray(localLoaded.services) && localLoaded.services.length > 0) {
            setServices(localLoaded.services);
          }
          if (Array.isArray(localLoaded.portfolio) && localLoaded.portfolio.length > 0) {
            setPortfolio(localLoaded.portfolio);
          }
          if (Array.isArray(localLoaded.quotes)) {
            setQuotes(localLoaded.quotes);
          }
        }
      } catch {
        // Ignore local fallback errors
      }

      // Next load latest data from Firestore (overrides fallback if Firestore has saved data)
      try {
        const firestoreData = await loadSiteDataFromFirestore();
        if (mounted && firestoreData) {
          setConfig((prev) => ({ ...prev, ...firestoreData.config }));
          if (firestoreData.services && firestoreData.services.length > 0) {
            setServices(firestoreData.services);
          }
          if (firestoreData.portfolio && firestoreData.portfolio.length > 0) {
            setPortfolio(firestoreData.portfolio);
          }
        }
      } catch (err) {
        console.warn('Firestore initial fetch fallback used:', err);
      } finally {
        if (mounted) {
          isHydratedRef.current = true;
        }
      }
    }

    hydrateAll();

    // Real-time Firestore listener so visitors see live updates immediately
    const unsubscribeSnapshot = subscribeToSiteData((liveData) => {
      if (!mounted || isEditingDirtyRef.current) return;
      setConfig((prev) => ({ ...prev, ...liveData.config }));
      if (liveData.services && liveData.services.length > 0) {
        setServices(liveData.services);
      }
      if (liveData.portfolio && liveData.portfolio.length > 0) {
        setPortfolio(liveData.portfolio);
      }
    });

    return () => {
      mounted = false;
      unsubscribeSnapshot();
    };
  }, []);

  // Modal States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [prefillService, setPrefillService] = useState('');
  const [prefillPhone, setPrefillPhone] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync Document Meta
  useEffect(() => {
    if (config.seoTitle) {
      document.title = config.seoTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.seoDescription) {
      metaDesc.setAttribute('content', config.seoDescription);
    }
  }, [config]);

  // Persist local mirror whenever state changes
  useEffect(() => {
    if (!isHydratedRef.current) return;
    saveAppState({ config, portfolio, quotes, services });
  }, [config, portfolio, quotes, services]);

  // Scroll listener for Top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save current state to Firestore
  const handleSaveAllToFirestore = async (overrideState?: {
    config?: SiteConfig;
    services?: ServiceDetail[];
    portfolio?: PortfolioItem[];
  }) => {
    const targetConfig = overrideState?.config || config;
    const targetServices = overrideState?.services || services;
    const targetPortfolio = overrideState?.portfolio || portfolio;

    saveAppState({
      config: targetConfig,
      portfolio: targetPortfolio,
      quotes,
      services: targetServices,
    });

    if (!auth.currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    setIsSavingFirestore(true);
    try {
      await saveAllSiteDataToFirestore({
        config: targetConfig,
        services: targetServices,
        portfolio: targetPortfolio,
      });
      isEditingDirtyRef.current = false;
      showSaveToast('Firestore 클라우드에 실시간 저장되었습니다!');
    } catch (err) {
      console.error('Firestore save error:', err);
      showSaveToast('저장 중 권한 또는 네트워크 오류가 발생했습니다.');
    } finally {
      setIsSavingFirestore(false);
    }
  };

  // Inline Config Partial Update
  const handleInlineUpdateConfig = (partial: Partial<SiteConfig>) => {
    isEditingDirtyRef.current = true;
    setConfig((prev) => ({ ...prev, ...partial }));
  };

  // Inline Services Update
  const handleAddService = (newService: ServiceDetail) => {
    isEditingDirtyRef.current = true;
    setServices((prev) => {
      const next = [...prev, newService];
      if (auth.currentUser) {
        handleSaveAllToFirestore({ services: next });
      }
      return next;
    });
  };

  const handleUpdateService = (updatedService: ServiceDetail) => {
    isEditingDirtyRef.current = true;
    setServices((prev) => {
      const next = prev.map((s) => (s.id === updatedService.id ? updatedService : s));
      if (auth.currentUser) {
        handleSaveAllToFirestore({ services: next });
      }
      return next;
    });
  };

  const handleDeleteService = (id: string) => {
    isEditingDirtyRef.current = true;
    setServices((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (auth.currentUser) {
        handleSaveAllToFirestore({ services: next });
      }
      return next;
    });
  };

  // Quote Handlers
  const handleOpenQuote = (service?: string, phone?: string) => {
    setPrefillService(service || '');
    setPrefillPhone(phone || '');
    setIsQuoteModalOpen(true);
  };

  const handleAddQuote = (newQuote: QuoteRequest) => {
    setQuotes((prev) => {
      const next = [newQuote, ...prev];
      saveAppState({ config, portfolio, quotes: next, services });
      return next;
    });
  };

  const handleUpdateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes((prev) => {
      const next = prev.map((q) => (q.id === id ? { ...q, status } : q));
      saveAppState({ config, portfolio, quotes: next, services });
      return next;
    });
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes((prev) => {
      const next = prev.filter((q) => q.id !== id);
      saveAppState({ config, portfolio, quotes: next, services });
      return next;
    });
  };

  const handleClearQuotes = () => {
    setQuotes([]);
    saveAppState({ config, portfolio, quotes: [], services });
  };

  // AdminModal & Inline Portfolio Handlers (auto-sync with Firestore when logged in)
  const handleSaveConfig = (updatedConfig: SiteConfig) => {
    setConfig(updatedConfig);
    if (auth.currentUser) {
      handleSaveAllToFirestore({ config: updatedConfig });
    } else {
      saveAppState({ config: updatedConfig, portfolio, quotes, services });
    }
  };

  const handleResetConfig = () => {
    setConfig(initialSiteConfig);
    setServices(initialServices);
    setPortfolio(initialPortfolio);
    setQuotes(initialQuotes);
    clearAppState();
    if (auth.currentUser) {
      handleSaveAllToFirestore({
        config: initialSiteConfig,
        services: initialServices,
        portfolio: initialPortfolio,
      });
    }
  };

  const handleAddPortfolio = (newItem: PortfolioItem) => {
    isEditingDirtyRef.current = true;
    setPortfolio((prev) => {
      const next = [newItem, ...prev];
      if (auth.currentUser) {
        handleSaveAllToFirestore({ portfolio: next });
      } else {
        saveAppState({ config, portfolio: next, quotes, services });
      }
      return next;
    });
  };

  const handleUpdatePortfolio = (updatedItem: PortfolioItem) => {
    isEditingDirtyRef.current = true;
    setPortfolio((prev) => {
      const next = prev.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      if (auth.currentUser) {
        handleSaveAllToFirestore({ portfolio: next });
      } else {
        saveAppState({ config, portfolio: next, quotes, services });
      }
      return next;
    });
  };

  const handleDeletePortfolio = (id: string) => {
    isEditingDirtyRef.current = true;
    setPortfolio((prev) => {
      const next = prev.filter((item) => item.id !== id);
      if (auth.currentUser) {
        removePortfolioDocFromFirestore(id);
        handleSaveAllToFirestore({ portfolio: next });
      } else {
        saveAppState({ config, portfolio: next, quotes, services });
      }
      return next;
    });
  };

  const handleAdminLogout = async () => {
    await signOut(auth);
    setAdminUser(null);
    setIsInlineEditing(false);
    showSaveToast('관리자 로그아웃 되었습니다.');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unresolvedQuotesCount = quotes.filter((q) => q.status === '신규접수').length;
  const activeAdminInlineEditing = Boolean(adminUser && isInlineEditing);

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden flex flex-col bg-white text-slate-900 ${
        config.fontMode === 'clean' ? 'font-sans' : ''
      }`}
    >
      {/* Top Sticky Admin Editing Toolbar (Visible when logged in via Firebase Auth) */}
      {adminUser && (
        <AdminEditBar
          user={adminUser}
          isInlineEditing={isInlineEditing}
          onToggleInlineEditing={() => setIsInlineEditing((prev) => !prev)}
          onSaveAll={() => handleSaveAllToFirestore()}
          isSaving={isSavingFirestore}
          saveMessage={saveMessage}
          primaryColor={config.primaryColor}
          onOpenDashboard={() => setIsAdminModalOpen(true)}
          onOpenAddAdmin={() => {
            setLoginModalMode('register');
            setIsLoginModalOpen(true);
          }}
          onLogout={handleAdminLogout}
        />
      )}

      {/* Navigation Header */}
      <Navbar
        config={config}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => {
          if (adminUser) {
            setIsAdminModalOpen(true);
          } else {
            setIsLoginModalOpen(true);
          }
        }}
        isAdminOpen={isAdminModalOpen}
        unresolvedQuotesCount={unresolvedQuotesCount}
      />

      {/* Main Content Sections */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* 1. Hero Section (with inline admin editing) */}
        <Hero
          config={config}
          onOpenQuoteWithPrefill={(service, phone) => handleOpenQuote(service, phone)}
          isAdminEditing={activeAdminInlineEditing}
          onUpdateConfig={handleInlineUpdateConfig}
          onSaveToFirestore={() => handleSaveAllToFirestore()}
          isSaving={isSavingFirestore}
        />

        {/* 2. Services & Pricing Bento Grid (with inline price card add/edit/delete) */}
        <ServicesSection
          services={services}
          config={config}
          onSelectService={(serviceTitle) => handleOpenQuote(serviceTitle)}
          isAdminEditing={activeAdminInlineEditing}
          onAddService={handleAddService}
          onUpdateService={handleUpdateService}
          onDeleteService={handleDeleteService}
          onSaveToFirestore={() => handleSaveAllToFirestore()}
          isSaving={isSavingFirestore}
        />

        {/* 3. Interactive Before & After Portfolio Gallery (with inline photo upload <=800px Base64) */}
        <BeforeAfterGallery
          portfolio={portfolio}
          config={config}
          onOpenQuote={(caseTitle) => handleOpenQuote(caseTitle)}
          isAdminEditing={activeAdminInlineEditing}
          onAddPortfolio={handleAddPortfolio}
          onUpdatePortfolio={handleUpdatePortfolio}
          onDeletePortfolio={handleDeletePortfolio}
          onSaveToFirestore={() => handleSaveAllToFirestore()}
          isSaving={isSavingFirestore}
        />

        {/* 4. 6-Stage Systematic Construction Process */}
        <ProcessSection config={config} onOpenQuote={() => handleOpenQuote()} />

        {/* 5. Customer Reviews & FAQ */}
        <ReviewsSection
          reviews={initialReviews}
          config={config}
          onOpenQuote={() => handleOpenQuote()}
        />
      </main>

      {/* Footer (with small '관리자 로그인' button at the bottom and inline contact editor) */}
      <Footer
        config={config}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        adminUser={adminUser}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onAdminLogout={handleAdminLogout}
        isAdminEditing={activeAdminInlineEditing}
        onUpdateConfig={handleInlineUpdateConfig}
        onSaveToFirestore={() => handleSaveAllToFirestore()}
        isSaving={isSavingFirestore}
      />

      {/* Floating Action Buttons (Sticky Quick Contacts & Top button) */}
      <aside
        aria-label="빠른 상담 및 맨 위로 이동"
        className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none"
      >
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all pointer-events-auto"
            aria-label="맨 위로 이동"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Quick Call */}
          <a
            href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
            className="hidden sm:flex items-center gap-2 px-4 py-3 bg-white text-slate-900 border border-slate-200 shadow-xl rounded-2xl hover:bg-slate-50 transition-all font-bold text-xs"
          >
            <Phone className="w-4 h-4 text-blue-600" />
            <span>{config.primaryPhone}</span>
          </a>

          {/* Quick Quote Pill */}
          <button
            onClick={() => handleOpenQuote()}
            className="px-5 py-3.5 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
            style={{ backgroundColor: config.primaryColor }}
          >
            <span>실시간 견적 문의</span>
          </button>
        </div>
      </aside>

      {/* Interactive Online Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        config={config}
        prefillService={prefillService}
        prefillPhone={prefillPhone}
        onAddQuote={handleAddQuote}
      />

      {/* Firebase Auth Email/Password Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setLoginModalMode('login');
        }}
        isAuthenticated={Boolean(adminUser)}
        initialMode={loginModalMode}
        primaryColor={config.primaryColor}
        onLoginSuccess={() => {
          setIsInlineEditing(true);
          showSaveToast('관리자 모드로 로그인되었습니다. 페이지에서 바로 수정 후 저장하세요!');
        }}
      />

      {/* Full Admin Dashboard Modal (Logo/Theme, SEO, Quotes, Portfolio) */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetConfig={handleResetConfig}
        portfolio={portfolio}
        onAddPortfolio={handleAddPortfolio}
        onUpdatePortfolio={handleUpdatePortfolio}
        onDeletePortfolio={handleDeletePortfolio}
        quotes={quotes}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onDeleteQuote={handleDeleteQuote}
        onClearQuotes={handleClearQuotes}
        isFirebaseAuthenticated={Boolean(adminUser)}
        onOpenFirebaseLogin={() => setIsLoginModalOpen(true)}
      />
    </div>
  );
}
