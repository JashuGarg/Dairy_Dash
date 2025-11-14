import { Milk, Mic, TrendingUp, Send, WifiOff, Languages, Star, CreditCard, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage = ({ onNavigate }: LandingPageProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const features = [
    { icon: Mic, title: 'Voice Input', titleHi: 'आवाज इनपुट', desc: 'Add entries by voice in Hindi/English', descHi: 'हिंदी/अंग्रेजी में आवाज से एंट्री जोड़ें' },
    { icon: TrendingUp, title: 'AI Milk Forecast', titleHi: 'एआई दूध पूर्वानुमान', desc: 'Predict tomorrow\'s demand accurately', descHi: 'कल की मांग का सटीक पूर्वानुमान' },
    { icon: CreditCard, title: 'Customer Billing', titleHi: 'ग्राहक बिलिंग', desc: 'Track deliveries & payments easily', descHi: 'डिलीवरी और भुगतान आसानी से ट्रैक करें' },
    { icon: Send, title: 'Auto WhatsApp Bills', titleHi: 'ऑटो व्हाट्सएप बिल', desc: 'Send PDF bills via WhatsApp instantly', descHi: 'व्हाट्सएप पर तुरंत पीडीएफ बिल भेजें' },
    { icon: WifiOff, title: 'Offline Access', titleHi: 'ऑफलाइन एक्सेस', desc: 'Works without internet connection', descHi: 'बिना इंटरनेट के काम करता है' },
    { icon: Languages, title: 'Multi-language', titleHi: 'बहु-भाषा', desc: 'Full support for Hindi & English', descHi: 'हिंदी और अंग्रेजी का पूर्ण समर्थन' },
  ];

  const stats = [
    { number: '500+', label: 'Milk Vendors', labelHi: 'दूध विक्रेता' },
    { number: '12,000+', label: 'Monthly Transactions', labelHi: 'मासिक लेनदेन' },
    { number: '98%', label: 'Time Saved', labelHi: 'समय की बचत' },
  ];

  const testimonials = [
    { name: 'Ramesh Kumar', nameHi: 'रमेश कुमार', location: 'Jaipur', text: 'DairyDash saved me 2 hours daily!', textHi: 'डेयरीडैश ने मुझे रोजाना 2 घंटे बचाए!' },
    { name: 'Suresh Patil', nameHi: 'सुरेश पाटिल', location: 'Pune', text: 'Voice input is a game changer', textHi: 'आवाज इनपुट एक गेम चेंजर है' },
    { name: 'Vijay Singh', nameHi: 'विजय सिंह', location: 'Delhi', text: 'AI prediction helps me plan better', textHi: 'एआई पूर्वानुमान मुझे बेहतर योजना बनाने में मदद करता है' },
  ];

  const plans = [
    {
      name: 'Free',
      nameHi: 'मुफ्त',
      price: '₹0',
      period: '/month',
      periodHi: '/महीना',
      features: ['Basic customer tracking', 'Manual billing', 'Up to 20 customers'],
      featuresHi: ['बुनियादी ग्राहक ट्रैकिंग', 'मैनुअल बिलिंग', '20 ग्राहकों तक']
    },
    {
      name: 'Plus',
      nameHi: 'प्लस',
      price: '₹79',
      period: '/month',
      periodHi: '/महीना',
      popular: true,
      features: ['AI Demand Forecast', 'PDF Bills', 'WhatsApp Billing', 'Unlimited customers'],
      featuresHi: ['एआई मांग पूर्वानुमान', 'पीडीएफ बिल', 'व्हाट्सएप बिलिंग', 'असीमित ग्राहक']
    },
    {
      name: 'Pro',
      nameHi: 'प्रो',
      price: '₹699',
      period: '/year',
      periodHi: '/साल',
      features: ['All Plus features', 'Cloud Backup', 'Priority Support', 'Advanced Analytics'],
      featuresHi: ['सभी प्लस सुविधाएं', 'क्लाउड बैकअप', 'प्राथमिकता समर्थन', 'उन्नत विश्लेषण']
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--bg-primary)] to-[var(--bg-secondary)] transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-[var(--bg-card)]/80 backdrop-blur-lg border-b border-[var(--border)] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Milk className="w-8 h-8 text-[var(--accent)]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">DairyDash</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--bg-accent)] text-[var(--text-accent)] hover:scale-105 transition-transform"
              >
                <Languages className="w-4 h-4" />
                <span className="text-sm font-medium">{language === 'en' ? 'हिं' : 'EN'}</span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-accent)] transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-4 py-2 rounded-lg bg-[var(--green)] text-white hover:bg-[var(--dark-green)] transition-colors font-medium"
              >
                {language === 'en' ? 'Login' : 'लॉगिन'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold text-[var(--text-primary)] mb-6 leading-tight">
            {language === 'en' ? 'Smart Dairy Assistant' : 'स्मार्ट डेयरी सहायक'}
            <br />
            <span className="text-[var(--green)]">{language === 'en' ? 'for Milk Vendors' : 'दूध विक्रेताओं के लिए'}</span>
          </h1>
          <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-3xl mx-auto">
            {language === 'en'
              ? 'Track milk, send bills, predict demand, voice input support'
              : 'दूध ट्रैक करें, बिल भेजें, मांग की भविष्यवाणी करें, आवाज इनपुट समर्थन'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 rounded-xl bg-[var(--green)] text-white text-lg font-semibold hover:bg-[var(--dark-green)] hover:scale-105 transition-all shadow-lg"
            >
              {language === 'en' ? 'Get Started' : 'शुरू करें'}
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-8 py-4 rounded-xl bg-[var(--bg-card)] text-[var(--text-primary)] text-lg font-semibold hover:bg-[var(--bg-accent)] hover:scale-105 transition-all shadow-lg border border-[var(--border)]"
            >
              {language === 'en' ? 'Try Demo' : 'डेमो देखें'}
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-[var(--bg-accent)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-[var(--accent)]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                {language === 'en' ? feature.title : feature.titleHi}
              </h3>
              <p className="text-[var(--text-secondary)]">
                {language === 'en' ? feature.desc : feature.descHi}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="text-center p-8 rounded-2xl bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-accent)] border border-[var(--border)] shadow-lg"
            >
              <div className="text-5xl font-bold text-[var(--green)] mb-2">{stat.number}</div>
              <div className="text-lg text-[var(--text-secondary)]">
                {language === 'en' ? stat.label : stat.labelHi}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-12">
          {language === 'en' ? 'What Vendors Say' : 'विक्रेता क्या कहते हैं'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[var(--orange)] text-[var(--orange)]" />
                ))}
              </div>
              <p className="text-[var(--text-primary)] mb-4 text-lg">
                "{language === 'en' ? testimonial.text : testimonial.textHi}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center text-white font-bold text-lg">
                  {(language === 'en' ? testimonial.name : testimonial.nameHi).charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">
                    {language === 'en' ? testimonial.name : testimonial.nameHi}
                  </div>
                  <div className="text-sm text-[var(--text-secondary)]">{testimonial.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-bold text-center text-[var(--text-primary)] mb-4">
          {language === 'en' ? 'Choose Your Plan' : 'अपना प्लान चुनें'}
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 text-lg">
          {language === 'en' ? 'Start free, upgrade anytime' : 'मुफ्त शुरू करें, कभी भी अपग्रेड करें'}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-2xl border-2 ${
                plan.popular
                  ? 'border-[var(--green)] bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-accent)] shadow-2xl scale-105'
                  : 'border-[var(--border)] bg-[var(--bg-card)]'
              } hover:scale-105 transition-all relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--green)] text-white rounded-full text-sm font-bold">
                  {language === 'en' ? 'POPULAR' : 'लोकप्रिय'}
                </div>
              )}
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                {language === 'en' ? plan.name : plan.nameHi}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[var(--green)]">{plan.price}</span>
                <span className="text-[var(--text-secondary)]">
                  {language === 'en' ? plan.period : plan.periodHi}
                </span>
              </div>
              <ul className="space-y-3 mb-8">
                {(language === 'en' ? plan.features : plan.featuresHi).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-[var(--text-primary)]">
                    <CheckCircle className="w-5 h-5 text-[var(--green)] flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onNavigate(plan.price === '₹0' ? 'login' : 'subscription')}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-[var(--green)] text-white hover:bg-[var(--dark-green)]'
                    : 'bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)]'
                }`}
              >
                {language === 'en' ? 'Get Started' : 'शुरू करें'}
              </button>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-[var(--bg-card)] border-t border-[var(--border)] mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Milk className="w-10 h-10 text-[var(--green)]" />
              <span className="text-3xl font-bold text-[var(--text-primary)]">DairyDash</span>
            </div>
            <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
              {language === 'en' ? 'Join the Dairy Revolution 🇮🇳🐄' : 'डेयरी क्रांति में शामिल हों 🇮🇳🐄'}
            </h3>
            <p className="text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto">
              {language === 'en'
                ? 'Built for Indian milk vendors, by people who understand your business'
                : 'भारतीय दूध विक्रेताओं के लिए बनाया गया, उन लोगों द्वारा जो आपके व्यवसाय को समझते हैं'}
            </p>
            <button
              onClick={() => onNavigate('login')}
              className="px-8 py-4 rounded-xl bg-[var(--green)] text-white text-lg font-semibold hover:bg-[var(--dark-green)] hover:scale-105 transition-all shadow-lg"
            >
              {language === 'en' ? 'Start Free Today' : 'आज मुफ्त शुरू करें'}
            </button>
          </div>
          <div className="mt-12 pt-8 border-t border-[var(--border)] text-center text-[var(--text-secondary)]">
            <p>© 2025 DairyDash. {language === 'en' ? 'All rights reserved.' : 'सर्वाधिकार सुरक्षित।'}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
