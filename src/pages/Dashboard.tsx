import { useState, useEffect } from 'react';
import { PieChart, IndianRupee, Milk, TrendingUp, FileText, Bell, Menu, Moon, Sun, LogOut, UserPlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useCustomer } from '../contexts/CustomerContext';
import { CustomerModal } from '../components/CustomerModal';
import { CustomerForm } from '../components/CustomerForm';
import { CustomerTable } from '../components/CustomerTable';
import { SearchAndFilters } from '../components/SearchAndFilters';
import { DeliveryCalendarComponent } from '../components/DeliveryCalendar';
import { Customer } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const { customers, fetchCustomers } = useCustomer();
  const { signOut, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [milkTypeFilter, setMilkTypeFilter] = useState<'all' | 'cow' | 'buffalo'>('all');
  const [outstandingFilter, setOutstandingFilter] = useState<'all' | 'has_outstanding' | 'paid'>('all');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showAddCustomerForm, setShowAddCustomerForm] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedCustomerForCalendar, setSelectedCustomerForCalendar] = useState<Customer | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSignOut = async () => {
    await signOut();
    onNavigate('landing');
  };

  const handleTogglePaymentStatus = async (customer: Customer) => {
    try {
      if (!user) return;
      
      const newStatus = customer.payment_status === 'paid' ? 'unpaid' : 'paid';
      const { customerService } = await import('../lib/customerService');
      await customerService.updatePaymentStatus(customer.id, user.id, newStatus);
      await fetchCustomers();
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Failed to update payment status');
    }
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
    unpaidCustomers: customers.filter(c => c.payment_status === 'unpaid').length,
    todayDeliveries: 12,
  };

  // Apply filters
  const filteredCustomers = customers.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);
    const matchesMilkType = milkTypeFilter === 'all' || c.milk_type === milkTypeFilter;
    const matchesOutstanding = 
      outstandingFilter === 'all' ||
      (outstandingFilter === 'has_outstanding' && c.outstanding_amount > 0) ||
      (outstandingFilter === 'paid' && c.outstanding_amount === 0);
    return matchesSearch && matchesMilkType && matchesOutstanding;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[var(--bg-card)]/95 backdrop-blur-xl border-b border-[var(--border)] shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button className="lg:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
                <Menu className="w-6 h-6 text-[var(--text-primary)]" />
              </button>
              <Milk className="w-8 h-8 text-[var(--green)]" />
              <span className="text-xl font-bold text-[var(--text-primary)]">DairyDash</span>
            </div>
            <div className="flex items-center gap-2">
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

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Customers Card */}
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--green)]/10">
                <PieChart className="w-6 h-6 text-[var(--green)]" />
              </div>
              <span className="text-3xl font-bold text-[var(--text-primary)]">{stats.totalCustomers}</span>
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)] mb-1">
              {language === 'en' ? 'Total Customers' : 'कुल ग्राहक'}
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
              <span>🐄 {stats.cowCustomers}</span>
              <span>🐃 {stats.buffaloCustomers}</span>
            </div>
          </div>

          {/* Unpaid Customers Card */}
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--orange)]/10">
                <IndianRupee className="w-6 h-6 text-[var(--orange)]" />
              </div>
              <span className="text-3xl font-bold text-[var(--text-primary)]">{stats.unpaidCustomers}</span>
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {language === 'en' ? 'Unpaid Customers' : 'अवैतनिक ग्राहक'}
            </div>
          </div>

          {/* Today Deliveries Card */}
          <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-[var(--blue)]/10">
                <Milk className="w-6 h-6 text-[var(--blue)]" />
              </div>
              <span className="text-3xl font-bold text-[var(--text-primary)]">{stats.todayDeliveries}</span>
            </div>
            <div className="text-sm font-medium text-[var(--text-secondary)]">
              {language === 'en' ? 'Today Deliveries' : 'आज की डिलीवरी'}
            </div>
          </div>

          {/* Send Bills Card */}
          <button
            onClick={() => onNavigate('billing')}
            className="group p-5 rounded-xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white hover:scale-[1.02] hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-white/20">
                <FileText className="w-6 h-6" />
              </div>
              <TrendingUp className="w-6 h-6 opacity-80" />
            </div>
            <div className="text-sm font-semibold text-left">
              {language === 'en' ? 'Send Bills' : 'बिल भेजें'}
            </div>
            <div className="text-xs opacity-80 text-left mt-1">
              {language === 'en' ? 'Generate & Share' : 'बनाएं और भेजें'}
            </div>
          </button>
        </div>

        {/* Search and Filters + Customer Table */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content - Customer Table */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search and Filters */}
            <SearchAndFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              milkTypeFilter={milkTypeFilter}
              onMilkTypeChange={setMilkTypeFilter}
              outstandingFilter={outstandingFilter}
              onOutstandingChange={setOutstandingFilter}
            />

            {/* Customer Table */}
            <div className="bg-[var(--bg-card)] rounded-xl shadow-sm">
              <div className="p-4 border-b border-[var(--border)] flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  {language === 'en' ? 'Customers' : 'ग्राहक'}
                  <span className="ml-2 text-sm font-normal text-[var(--text-secondary)]">
                    ({filteredCustomers.length})
                  </span>
                </h2>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddCustomerForm(true)}
                    className="px-4 py-2 rounded-lg bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white font-semibold hover:scale-105 transition-all flex items-center gap-2 shadow-md"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{language === 'en' ? 'Add Customer' : 'ग्राहक जोड़ें'}</span>
                  </button>
                </div>
              </div>
              <CustomerTable
                customers={filteredCustomers}
                onViewCustomer={setSelectedCustomer}
                onOpenCalendar={(customer) => {
                  setSelectedCustomerForCalendar(customer);
                  setIsCalendarOpen(true);
                }}
                onTogglePaymentStatus={handleTogglePaymentStatus}
              />
            </div>
          </div>

          {/* Sidebar - Recent Activity */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] shadow-sm">
              <h3 className="text-base font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[var(--green)]" />
                {language === 'en' ? 'Recent Activity' : 'हाल की गतिविधि'}
              </h3>
              <div className="space-y-3">
                {recentTransactions.map((txn, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-accent)] transition-colors">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
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

      {/* Customer Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={{
            ...selectedCustomer,
            nameHi: selectedCustomer.name,
            milkType: selectedCustomer.milk_type,
            dailyLiters: selectedCustomer.daily_liters,
            ratePerLiter: selectedCustomer.rate_per_liter,
            outstanding: selectedCustomer.outstanding_amount,
            photo: selectedCustomer.name.slice(0, 2).toUpperCase(),
          }}
          onClose={() => setSelectedCustomer(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Add Customer Form */}
      {showAddCustomerForm && (
        <CustomerForm onClose={() => setShowAddCustomerForm(false)} />
      )}

      {selectedCustomer && (
        <CustomerModal
          customer={{
            ...selectedCustomer,
            nameHi: selectedCustomer.name,
            milkType: selectedCustomer.milk_type,
            dailyLiters: selectedCustomer.daily_liters,
            ratePerLiter: selectedCustomer.rate_per_liter,
            outstanding: selectedCustomer.outstanding_amount,
            photo: selectedCustomer.name.slice(0, 2).toUpperCase(),
          }}
          onClose={() => setSelectedCustomer(null)}
          onNavigate={onNavigate}
        />
      )}

      {/* Delivery Calendar Modal */}
      {selectedCustomerForCalendar && (
        <DeliveryCalendarComponent
          customer={selectedCustomerForCalendar}
          isOpen={isCalendarOpen}
          onClose={() => {
            setIsCalendarOpen(false);
            setSelectedCustomerForCalendar(null);
          }}
          onBillUpdate={fetchCustomers}
        />
      )}
    </div>
  );
};
