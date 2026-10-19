import React from 'react';
import {
  Phone,
  MessageCircle,
  Carrot,
  Lock,
  LogOut,
  Edit3,
  Save,
  LayoutDashboard,
} from 'lucide-react';
import { SiteConfig } from '../types';
import { IMAGES } from '../assets/images';
import { User } from '../firebase';

interface FooterProps {
  config: SiteConfig;
  onOpenQuote: () => void;
  onOpenAdmin: () => void;
  adminUser?: User | null;
  onOpenAdminLogin?: () => void;
  onAdminLogout?: () => void;
  isAdminEditing?: boolean;
  onUpdateConfig?: (partial: Partial<SiteConfig>) => void;
  onSaveToFirestore?: () => void;
  isSaving?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onOpenQuote,
  onOpenAdmin,
  adminUser,
  onOpenAdminLogin,
  onAdminLogout,
  isAdminEditing = false,
  onUpdateConfig,
  onSaveToFirestore,
  isSaving = false,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-900">
      {/* Top CTA Row */}
      <div className="border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg font-bold text-white tracking-tight">
                {config.brandName}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-blue-400 font-semibold">
                에어컨 정밀세척 & 제빙기 살균 전문
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-xl">
              정규 자격을 갖춘 본사 직영 엔지니어가 에어컨 전용 고압 세척과 제빙기 130℃ 초고온 스팀으로 정직하고 꼼꼼하게 시공합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 sm:gap-3 w-full md:w-auto">
            <a
              href={`tel:${config.primaryPhone.replace(/-/g, '')}`}
              className="px-4 sm:px-5 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white font-bold text-xs hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 flex-1 sm:flex-initial whitespace-nowrap"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{config.primaryPhone} 전화문의</span>
            </a>
            <button
              onClick={onOpenQuote}
              className="px-4 sm:px-6 py-3 rounded-xl font-bold text-xs text-white shadow-md hover:brightness-110 active:scale-95 transition-all whitespace-nowrap flex-1 sm:flex-initial text-center"
              style={{ backgroundColor: config.primaryColor }}
            >
              실시간 온라인 견적 신청
            </button>
          </div>
        </div>
      </div>

