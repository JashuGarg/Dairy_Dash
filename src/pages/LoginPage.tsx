import { useState } from 'react';
import { Milk, Phone, Mail, ArrowLeft, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage = ({ onNavigate }: LoginPageProps) => {
  const { language, setLanguage } = useLanguage();
  const [method, setMethod] = useState<'phone' | 'email'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'input' && method === 'phone') {
      setStep('otp');
    } else {
      onNavigate('dashboard');
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

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMethod('phone');
                setStep('input');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                method === 'phone'
                  ? 'bg-[var(--green)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              <Phone className="w-5 h-5 inline-block mr-2" />
              {language === 'en' ? 'Phone' : 'फोन'}
            </button>
            <button
              onClick={() => {
                setMethod('email');
                setStep('input');
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                method === 'email'
                  ? 'bg-[var(--green)] text-white'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)]'
              }`}
            >
              <Mail className="w-5 h-5 inline-block mr-2" />
              {language === 'en' ? 'Email' : 'ईमेल'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 'input' ? (
              <>
                {method === 'phone' ? (
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
                        className="w-full pl-14 pr-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg"
                        required
                      />
                    </div>
                  </div>
                ) : (
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
                  </div>
                )}
              </>
            ) : (
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  {language === 'en' ? 'Enter OTP' : 'OTP दर्ज करें'}
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg text-center tracking-widest"
                  required
                />
                <p className="mt-2 text-sm text-[var(--text-secondary)] text-center">
                  {language === 'en' ? 'OTP sent to' : 'OTP भेजा गया'} +91 {phone}
                </p>
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="mt-2 text-sm text-[var(--green)] hover:underline w-full text-center"
                >
                  {language === 'en' ? 'Change number' : 'नंबर बदलें'}
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg"
            >
              {step === 'input'
                ? language === 'en'
                  ? method === 'phone'
                    ? 'Send OTP'
                    : 'Continue'
                  : method === 'phone'
                  ? 'OTP भेजें'
                  : 'जारी रखें'
                : language === 'en'
                ? 'Verify & Login'
                : 'सत्यापित करें और लॉगिन करें'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? "Don't have an account? " : 'खाता नहीं है? '}
              <button className="text-[var(--green)] font-semibold hover:underline">
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
