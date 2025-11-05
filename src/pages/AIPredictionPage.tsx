import { ArrowLeft, TrendingUp, Milk, AlertCircle, Lightbulb, ChefHat, Mic, Send } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface AIPredictionPageProps {
  onNavigate: (page: string) => void;
}

export const AIPredictionPage = ({ onNavigate }: AIPredictionPageProps) => {
  const { language } = useLanguage();
  const [chatInput, setChatInput] = useState('');

  const forecastData = [
    { day: 'Mon', dayHi: 'सोम', demand: 48 },
    { day: 'Tue', dayHi: 'मंगल', demand: 52 },
    { day: 'Wed', dayHi: 'बुध', demand: 50 },
    { day: 'Thu', dayHi: 'गुरु', demand: 56 },
    { day: 'Fri', dayHi: 'शुक्र', demand: 54 },
    { day: 'Sat', dayHi: 'शनि', demand: 60 },
    { day: 'Sun', dayHi: 'रवि', demand: 58 },
  ];

  const pastDeliveries = [
    { day: 'Mon', dayHi: 'सोम', delivered: 45 },
    { day: 'Tue', dayHi: 'मंगल', delivered: 48 },
    { day: 'Wed', dayHi: 'बुध', delivered: 47 },
    { day: 'Thu', dayHi: 'गुरु', delivered: 52 },
    { day: 'Fri', dayHi: 'शुक्र', delivered: 50 },
    { day: 'Sat', dayHi: 'शनि', delivered: 55 },
    { day: 'Sun', dayHi: 'रवि', delivered: 53 },
  ];

  const maxValue = Math.max(...forecastData.map(d => d.demand), ...pastDeliveries.map(d => d.delivered));

  const insights = [
    {
      icon: AlertCircle,
      title: 'Expected Leftover',
      titleHi: 'अपेक्षित बचा हुआ',
      value: '4 Liters',
      valueHi: '4 लीटर',
      color: 'orange',
      bgColor: 'var(--orange)',
    },
    {
      icon: ChefHat,
      title: 'AI Suggestion',
      titleHi: 'एआई सुझाव',
      value: 'Make Paneer & sell 🧀',
      valueHi: 'पनीर बनाएं और बेचें 🧀',
      color: 'green',
      bgColor: 'var(--green)',
    },
  ];

  const chatSuggestions = [
    { en: 'Tomorrow milk prediction?', hi: 'कल का दूध पूर्वानुमान?' },
    { en: 'Add Rakesh — 2L buffalo milk', hi: 'राकेश जोड़ें — 2L भैंस का दूध' },
    { en: 'Bill for Sunita', hi: 'सुनीता के लिए बिल' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <nav className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[var(--text-primary)]" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">
                {language === 'en' ? 'AI Milk Forecast' : 'एआई दूध पूर्वानुमान'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Smart demand prediction' : 'स्मार्ट मांग पूर्वानुमान'}
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{language === 'en' ? 'Tomorrow Required' : 'कल आवश्यक'}</h2>
                  <p className="text-white/80">{language === 'en' ? 'Based on AI analysis' : 'एआई विश्लेषण के आधार पर'}</p>
                </div>
              </div>
              <div className="text-5xl font-bold mb-2">56 {language === 'en' ? 'Liters' : 'लीटर'}</div>
              <div className="flex items-center gap-2 text-white/90">
                <Milk className="w-5 h-5" />
                <span>{language === 'en' ? '12% increase from today' : 'आज से 12% वृद्धि'}</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--green)]" />
                {language === 'en' ? '7-Day Demand Forecast' : '7-दिन मांग पूर्वानुमान'}
              </h3>
              <div className="space-y-3">
                {forecastData.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[var(--text-secondary)] font-medium">
                        {language === 'en' ? item.day : item.dayHi}
                      </span>
                      <span className="text-[var(--text-primary)] font-bold">{item.demand}L</span>
                    </div>
                    <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] rounded-full transition-all duration-500"
                        style={{ width: `${(item.demand / maxValue) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                <Milk className="w-5 h-5 text-[var(--blue)]" />
                {language === 'en' ? 'Past 7 Days Deliveries' : 'पिछले 7 दिन की डिलीवरी'}
              </h3>
              <div className="flex items-end justify-between gap-2 h-48">
                {pastDeliveries.map((item, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end h-40">
                      <div
                        className="w-full bg-gradient-to-t from-[var(--blue)] to-[var(--green)] rounded-t-lg transition-all duration-500 hover:opacity-80"
                        style={{ height: `${(item.delivered / maxValue) * 100}%` }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-bold text-[var(--text-primary)]">{item.delivered}L</div>
                      <div className="text-xs text-[var(--text-secondary)]">
                        {language === 'en' ? item.day : item.dayHi}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              {insights.map((insight, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${insight.bgColor}20` }}
                    >
                      <insight.icon className="w-6 h-6" style={{ color: insight.bgColor }} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[var(--text-primary)] mb-1">
                        {language === 'en' ? insight.title : insight.titleHi}
                      </h4>
                      <p className="text-lg font-bold" style={{ color: insight.bgColor }}>
                        {language === 'en' ? insight.value : insight.valueHi}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--blue)] to-[var(--green)] text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-6 h-6" />
                  <h4 className="font-bold text-lg">
                    {language === 'en' ? 'Pro Tip' : 'प्रो टिप'}
                  </h4>
                </div>
                <p className="text-white/90">
                  {language === 'en'
                    ? 'Weekend demand is usually 15% higher. Plan your supply accordingly!'
                    : 'सप्ताहांत की मांग आमतौर पर 15% अधिक होती है। तदनुसार अपनी आपूर्ति की योजना बनाएं!'}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Mic className="w-5 h-5 text-[var(--green)]" />
                {language === 'en' ? 'Ask Dairy AI' : 'डेयरी एआई से पूछें'}
              </h3>

              <div className="space-y-2 mb-4">
                {chatSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setChatInput(language === 'en' ? suggestion.en : suggestion.hi)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-left hover:bg-[var(--bg-accent)] transition-colors border border-[var(--border)]"
                  >
                    {language === 'en' ? suggestion.en : suggestion.hi}
                  </button>
                ))}
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={language === 'en' ? 'Ask anything...' : 'कुछ भी पूछें...'}
                  className="w-full pl-4 pr-12 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                  <button className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                    <Mic className="w-5 h-5 text-[var(--text-secondary)]" />
                  </button>
                  <button className="p-2 rounded-lg bg-[var(--green)] text-white hover:bg-[var(--dark-green)] transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-xl bg-[var(--bg-secondary)] border-l-4 border-[var(--green)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-[var(--text-primary)]">
                      {language === 'en'
                        ? 'Based on your delivery pattern, tomorrow you\'ll need approximately 56 liters. Consider preparing 4 extra liters as buffer for new customers.'
                        : 'आपकी डिलीवरी पैटर्न के आधार पर, कल आपको लगभग 56 लीटर की आवश्यकता होगी। नए ग्राहकों के लिए बफर के रूप में 4 अतिरिक्त लीटर तैयार करने पर विचार करें।'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
