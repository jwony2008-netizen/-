import React, { useState } from 'react';
import { X, Shield, Mail, Lock, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import {
  auth,
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from '../firebase';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  primaryColor?: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  primaryColor = '#0062FF',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const translateFirebaseError = (err: unknown): string => {
    const code = (err as { code?: string })?.code || '';
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return '이메일 또는 비밀번호가 올바르지 않거나 아직 등록되지 않은 계정입니다. 처음이시라면 아래 [관리자 계정 신규 생성] 탭에서 등록해 주세요.';
    }
    if (code === 'auth/email-already-in-use') {
      return '이미 등록된 이메일입니다. [이메일 로그인] 탭에서 로그인해 주세요.';
    }
    if (code === 'auth/weak-password') {
      return '비밀번호는 6자리 이상으로 입력해 주세요.';
    }
    if (code === 'auth/invalid-email') {
      return '유효한 이메일 주소 형식을 입력해 주세요.';
    }
    if (code === 'auth/operation-not-allowed') {
      return 'Firebase 콘솔(dogecleansys > Authentication > Sign-in method)에서 [이메일/비밀번호] 로그인 제공업체를 활성화해 주세요. 또는 아래 Google 로그인을 이용해 주세요.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return '로그인 팝업 창이 닫혔습니다. 다시 시도해 주세요.';
    }
    return err instanceof Error ? err.message : '로그인 중 오류가 발생했습니다.';
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      } else {
        await createUserWithEmailAndPassword(auth, email.trim(), password);
      }
      setEmail('');
      setPassword('');
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await signInWithPopup(auth, googleProvider);
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  };

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
          <Shield className="w-7 h-7" />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-xl font-extrabold text-slate-900 mb-1">
            Firebase 관리자 로그인
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            관리자로 로그인하면 홈페이지 안에서 안내 문구, 가격표, 연락처, 작업 사진을 바로 수정하고 Firestore에 실시간 저장할 수 있습니다.
          </p>
        </div>

        {/* Mode Switcher */}
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
            <span>이메일 로그인</span>
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
            <span>관리자 계정 신규 생성</span>
          </button>
        </div>

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
              비밀번호 (6자리 이상)
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
            className="w-full h-11 text-white rounded-xl font-bold text-sm shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
            style={{ backgroundColor: primaryColor }}
          >
            {loading
              ? '인증 처리 중...'
              : mode === 'login'
              ? '이메일/비밀번호로 로그인'
              : '관리자 계정 등록 및 로그인'}
          </button>
        </form>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-3 text-slate-400 font-semibold">또는 간편 인증</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-11 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Google 계정으로 관리자 로그인</span>
        </button>
      </div>
    </div>
  );
};
