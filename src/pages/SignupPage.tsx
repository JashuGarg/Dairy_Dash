import { useState } from 'react';
import { Milk, Mail, ArrowLeft, Languages, Lock, User, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { authService } from '../lib/auth';

interface SignupPageProps {
  onNavigate: (page: string) => void;
}

export const SignupPage = ({ onNavigate }: SignupPageProps) => {
  const { language, setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (password !== confirmPassword) {
        throw new Error(language === 'en' ? 'Passwords do not match' : 'पासवर्ड मेल नहीं खाते');
      }

      if (password.length < 6) {
        throw new Error(
          language === 'en'
            ? 'Password must be at least 6 characters'
            : 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए'
        );
      }

      await authService.signUpWithEmail(email, password, name, phone);
      onNavigate('dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setIsSubmitting(false);
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
              {language === 'en' ? 'Create Account' : 'खाता बनाएं'}
            </h1>
            <p className="text-[var(--text-secondary)]">
              {language === 'en'
                ? 'Sign up to start managing your dairy business'
                : 'अपना डेयरी व्यवसाय प्रबंधित करना शुरू करने के लिए साइन अप करें'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Full Name' : 'पूरा नाम'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={language === 'en' ? 'John Doe' : 'जॉन डो'}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                  required
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Phone Number' : 'फोन नंबर'}
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'en' ? '98765 43210' : '98765 43210'}
                  className="w-full pl-14 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                  required
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Email Address' : 'ईमेल पता'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={language === 'en' ? 'your@email.com' : 'आपका@ईमेल.com'}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                  required
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              </div>
            </div>

            <div>
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
                  minLength={6}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {language === 'en' ? 'Confirm Password' : 'पासवर्ड की पुष्टि करें'}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'en' ? '••••••••' : '••••••••'}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                  required
                  minLength={6}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting
                ? language === 'en'
                  ? 'Creating Account...'
                  : 'खाता बन रहा है...'
                : language === 'en'
                ? 'Create Account'
                : 'खाता बनाएं'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? 'Already have an account? ' : 'पहले से ही खाता है? '}
              <button
                onClick={() => onNavigate('login')}
                className="text-[var(--green)] font-semibold hover:underline"
              >
                {language === 'en' ? 'Sign in' : 'साइन इन करें'}
              </button>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-[var(--border)] text-center">
            <p className="text-xs text-[var(--text-secondary)]">
              {language === 'en'
                ? 'By signing up, you agree to our Terms & Privacy Policy'
                : 'साइन अप करके, आप हमारी शर्तों और गोपनीयता नीति से सहमत होते हैं'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};