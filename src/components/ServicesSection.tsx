import React, { useState } from 'react';
import { Clock, Check, ArrowRight, Wind, Snowflake, Shield, Sparkles } from 'lucide-react';
import { ServiceDetail, SiteConfig } from '../types';

interface ServicesSectionProps {
  services: ServiceDetail[];
  config: SiteConfig;
  onSelectService: (serviceTitle: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  config,
  onSelectService
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'aircon' | 'icemaker'>('all');

  const filteredServices = services.filter((s) => {
    if (activeTab === 'all') return true;
    return s.category === activeTab;
  });

  return (
    <section id="services" className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">
              <span>Precision Cleaning & Sanitization</span>
              <span aria-hidden="true">·</span>
              <span>체계적인 맞춤 케어</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              전문 서비스 안내 & 가격 가이드
            </h2>
            <p className="mt-3 text-base text-slate-600 max-w-2xl font-normal">
              단순 겉면 청소가 아닌 송풍팬과 냉각핀을 꼼꼼히 분해 세척하며, 제빙기는 130℃ 초고온 스팀으로 유해균을 근본적으로 제거합니다.
            </p>
          </div>

          {/* Filter Segmented Control */}
          <div className="flex items-center p-1 bg-white rounded-xl border border-slate-200/90 shadow-sm shrink-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              전체 보기 ({services.length})
            </button>
            <button
              onClick={() => setActiveTab('aircon')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'aircon'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              에어컨 정밀 세척
            </button>
            <button
              onClick={() => setActiveTab('icemaker')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                activeTab === 'icemaker'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              제빙기 고온스팀 살균
            </button>
          </div>
        </div>

        {/* Services Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-7 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Category icon and quiet unboxed tag */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                      {service.category === 'aircon' ? (
                        <Wind className="w-5 h-5" />
                      ) : (
                        <Snowflake className="w-5 h-5" />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {service.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                    {service.summary}
                  </p>

                  {/* Metadata Specs (Zero-pill text) */}
                  <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 mb-5 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">추천 대상</span>
                      <span className="font-semibold text-slate-800">{service.target}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">소요 시간</span>
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {service.duration}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">권장 주기</span>
                      <span className="font-semibold text-slate-800">{service.recommendedPeriod}</span>
                    </div>
                  </div>

                  {/* Key Features Bullet List */}
                  <div className="space-y-2 mb-6">
                    <span className="text-xs font-bold text-slate-700 block">시공 핵심 내용</span>
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Price & CTA */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-medium text-slate-400 block">예상 시공가</span>
                    <span className="text-lg font-extrabold text-slate-900 tracking-tight font-mono">
                      {service.priceStart}
                    </span>
                  </div>
                  <button
                    onClick={() => onSelectService(service.title)}
                    className="px-4 py-2.5 text-xs font-bold rounded-xl text-white shadow-sm hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <span>견적 예약</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate / Multi-unit Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold tracking-tight">
                프랜차이즈 본사 · 카페 체인 · 기업 사옥 대량 시공 견적
              </h4>
              <p className="text-sm text-slate-400 mt-1">
                현금영수증 발행 및 카드결제 가능, 야간/주말 비영업시간 분산 작업, 맞춤형 시공 결과보고서 제공
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <a
              href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
              className="flex-1 md:flex-initial px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs text-center transition-colors"
            >
              전화 직통 상담
            </a>
            <button
              onClick={() => onSelectService('기업/대량 시스템 에어컨 & 제빙기')}
              className="flex-1 md:flex-initial px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs text-center transition-colors shadow-md"
            >
              기업 전용 견적 요청
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
