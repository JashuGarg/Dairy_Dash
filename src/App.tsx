import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { Dashboard } from './pages/Dashboard';
import { AIPredictionPage } from './pages/AIPredictionPage';
import { BillingPage } from './pages/BillingPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { VoiceAssistant } from './components/VoiceAssistant';

type Page = 'landing' | 'login' | 'dashboard' | 'ai-prediction' | 'billing' | 'subscription' | 'add-customer';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={navigate} />}
          {currentPage === 'dashboard' && <Dashboard onNavigate={navigate} />}
          {currentPage === 'ai-prediction' && <AIPredictionPage onNavigate={navigate} />}
          {currentPage === 'billing' && <BillingPage onNavigate={navigate} />}
          {currentPage === 'subscription' && <SubscriptionPage onNavigate={navigate} />}

          {currentPage !== 'landing' && currentPage !== 'login' && <VoiceAssistant />}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
