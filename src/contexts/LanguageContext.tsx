import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'app.name': 'DairyDash',
    'hero.title': 'Smart Dairy Assistant for Milk Vendors',
    'hero.subtitle': 'Track milk, send bills, predict demand, voice input support',
    'hero.getStarted': 'Get Started',
    'hero.tryDemo': 'Try Demo',
    'features.voice': 'Voice Input',
    'features.ai': 'AI Milk Forecast',
    'features.billing': 'Customer Billing',
    'features.whatsapp': 'Auto WhatsApp Bills + PDF',
    'features.offline': 'Offline Access',
    'features.multilang': 'Multi-language',
    'dashboard.addCustomer': 'Add Customer',
    'dashboard.addVoice': 'Add w/ Voice',
    'dashboard.search': 'Search customers...',
    'ai.title': 'Milk Demand Prediction',
    'billing.send': 'Send Bills & PDF',
  },
  hi: {
    'app.name': 'डेयरीडैश',
    'hero.title': 'दूध विक्रेताओं के लिए स्मार्ट सहायक',
    'hero.subtitle': 'दूध ट्रैक करें, बिल भेजें, मांग की भविष्यवाणी करें',
    'hero.getStarted': 'शुरू करें',
    'hero.tryDemo': 'डेमो देखें',
    'features.voice': 'आवाज इनपुट',
    'features.ai': 'एआई दूध पूर्वानुमान',
    'features.billing': 'ग्राहक बिलिंग',
    'features.whatsapp': 'ऑटो व्हाट्सएप बिल + पीडीएफ',
    'features.offline': 'ऑफलाइन एक्सेस',
    'features.multilang': 'बहु-भाषा',
    'dashboard.addCustomer': 'ग्राहक जोड़ें',
    'dashboard.addVoice': 'आवाज से जोड़ें',
    'dashboard.search': 'ग्राहक खोजें...',
    'ai.title': 'दूध मांग पूर्वानुमान',
    'billing.send': 'बिल भेजें और पीडीएफ',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
