import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CustomerProvider } from './contexts/CustomerContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { Dashboard } from './pages/Dashboard';
import { AIPredictionPage } from './pages/AIPredictionPage';
import { BillingPage } from './pages/BillingPage';
import { SubscriptionPage } from './pages/SubscriptionPage';
import { VoiceAssistant } from './components/VoiceAssistant';

type Page = 'landing' | 'login' | 'signup' | 'dashboard' | 'ai-prediction' | 'billing' | 'subscription' | 'add-customer';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const { user } = useAuth();

  const navigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
      {currentPage === 'login' && <LoginPage onNavigate={navigate} />}
      {currentPage === 'signup' && <SignupPage onNavigate={navigate} />}
      {currentPage === 'dashboard' && user && <Dashboard onNavigate={navigate} />}
      {currentPage === 'ai-prediction' && user && <AIPredictionPage onNavigate={navigate} />}
      {currentPage === 'billing' && user && <BillingPage onNavigate={navigate} />}
      {currentPage === 'subscription' && user && <SubscriptionPage onNavigate={navigate} />}

      {currentPage !== 'landing' && currentPage !== 'login' && user && <VoiceAssistant />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <CustomerProvider>
            <AppContent />
          </CustomerProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
