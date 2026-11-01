import React, { useState } from 'react';
import { Sparkles, Heart, Coffee, BookOpen } from 'lucide-react';
import { signInWithGoogle } from '../firebase';
import { CatPawWatermark } from './CatPawWatermark';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setErrorMsg('Sign-in popup was closed. Please try again.');
      } else {
        setErrorMsg(err.message || 'Failed to sign in with Google. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0E6] flex flex-col justify-center items-center p-4 selection:bg-[#E9C66A]/30">
      <div className="w-full max-w-md bg-[#FFFDF8] rounded-3xl border border-[#E8DFD1] shadow-cozy-3 p-6 sm:p-8 relative overflow-hidden">
        <CatPawWatermark className="absolute -bottom-6 -right-6" size={160} />

        {/* Mascot & Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-3xl bg-[#FFEADF] border-2 border-[#DAC1BB] flex items-center justify-center text-4xl shadow-sm mb-3.5 relative group">
            <span className="select-none transform group-hover:scale-105 transition-transform">🐱☕</span>
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E9C66A] border-2 border-[#FFFDF8] flex items-center justify-center text-xs"
              title="Kopi Duit"
            >
              🐾
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-[#45372F] tracking-tight">
            Kopi Duit
          </h1>
          <p className="text-xs sm:text-sm text-[#786E65] mt-1 max-w-xs leading-relaxed">
            A cozy student ledger for mindful daily spending, savings jars, and campus life.
          </p>
        </div>

        {/* Warm Feature Highlights */}
        <div className="mb-6 p-4 rounded-2xl bg-[#F5F0E6]/80 border border-[#E8DFD1] space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-[#45372F] font-semibold">
            <span className="text-sm">🍛</span>
            <span>Track Mamak meals, transit & campus printing</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#45372F] font-semibold">
            <span className="text-sm">🍯</span>
            <span>Whimsical savings jars for semester road trips & tech</span>
          </div>
          <div className="flex items-center gap-2.5 text-[#45372F] font-semibold">
            <span className="text-sm">🥢</span>
            <span>Instant roommate bill splitting for WhatsApp</span>
          </div>
        </div>

        {/* Error notice */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-[#FFDAD6] border border-[#BA1A1A]/30 text-xs text-[#BA1A1A] font-semibold text-center">
            {errorMsg}
          </div>
        )}

        {/* Google Sign In CTA */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#A6533D] hover:bg-[#8E4330] text-[#FFFDF8] font-bold text-sm flex items-center justify-center gap-3 transition-all transform active:scale-98 shadow-cozy-1 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#FFFDF8] border-t-transparent rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <>
                <svg className="w-4 h-4 bg-white rounded-full p-0.5 shrink-0" viewBox="0 0 24 24">
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
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        {/* Footer micro-accent */}
        <div className="mt-6 pt-4 border-t border-[#E8DFD1]/60 text-center">
          <p className="text-[11px] text-[#786E65]">
            🐾 Welcome to Kopi Duit • Safe, cozy & stress-free campus finances
          </p>
        </div>
      </div>
    </div>
  );
};
