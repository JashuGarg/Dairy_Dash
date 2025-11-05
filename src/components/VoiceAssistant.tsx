import { useState } from 'react';
import { Mic, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const VoiceAssistant = () => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const suggestions = [
    { en: 'Add Rakesh — 2L buffalo milk', hi: 'राकेश जोड़ें — 2L भैंस का दूध' },
    { en: 'Bill for Sunita', hi: 'सुनीता के लिए बिल' },
    { en: 'Tomorrow milk prediction?', hi: 'कल का दूध पूर्वानुमान?' },
    { en: 'Show outstanding payments', hi: 'बकाया भुगतान दिखाएं' },
  ];

  return (
    <>
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) setIsListening(true);
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Voice Assistant"
      >
        {isExpanded ? (
          <X className="w-7 h-7" />
        ) : (
          <Mic className={`w-7 h-7 ${isListening ? 'animate-pulse' : ''}`} />
        )}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] opacity-0 group-hover:opacity-20 animate-ping" />
      </button>

      {isExpanded && (
        <div className="fixed bottom-28 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] animate-scale-in">
          <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] flex items-center justify-center mb-4 ${
                  isListening ? 'animate-pulse' : ''
                }`}>
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {isListening
                    ? language === 'en' ? 'Listening...' : 'सुन रहे हैं...'
                    : language === 'en' ? 'Voice Assistant' : 'आवाज सहायक'}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {language === 'en'
                    ? 'Tap mic to speak in Hindi or English'
                    : 'हिंदी या अंग्रेजी में बोलने के लिए माइक टैप करें'}
                </p>
              </div>

              {isListening && (
                <div className="mb-6">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-[var(--green)] rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 30 + 10}px`,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-center text-sm text-[var(--text-primary)] italic">
                    "{language === 'en' ? 'Add Ramesh, 3 liters cow milk...' : 'रमेश जोड़ें, 3 लीटर गाय का दूध...'}"
                  </p>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <p className="text-xs text-[var(--text-secondary)] font-semibold uppercase tracking-wide mb-3">
                  {language === 'en' ? 'Try saying:' : 'कहने का प्रयास करें:'}
                </p>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => setIsListening(true)}
                    className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-left hover:bg-[var(--bg-accent)] transition-colors border border-[var(--border)]"
                  >
                    {language === 'en' ? suggestion.en : suggestion.hi}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsListening(!isListening);
                  }}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    isListening
                      ? 'bg-[var(--red)] text-white hover:opacity-90'
                      : 'bg-[var(--green)] text-white hover:bg-[var(--dark-green)]'
                  }`}
                >
                  {isListening
                    ? language === 'en' ? 'Stop' : 'रुकें'
                    : language === 'en' ? 'Start' : 'शुरू करें'}
                </button>
                <button
                  onClick={() => {
                    setIsExpanded(false);
                    setIsListening(false);
                  }}
                  className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-accent)] transition-colors"
                >
                  {language === 'en' ? 'Close' : 'बंद'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
