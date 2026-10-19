import React from 'react';
import { Save, Edit3, Eye, LayoutDashboard, LogOut, Check, ShieldCheck, UserPlus } from 'lucide-react';
import { User } from '../firebase';

interface AdminEditBarProps {
  user: User;
  isInlineEditing: boolean;
  onToggleInlineEditing: () => void;
  onSaveAll: () => Promise<void>;
  onOpenDashboard: () => void;
  onOpenAddAdmin?: () => void;
  onLogout: () => void;
  isSaving: boolean;
  saveStatusMsg?: string;
  saveMessage?: string;
  primaryColor?: string;
}

export const AdminEditBar: React.FC<AdminEditBarProps> = ({
  user,
  isInlineEditing,
  onToggleInlineEditing,
  onSaveAll,
  onOpenDashboard,
  onOpenAddAdmin,
  onLogout,
  isSaving,
  saveStatusMsg,
  saveMessage,
  primaryColor,
}) => {
  const statusText = saveMessage || saveStatusMsg || '';

  return (
    <div className="sticky top-0 z-50 bg-slate-950 text-white border-b border-blue-500/40 shadow-xl px-4 sm:px-8 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>관리자 모드</span>
          </span>
          <span className="text-xs text-slate-300 font-mono hidden sm:inline">
            {user.email || 'Admin'}
          </span>
          {statusText && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{statusText}</span>
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onToggleInlineEditing}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isInlineEditing
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
          >
            {isInlineEditing ? (
              <>
                <Edit3 className="w-3.5 h-3.5" />
                <span>페이지 직접 편집 켜짐</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>미리보기 모드 (편집 켜기)</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenDashboard}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">통합 관리창 (로고·테마·견적)</span>
            <span className="md:hidden">통합 관리</span>
          </button>

          {onOpenAddAdmin && (
            <button
              type="button"
              onClick={onOpenAddAdmin}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition-all flex items-center gap-1.5"
              title="추가 관리자 계정 생성"
            >
              <UserPlus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">계정 추가</span>
            </button>
          )}

          <button
            type="button"
            onClick={onSaveAll}
            disabled={isSaving}
            className="px-4 py-1.5 rounded-xl text-xs font-extrabold text-white shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-60"
            style={{ backgroundColor: primaryColor || '#0062FF' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Firestore 저장 중...' : '저장하기'}</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700/50 text-slate-400 hover:text-rose-300 transition-all flex items-center gap-1"
            title="관리자 로그아웃"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">로그아웃</span>
          </button>
        </div>
      </div>
    </div>
  );
};

