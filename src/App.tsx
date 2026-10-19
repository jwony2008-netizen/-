/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  SiteConfig, 
  PortfolioItem, 
  QuoteRequest 
} from './types';
import { 
  initialSiteConfig, 
  initialPortfolio, 
  initialServices, 
  initialReviews, 
  initialQuotes 
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterGallery } from './components/BeforeAfterGallery';
import { ProcessSection } from './components/ProcessSection';
import { ReviewsSection } from './components/ReviewsSection';
import { QuoteModal } from './components/QuoteModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';

export default function App() {
  // 1. Persistent State initialized from LocalStorage (with schema migration)
  const [config, setConfig] = useState<SiteConfig>(() => {
    try {
      const saved = localStorage.getItem('doge_clean_config_v6');
      if (saved) return JSON.parse(saved);
      return initialSiteConfig;
    } catch {
      return initialSiteConfig;
    }
  });

  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() => {
    try {
      const saved = localStorage.getItem('doge_clean_portfolio_v6');
      if (saved) return JSON.parse(saved);
      return initialPortfolio;
    } catch {
      return initialPortfolio;
    }
  });

  const [quotes, setQuotes] = useState<QuoteRequest[]>(() => {
    try {
      const saved = localStorage.getItem('doge_clean_quotes_v6');
      if (saved) return JSON.parse(saved);
      return initialQuotes;
    } catch {
      return initialQuotes;
    }
  });

  // Modal States
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [prefillService, setPrefillService] = useState('');
  const [prefillPhone, setPrefillPhone] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sync to LocalStorage & Document Meta
  useEffect(() => {
    try {
      localStorage.setItem('doge_clean_config_v6', JSON.stringify(config));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    if (config.seoTitle) {
      document.title = config.seoTitle;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && config.seoDescription) {
      metaDesc.setAttribute('content', config.seoDescription);
    }
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('doge_clean_portfolio_v6', JSON.stringify(portfolio));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem('doge_clean_quotes_v6', JSON.stringify(quotes));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [quotes]);

  // Scroll listener for Top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handlers
  const handleOpenQuote = (service?: string, phone?: string) => {
    setPrefillService(service || '');
    setPrefillPhone(phone || '');
    setIsQuoteModalOpen(true);
  };

  const handleAddQuote = (newQuote: QuoteRequest) => {
    setQuotes((prev) => [newQuote, ...prev]);
  };

  const handleUpdateQuoteStatus = (id: string, status: QuoteRequest['status']) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status } : q))
    );
  };

  const handleDeleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const handleClearQuotes = () => {
    setQuotes([]);
  };

  const handleSaveConfig = (updatedConfig: SiteConfig) => {
    setConfig(updatedConfig);
  };

  const handleResetConfig = () => {
    setConfig(initialSiteConfig);
    setPortfolio(initialPortfolio);
    setQuotes(initialQuotes);
    localStorage.removeItem('doge_clean_config_v6');
    localStorage.removeItem('doge_clean_portfolio_v6');
    localStorage.removeItem('doge_clean_quotes_v6');
  };

  const handleAddPortfolio = (newItem: PortfolioItem) => {
    setPortfolio((prev) => [newItem, ...prev]);
  };

  const handleDeletePortfolio = (id: string) => {
    setPortfolio((prev) => prev.filter((item) => item.id !== id));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const unresolvedQuotesCount = quotes.filter((q) => q.status === '신규접수').length;

  return (
    <div className={`min-h-screen flex flex-col bg-white text-slate-900 ${config.fontMode === 'clean' ? 'font-sans' : ''}`}>
      
      {/* Navigation Header */}
      <Navbar
        config={config}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        isAdminOpen={isAdminModalOpen}
        unresolvedQuotesCount={unresolvedQuotesCount}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          config={config}
          onOpenQuoteWithPrefill={(service, phone) => handleOpenQuote(service, phone)}
        />

        {/* 2. Services & Pricing Bento Grid */}
        <ServicesSection
          services={initialServices}
          config={config}
          onSelectService={(serviceTitle) => handleOpenQuote(serviceTitle)}
        />

        {/* 3. Interactive Before & After Portfolio Gallery */}
        <BeforeAfterGallery
          portfolio={portfolio}
          config={config}
          onOpenQuote={(caseTitle) => handleOpenQuote(caseTitle)}
        />

        {/* 4. 6-Stage Systematic Construction Process */}
        <ProcessSection
          config={config}
          onOpenQuote={() => handleOpenQuote()}
        />

        {/* 5. Customer Reviews & FAQ */}
        <ReviewsSection
          reviews={initialReviews}
          config={config}
          onOpenQuote={() => handleOpenQuote()}
        />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onOpenQuote={() => handleOpenQuote()}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Floating Action Buttons (Sticky Quick Contacts & Top button) */}
      <aside aria-label="빠른 상담 및 맨 위로 이동" className="fixed bottom-6 right-6 z-30 flex flex-col items-end gap-3 pointer-events-none">
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

      {/* Powerful Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
        onResetConfig={handleResetConfig}
        portfolio={portfolio}
        onAddPortfolio={handleAddPortfolio}
        onDeletePortfolio={handleDeletePortfolio}
        quotes={quotes}
        onUpdateQuoteStatus={handleUpdateQuoteStatus}
        onDeleteQuote={handleDeleteQuote}
        onClearQuotes={handleClearQuotes}
      />

    </div>
  );
}
