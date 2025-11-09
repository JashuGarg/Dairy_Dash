import { useState } from 'react';
import { Milk, Mail, ArrowLeft, Languages, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { language, setLanguage } = useLanguage();
  const { signInWithPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await signInWithPassword(email, password);
      // navigate to dashboard after successful sign in
      onNavigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-accent)] flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">{language === 'en' ? 'Back' : 'वापस'}</span>
        </button>
      </div>

      <div className="absolute top-6 right-6">
        <button
          onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)] transition-colors"
        >
          <Languages className="w-5 h-5" />
          <span className="font-medium">{language === 'en' ? 'हिंदी' : 'English'}</span>
        </button>
      </div>

      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl p-8 border border-[var(--border)]">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center">
                <Milk className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
              {language === 'en' ? 'Welcome to DairyDash' : 'DairyDash में आपका स्वागत है'}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {language === 'en' ? 'Sign in to manage your dairy business' : 'अपने डेयरी व्यवसाय को प्रबंधित करने के लिए साइन इन करें'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={language === 'en' ? 'your@email.com' : 'आपका@ईमेल.com'}
                className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                required
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {language === 'en' ? 'Password' : 'पासवर्ड'}
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === 'en' ? '••••••••' : '••••••••'}
                    className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                    required
                  />
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              {language === 'en' ? 'Sign In' : 'साइन इन करें'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? "Don't have an account? " : 'खाता नहीं है? '}
              <button 
                onClick={() => onNavigate('signup')}
                className="text-[var(--green)] font-semibold hover:underline"
              >
                {language === 'en' ? 'Sign up free' : 'मुफ्त साइन अप करें'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'en'
                ? 'By continuing, you agree to our Terms & Privacy Policy'
                : 'जारी रखकर, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं'}
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-medium transition-colors"
          >
            {language === 'en' ? 'Continue to Demo →' : 'डेमो पर जाएं →'}
          </button>
        </div>
      </div>
    </div>
  );
};