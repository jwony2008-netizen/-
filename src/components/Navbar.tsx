import React, { useState } from 'react';
import { Phone, MessageCircle, CheckCircle2, Settings, Menu, X, Award } from 'lucide-react';
import { SiteConfig } from '../types';
import { IMAGES } from '../assets/images';

interface NavbarProps {
  config: SiteConfig;
  onOpenQuote: () => void;
  onOpenAdmin: () => void;
  isAdminOpen: boolean;
  unresolvedQuotesCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onOpenQuote,
  onOpenAdmin,
  isAdminOpen,
  unresolvedQuotesCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {/* Top micro contact bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-[11px] sm:text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Award className="w-3.5 h-3.5 text-blue-400" />
              전문 엔지니어 직영 시공 · 30일 안심 A/S 품질 보증
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300">
              운영시간: {config.operatingHours}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={`tel:${config.primaryPhone.replace(/-/g, '')}`} 
              className="text-white font-medium hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span>{config.primaryPhone}</span>
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={config.kakaoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1 transition-colors"
            >
              <MessageCircle className="w-3 h-3 fill-amber-300 text-amber-300" />
              <span>카카오톡 상담</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a href="#" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white shadow-md transition-transform group-hover:scale-105 border border-slate-100">
            <img src={config.logoUrl || IMAGES.logo} alt={config.brandName} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
              {config.brandName}
            </span>
            <span className="text-[10px] text-slate-500 tracking-wider font-semibold -mt-1 uppercase">
              Doge Clean System
            </span>
          </div>
        </a>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-8 text-[15px] font-semibold text-slate-600">
          <a href="#services" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            서비스 안내
          </a>
          <a href="#gallery" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            작업 갤러리
          </a>
          <a href="#process" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            시공 프로세스
          </a>
          <a href="#reviews" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            고객 후기
          </a>
          <a href="#faq" className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0">
            자주 묻는 질문
          </a>
        </nav>

        {/* Zone 3: 1 primary action + Admin dashboard switch */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Admin Mode Toggle Button */}
          <button
            onClick={onOpenAdmin}
            className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isAdminOpen
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900'
            }`}
            title="관리자 설정 모드"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">관리자 모드</span>
            {unresolvedQuotesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenQuote}
            className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md transition-all hover:brightness-110 active:scale-95 whitespace-nowrap shrink-0 flex items-center gap-2"
            style={{ backgroundColor: config.primaryColor }}
          >
            <span>간편 견적 문의</span>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="메뉴 열기"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl transition-all">
          <nav className="flex flex-col gap-4 text-base font-semibold text-slate-700">
            <a 
              href="#services" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-blue-600"
            >
              서비스 안내
            </a>
            <a 
              href="#gallery" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-blue-600"
            >
              작업 갤러리 (Before & After)
            </a>
            <a 
              href="#process" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-blue-600"
            >
              6단계 시공 프로세스
            </a>
            <a 
              href="#reviews" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-blue-600"
            >
              고객 후기 & 평점
            </a>
            <a 
              href="#faq" 
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 border-b border-slate-100 hover:text-blue-600"
            >
              자주 묻는 질문
            </a>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenQuote();
                }}
                className="w-full py-3 text-center text-sm font-bold text-white rounded-xl shadow"
                style={{ backgroundColor: config.primaryColor }}
              >
                실시간 온라인 무료 견적 신청
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 text-center text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                관리자 대시보드 편집
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
