import React, { useState, useEffect } from 'react';
import { X, Shield, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import {
  auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from '../firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onLoginSuccess?: () => void;
  primaryColor?: string;
  isAuthenticated?: boolean;
  initialMode?: 'login' | 'register';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onLoginSuccess,
  primaryColor = '#0062FF',
  isAuthenticated = false,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Enforce login-only mode whenever user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setMode('login');
    } else {
      setMode(initialMode);
    }
    setErrorMsg('');
  }, [isAuthenticated, initialMode, isOpen]);

  if (!isOpen) return null;

  const translateFirebaseError = (err: unknown): string => {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return '이메일 또는 비밀번호가 올바르지 않습니다. 등록된 관리자 계정 정보를 확인해 주세요.';
    }
    if (code === 'auth/email-already-in-use') {
      return '이미 등록된 관리자 이메일입니다.';
    }
    if (code === 'auth/weak-password') {
      return '비밀번호는 6자리 이상으로 입력해 주세요.';
    }
    if (code === 'auth/invalid-email') {
      return '유효한 이메일 주소 형식을 입력해 주세요.';
    }
    if (code === 'auth/too-many-requests') {
      return '로그인 시도가 너무 많습니다. 잠시 후 다시 시도해 주세요.';
    }
    return err instanceof Error ? err.message : '인증 처리 중 오류가 발생했습니다.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'register') {
        if (!isAuthenticated || !auth.currentUser) {
          setErrorMsg('관리자 계정 신규 생성은 로그인된 관리자만 가능합니다.');
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      }
      setEmail('');
      setPassword('');
      onSuccess?.();
      onLoginSuccess?.();
      onClose();
    } catch (err) {
      setErrorMsg(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const isRegisterMode = isAuthenticated && mode === 'register';

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-inner">
          {isRegisterMode ? <UserPlus className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">
            {isRegisterMode ? '추가 관리자 계정 생성' : '관리자 로그인'}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            {isRegisterMode
              ? '현재 관리자 권한으로 새로운 관리자 이메일/비밀번호 계정을 추가 등록합니다.'
              : '등록된 관리자 이메일과 비밀번호로 로그인하면 페이지 내용을 실시간으로 수정하고 저장할 수 있습니다.'}
          </p>
        </div>

        {/* Mode Switcher ONLY visible if already logged in as an admin */}
        {isAuthenticated && (
          <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-5">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>다른 계정 로그인</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>신규 관리자 추가</span>
            </button>
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              관리자 이메일
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="admin@dogeclean.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                minLength={6}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 leading-relaxed">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-white rounded-xl font-bold text-sm shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50 mt-2"
            style={{ backgroundColor: primaryColor }}
          >
            {loading
              ? '인증 처리 중...'
              : isRegisterMode
              ? '새 관리자 계정 등록'
              : '관리자 로그인'}
          </button>
        </form>
      </div>
    </div>
  );
};

