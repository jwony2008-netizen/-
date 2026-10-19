import React from 'react';
import { Phone, MessageCircle, Instagram, Settings } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onOpenQuote: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onOpenQuote, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      {/* Top CTA Row */}
      <div className="border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-white tracking-tight">{config.brandName}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-blue-400 font-semibold">에어컨 정밀세척 & 제빙기 살균 전문</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              정규 자격을 갖춘 본사 직영 엔지니어가 에어컨 전용 고압 세척과 제빙기 130℃ 초고온 스팀으로 정직하고 꼼꼼하게 시공합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
              className="px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{config.primaryPhone} 전화문의</span>
            </a>
            <button
              onClick={onOpenQuote}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
              style={{ backgroundColor: config.primaryColor }}
            >
              실시간 온라인 견적 신청
            </button>
          </div>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Brand & Mission (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div 
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: config.primaryColor }}
              >
                D
              </div>
              <span>{config.brandName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              에어컨 정밀 분해 세척, 카페 및 업소용 제빙기 스케일링 고온 스팀 살균 전문 서비스. 최첨단 전문 장비와 친환경 인증 세제를 고집하여 안심할 수 있는 실내 공기와 깨끗한 얼음을 전해드립니다.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={config.kakaoUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 flex items-center justify-center transition-colors"
                title="카카오톡 채널"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
              </a>
              <a
                href={config.naverBlogUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors font-bold text-xs"
                title="네이버 블로그"
              >
                N
              </a>
              <a
                href={config.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 flex items-center justify-center transition-colors"
                title="인스타그램"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Nav (3 Cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
              주요 서비스 바로가기
            </span>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#services" className="hover:text-white transition-colors">벽걸이 에어컨 정밀 분해 세척</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">스탠드 에어컨 고압 제트 세척</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">천장형 4Way / 1Way 시스템</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">카페 업소용 제빙기 130℃ 스팀 케어</a></li>
              <li><a href="#services" className="hover:text-white transition-colors">에어컨 + 제빙기 패키지</a></li>
            </ul>
          </div>

          {/* Business Details (4 Cols) */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
              비즈니스 정보
            </span>
            <div className="space-y-1 text-slate-400">
              <p><span className="text-slate-500">상호명:</span> {config.brandName}</p>
              <p><span className="text-slate-500">대표자:</span> {config.ceoName} · <span className="text-slate-500">사업자번호:</span> {config.businessNumber}</p>
              <p><span className="text-slate-500">사업장 주소:</span> {config.companyAddress}</p>
              <p><span className="text-slate-500">대표전화:</span> {config.primaryPhone} (직통 {config.secondaryPhone})</p>
              <p><span className="text-slate-500">운영시간:</span> {config.operatingHours}</p>
              <p><span className="text-slate-500">품질보증:</span> 시공 후 30일 안심 무상 A/S 보증서 발급</p>
            </div>
          </div>

        </div>

        {/* Bottom Hairline & Legal Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 {config.brandName} (Doge Clean System). All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAdmin}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3 h-3" />
              <span>관리자 설정</span>
            </button>
            <span>·</span>
            <span>개인정보처리방침</span>
            <span>·</span>
            <span>이용약관</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