      {/* Main Info Columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        {/* Inline Admin Contact/Business Info Editor */}
        {isAdminEditing && onUpdateConfig && (
          <div className="mb-10 bg-slate-900/90 border-2 border-amber-400/80 rounded-2xl p-5 text-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <Edit3 className="w-4 h-4" />
                <span>연락처 · 영업시간 · 사업자 정보 직접 수정</span>
              </div>
              {onSaveToFirestore && (
                <button
                  type="button"
                  onClick={onSaveToFirestore}
                  disabled={isSaving}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? '저장 중...' : '저장하기'}</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  상호명
                </label>
                <input
                  type="text"
                  value={config.brandName}
                  onChange={(e) => onUpdateConfig({ brandName: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  대표 전화번호
                </label>
                <input
                  type="text"
                  value={config.primaryPhone}
                  onChange={(e) => onUpdateConfig({ primaryPhone: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  보조/직통 번호
                </label>
                <input
                  type="text"
                  value={config.secondaryPhone}
                  onChange={(e) => onUpdateConfig({ secondaryPhone: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  운영시간 안내
                </label>
                <input
                  type="text"
                  value={config.operatingHours}
                  onChange={(e) => onUpdateConfig({ operatingHours: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  대표자명
                </label>
                <input
                  type="text"
                  value={config.ceoName}
                  onChange={(e) => onUpdateConfig({ ceoName: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  사업자등록번호
                </label>
                <input
                  type="text"
                  value={config.businessNumber}
                  onChange={(e) => onUpdateConfig({ businessNumber: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  사업장 주소
                </label>
                <input
                  type="text"
                  value={config.companyAddress}
                  onChange={(e) => onUpdateConfig({ companyAddress: e.target.value })}
                  className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand & Mission (5 Cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center bg-white shadow border border-slate-800">
                <img
                  src={config.logoUrl || IMAGES.logo}
                  alt={config.brandName}
                  className="w-full h-full object-cover"
                />
              </div>
              <span>{config.brandName}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              에어컨 정밀 분해 세척, 카페 및 업소용 제빙기 스케일링 고온 스팀 살균 전문 서비스. 최첨단 전문 장비와 친환경 인증 세제를 고집하여 안심할 수 있는 실내 공기와 깨끗한 얼음을 전해드립니다.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={config.kakaoUrl || 'http://pf.kakao.com/_xexbJxeG/friend'}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-2.5 rounded-lg bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 flex items-center gap-1.5 transition-all border border-amber-400/25 text-xs font-semibold"
                title="카카오톡 채널 상담"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>카카오톡</span>
              </a>
              <a
                href={config.naverBlogUrl || 'https://blog.naver.com/dogecare'}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-2.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 flex items-center gap-1.5 transition-all border border-emerald-500/25 text-xs font-semibold"
                title="네이버 공식 블로그"
              >
                <span className="w-3.5 h-3.5 rounded bg-emerald-500 text-slate-950 font-black text-[9px] flex items-center justify-center leading-none">
                  N
                </span>
                <span>블로그</span>
              </a>
              <a
                href={
                  config.daangnUrl ||
                  'https://daangn.com/kr/local-profile/도지홈케어-전북-1440766/?'
                }
                target="_blank"
                rel="noreferrer"
                className="h-8 px-2.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 text-orange-400 flex items-center gap-1.5 transition-all border border-orange-500/25 text-xs font-semibold"
                title="당근 비즈프로필"
              >
                <Carrot className="w-3.5 h-3.5 text-[#FF6F0F]" />
                <span>당근</span>
              </a>
            </div>
          </div>

          {/* Quick Nav (3 Cols) */}
          <div className="md:col-span-3 space-y-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
              주요 서비스 바로가기
            </span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  벽걸이 에어컨 정밀 분해 세척
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  스탠드 에어컨 고압 제트 세척
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  천장형 4Way / 1Way 시스템
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  카페 업소용 제빙기 130℃ 스팀 케어
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  에어컨 + 제빙기 패키지
                </a>
              </li>
            </ul>
          </div>

          {/* Business Details (4 Cols) */}
          <div className="md:col-span-4 space-y-2 text-xs">
            <span className="text-xs font-bold text-white uppercase tracking-wider block mb-3">
              비즈니스 정보
            </span>
            <div className="space-y-1 text-slate-400">
              <p>
                <span className="text-slate-500">상호명:</span> {config.brandName}
              </p>
              <p>
                <span className="text-slate-500">대표자:</span> {config.ceoName} ·{' '}
                <span className="text-slate-500">사업자번호:</span>{' '}
                {config.businessNumber}
              </p>
              <p>
                <span className="text-slate-500">사업장 주소:</span>{' '}
                {config.companyAddress}
              </p>
              <p>
                <span className="text-slate-500">대표전화:</span> {config.primaryPhone}{' '}
                {config.secondaryPhone ? `(직통 ${config.secondaryPhone})` : ''}
              </p>
              <p>
                <span className="text-slate-500">운영시간:</span> {config.operatingHours}
              </p>
              <p>
                <span className="text-slate-500">품질보증:</span> 시공 후 30일 안심 무상 A/S 보증서 발급
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Hairline & Legal Copyright + Small Admin Login Button */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 {config.brandName} (Doge Clean System). All rights reserved.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {adminUser ? (
              <>
                <button
                  onClick={onOpenAdmin}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  <span>통합 관리자 설정 ({adminUser.email})</span>
                </button>
                <span>·</span>
                {onAdminLogout && (
                  <button
                    onClick={onAdminLogout}
                    className="text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>로그아웃</span>
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={onOpenAdminLogin || onOpenAdmin}
                className="text-slate-500 hover:text-slate-300 flex items-center gap-1 transition-colors"
              >
                <Lock className="w-3 h-3" />
                <span>관리자 로그인</span>
              </button>
            )}
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
