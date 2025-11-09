import { useState, useEffect } from 'react';
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
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    // Get the last visited page from localStorage
    const savedPage = localStorage.getItem('currentPage') as Page;
    return savedPage || 'landing';
  });

  // Handle navigation based on auth state
  useEffect(() => {
    if (!loading) {
      if (user && (currentPage === 'landing' || currentPage === 'login' || currentPage === 'signup')) {
        // User is logged in, redirect to dashboard or last saved page
        const savedPage = localStorage.getItem('currentPage') as Page;
        const targetPage = savedPage && savedPage !== 'landing' && savedPage !== 'login' && savedPage !== 'signup' ? savedPage : 'dashboard';
        setCurrentPage(targetPage);
      } else if (!user && currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'signup') {
        // User is not logged in, redirect to landing
        setCurrentPage('landing');
      }
    }
  }, [user, loading, currentPage]);

  const navigate = (page: string) => {
    const newPage = page as Page;
    setCurrentPage(newPage);
    // Save the current page to localStorage
    localStorage.setItem('currentPage', newPage);
    window.scrollTo(0, 0);
  };

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--green)]"></div>
      </div>
    );
  }

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
