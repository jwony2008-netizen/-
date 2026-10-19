import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowRight, Zap, Award, UserCheck } from 'lucide-react';
import { SiteConfig } from '../types';
import { IMAGES } from '../assets/images';

interface HeroProps {
  config: SiteConfig;
  onOpenQuoteWithPrefill: (service: string, phone?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ config, onOpenQuoteWithPrefill }) => {
  const [selectedService, setSelectedService] = useState('에어컨 정밀 분해 세척');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenQuoteWithPrefill(selectedService, phoneNumber);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-slate-50/30 to-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Subtle background ambient blur */}
      <div 
        className="absolute top-0 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ backgroundColor: config.primaryColor }}
      />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-cyan-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Proposition & Copy */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Top Quiet Kicker (Zero-pill text separator) */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-4 tracking-wide uppercase">
              <span className="text-blue-600 font-bold">{config.brandName}</span>
              <span aria-hidden="true">·</span>
              <span>전문 엔지니어 직영 시공</span>
              <span aria-hidden="true">·</span>
              <span>전북 전 지역 (익산·전주·군산·완주 등) 신속 출동</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black tracking-tight text-slate-900 leading-[1.2] lg:leading-[1.15] text-balance mb-5">
              {config.heroTitle}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal mb-8 max-w-2xl text-pretty">
              {config.heroSubtitle}
            </p>

            {/* Quick Consultation & Quote Input Bar */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/90 mb-8 max-w-2xl">
              <div className="text-xs font-bold text-slate-700 mb-2 px-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-600" />
                  30초 간편 무료 견적 & 일정 실시간 상담
                </span>
                <span className="text-[11px] font-medium text-slate-400">상담 비용 0원</span>
              </div>
              <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="벽걸이 에어컨 정밀 분해 세척">벽걸이 에어컨 정밀 분해 세척</option>
                    <option value="스탠드 에어컨 정밀 분해 세척">스탠드 에어컨 정밀 분해 세척</option>
                    <option value="천장형 시스템 4Way/1Way">천장형 시스템 에어컨 4Way/1Way</option>
                    <option value="카페/업소용 제빙기 고온스팀 살균">카페/업소용 제빙기 고온스팀 살균</option>
                    <option value="에어컨+제빙기 매장 패키지">에어컨+제빙기 매장 패키지</option>
                  </select>
                </div>
                <div className="relative flex-1">
                  <input
                    type="tel"
                    placeholder="연락처 입력 (예: 010-1234-5678)"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 px-6 rounded-xl font-bold text-sm text-white shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap shrink-0"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <span>견적 조회</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

            {/* 4 Trust & Guarantee Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-200/60 max-w-2xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">송풍팬 분해 세척</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">전문 기술자 직영</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">친환경 인증 약품</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-semibold text-slate-700">30일 안심 A/S</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Hero Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group">
              <img
                src={IMAGES.hero}
                onError={(e) => { e.currentTarget.src = '/images/hero.jpg'; }}
                alt="도지클린시스템 전문 엔지니어의 에어컨 정밀 고압 제트 세척 현장"
                className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Subtle gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating verified technician badge */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white/40 shadow-lg text-slate-900 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 mb-0.5">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>도지클린 공식 검증 엔지니어</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    에어컨 고압 제트 세척 & 제빙기 130℃ 스팀
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500 block">살균 소독율</span>
                  <span className="text-base font-extrabold text-blue-600 tracking-tight font-mono tabular-nums">99.9%</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Claim-to-Proof Quantitative Strip */}
        <div className="mt-14 pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums block mb-1">
              14,800+
            </span>
            <span className="text-xs font-semibold text-slate-500">누적 시공 완료 (대)</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tabular-nums block mb-1">
              99.4%
            </span>
            <span className="text-xs font-semibold text-slate-500">고객 시공 만족도</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono tabular-nums block mb-1">
              100%
            </span>
            <span className="text-xs font-semibold text-slate-500">송풍팬·열교환기 정밀 분해</span>
          </div>
          <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
            <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono tabular-nums block mb-1">
              30일
            </span>
            <span className="text-xs font-semibold text-slate-500">무상 품질보증 A/S 보장</span>
          </div>
        </div>

      </div>
    </section>
  );
};
