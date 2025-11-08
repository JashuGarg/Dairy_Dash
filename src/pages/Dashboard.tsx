import { useState, useEffect } from 'react';
import { UserPlus, Mic, PieChart, Search, Filter, IndianRupee, Milk, TrendingUp, FileText, Bell, Menu, Moon, Sun, LogOut } from 'lucide-react'; // [FIX] Import LogOut icon
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCustomer } from '../contexts/CustomerContext';
import { CustomerModal } from '../components/CustomerModal';
import { CustomerForm } from '../components/CustomerForm';
import { Customer } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext'; // [FIX] Import useAuth

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const { customers, fetchCustomers } = useCustomer();
  const { signOut } = useAuth(); // [FIX] Get the signOut function
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // [FIX] Add a handleSignOut function
  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing'); // Navigate to landing page after sign out
  };

  const recentTransactions = [
    { customer: 'Ramesh Kumar', customerHi: 'रमेश कुमार', amount: 180, type: 'delivery', time: '2h ago' },
    { customer: 'Sunita Devi', customerHi: 'सुनीता देवी', amount: 150, type: 'payment', time: '3h ago' },
    { customer: 'Vijay Singh', customerHi: 'विजय सिंह', amount: 240, type: 'delivery', time: '5h ago' },
    { customer: 'Priya Sharma', customerHi: 'प्रिया शर्मा', amount: 187.5, type: 'delivery', time: '1d ago' },
  ];

  const stats = {
    totalCustomers: customers.length,
    cowCustomers: customers.filter(c => c.milk_type === 'cow').length,
    buffaloCustomers: customers.filter(c => c.milk_type === 'buffalo').length,
    totalOutstanding: customers.reduce((sum, c) => sum + (c.outstanding_amount || 0), 0),
    todayDeliveries: 12,
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <nav className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-lg border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)]">
                <Menu className="w-6 h-6 text-[var(--text-primary)]" />
              </button>
              <Milk className="w-8 h-8 text-[var(--green)]" />
              <span className="text-xl font-bold text-[var(--text-primary)]">DairyDash</span>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <Bell className="w-5 h-5 text-[var(--text-primary)]" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--red)] rounded-full"></span>
              </button>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              {/* [FIX] Add Sign Out button */}
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                title={language === 'en' ? 'Sign Out' : 'साइन आउट करें'}
              >
                <LogOut className="w-5 h-5 text-[var(--red)]" />
              </button>
              <button
                onClick={() => onNavigate('subscription')}
                className="hidden sm:block px-4 py-2 rounded-lg bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] text-white font-medium hover:scale-105 transition-transform text-sm"
              >
                {language === 'en' ? 'Upgrade to Plus' : 'प्लस में अपग्रेड करें'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ... (rest of the file is the same) ... */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setShowAddCustomerForm(true)}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white hover:scale-105 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <UserPlus className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">{language === 'en' ? 'Add Customer' : 'ग्राहक जोड़ें'}</div>
                <div className="text-sm opacity-90">{language === 'en' ? 'Manually' : 'मैन्युअल रूप से'}</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setShowVoiceModal(true)}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[var(--blue)] to-[var(--dark-green)] text-white hover:scale-105 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mic className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">{language === 'en' ? 'Add w/ Voice' : 'आवाज से जोड़ें'}</div>
                <div className="text-sm opacity-90">{language === 'en' ? 'Quick entry' : 'त्वरित एंट्री'}</div>
              </div>
            </div>
          </button>

          <button
            onClick={() => onNavigate('ai-prediction')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[var(--orange)] to-[var(--brown)] text-white hover:scale-105 transition-all shadow-lg"
          >
            <div className="flex items-center justify-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp className="w-7 h-7" />
              </div>
              <div className="text-left">
                <div className="text-xl font-bold">{language === 'en' ? 'AI Forecast' : 'एआई पूर्वानुमान'}</div>
                <div className="text-sm opacity-90">{language === 'en' ? 'Smart insights' : 'स्मार्ट अंतर्दृष्टि'}</div>
              </div>
            </div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
            <div className="flex items-center justify-between mb-2">
              <PieChart className="w-8 h-8 text-[var(--green)]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.totalCustomers}</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{language === 'en' ? 'Total Customers' : 'कुल ग्राहक'}</div>
            <div className="mt-2 text-xs text-[var(--text-tertiary)]">
              🐄 {stats.cowCustomers} {language === 'en' ? 'Cow' : 'गाय'} | 🐃 {stats.buffaloCustomers} {language === 'en' ? 'Buffalo' : 'भैंस'}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
            <div className="flex items-center justify-between mb-2">
              <IndianRupee className="w-8 h-8 text-[var(--orange)]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">₹{stats.totalOutstanding}</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{language === 'en' ? 'Outstanding' : 'बकाया'}</div>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
            <div className="flex items-center justify-between mb-2">
              <Milk className="w-8 h-8 text-[var(--blue)]" />
              <span className="text-2xl font-bold text-[var(--text-primary)]">{stats.todayDeliveries}</span>
            </div>
            <div className="text-sm text-[var(--text-secondary)]">{language === 'en' ? 'Today Deliveries' : 'आज की डिलीवरी'}</div>
          </div>

          <button
            onClick={() => onNavigate('billing')}
            className="group p-6 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white hover:scale-105 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8" />
              <span className="text-2xl font-bold">→</span>
            </div>
            <div className="text-sm font-semibold">{language === 'en' ? 'Send Bills' : 'बिल भेजें'}</div>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Search className="w-5 h-5 text-[var(--text-tertiary)]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? 'Search customers by name or phone...' : 'नाम या फोन से ग्राहक खोजें...'}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)] placeholder-[var(--text-tertiary)] focus:border-[var(--green)] focus:outline-none transition-colors text-lg shadow-md"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={() => setShowVoiceModal(true)}
                  className="p-2 rounded-lg bg-[var(--green)] text-white hover:scale-110 transition-transform"
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-accent)] transition-colors">
                  <Filter className="w-5 h-5 text-[var(--text-secondary)]" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredCustomers.map(customer => (
                <button
                  key={customer.id}
                  onClick={() => setSelectedCustomer(customer)}
                  className="group p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--green)] hover:shadow-xl transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {customer.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-[var(--text-primary)] text-lg truncate">
                          {customer.name}
                        </h3>
                        <span className="text-2xl flex-shrink-0">
                          {customer.milk_type === 'cow' ? '🐄' : '🐃'}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">{customer.phone}</p>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-1 text-[var(--text-primary)]">
                          <Milk className="w-4 h-4 text-[var(--blue)]" />
                          <span className="font-semibold">{customer.daily_liters}L</span>
                          <span className="text-xs text-[var(--text-tertiary)]">@ ₹{customer.rate_per_liter}</span>
                        </div>
                        {customer.outstanding_amount > 0 && (
                          <div className="px-3 py-1 rounded-full bg-[var(--orange)]/10 text-[var(--orange)] text-xs font-bold border border-[var(--orange)]/20">
                            ₹{customer.outstanding_amount} {language === 'en' ? 'Due' : 'बकाया'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--green)]" />
                {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-accent)] transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      txn.type === 'delivery' ? 'bg-[var(--blue)]/20' : 'bg-[var(--green)]/20'
                    }`}>
                      {txn.type === 'delivery' ? (
                        <Milk className="w-5 h-5 text-[var(--blue)]" />
                      ) : (
                        <IndianRupee className="w-5 h-5 text-[var(--green)]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
                        {language === 'en' ? txn.customer : txn.customerHi}
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)]">{txn.time}</div>
                    </div>
                    <div className="text-sm font-bold text-[var(--text-primary)]">
                      ₹{txn.amount}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onNavigate={onNavigate}
        />
      )}

      {showAddCustomerForm && (
        <CustomerForm onClose={() => setShowAddCustomerForm(false)} />
      )}

      {showVoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] flex items-center justify-center animate-pulse">
                <Mic className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {language === 'en' ? 'Listening...' : 'सुन रहे हैं...'}
              </h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {language === 'en' ? 'Try saying: "Add Rakesh, 2 liters buffalo milk"' : 'कहें: "राकेश जोड़ें, 2 लीटर भैंस का दूध"'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowVoiceModal(false)}
                  className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-accent)] transition-colors"
                >
                  {language === 'en' ? 'Cancel' : 'रद्द करें'}
                </button>
                <button className="px-6 py-3 rounded-xl bg-[var(--green)] text-white font-medium hover:bg-[var(--dark-green)] transition-colors">
                  {language === 'en' ? 'Done' : 'हो गया'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};