import { useState } from 'react';
import { ArrowLeft, Send, FileText, Download, QrCode, CheckCircle, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BillingPageProps {
  onNavigate: (page: string) => void;
}

export const BillingPage = ({ onNavigate }: BillingPageProps) => {
  const { language } = useLanguage();
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>(['1', '3', '6']);
  const [showPreview, setShowPreview] = useState(false);

  const customers = [
    { id: '1', name: 'Ramesh Kumar', nameHi: 'रमेश कुमार', amount: 1800, days: 30 },
    { id: '2', name: 'Sunita Devi', nameHi: 'सुनीता देवी', amount: 0, days: 30 },
    { id: '3', name: 'Vijay Singh', nameHi: 'विजय सिंह', amount: 2400, days: 30 },
    { id: '4', name: 'Priya Sharma', nameHi: 'प्रिया शर्मा', amount: 2250, days: 30 },
    { id: '5', name: 'Rakesh Patil', nameHi: 'राकेश पाटिल', amount: 0, days: 30 },
    { id: '6', name: 'Anjali Mehta', nameHi: 'अंजलि मेहता', amount: 2700, days: 30 },
  ];

  const toggleCustomer = (id: string) => {
    setSelectedCustomers(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const selectedTotal = customers
    .filter(c => selectedCustomers.includes(c.id))
    .reduce((sum, c) => sum + c.amount, 0);

  const selectedCount = selectedCustomers.length;

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
                {language === 'en' ? 'Send Bills & PDF' : 'बिल भेजें और पीडीएफ'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Monthly billing made easy' : 'मासिक बिलिंग आसान बना दी'}
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  {language === 'en' ? 'Select Customers' : 'ग्राहक चुनें'}
                </h2>
                <button
                  onClick={() => {
                    const allIds = customers.filter(c => c.amount > 0).map(c => c.id);
                    setSelectedCustomers(
                      selectedCustomers.length === allIds.length ? [] : allIds
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--bg-accent)] transition-colors text-sm font-medium"
                >
                  {selectedCustomers.length === customers.filter(c => c.amount > 0).length
                    ? language === 'en' ? 'Deselect All' : 'सभी हटाएं'
                    : language === 'en' ? 'Select All' : 'सभी चुनें'}
                </button>
              </div>

              <div className="space-y-3">
                {customers.map(customer => (
                  <button
                    key={customer.id}
                    onClick={() => customer.amount > 0 && toggleCustomer(customer.id)}
                    disabled={customer.amount === 0}
                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                      customer.amount === 0
                        ? 'border-[var(--border)] bg-[var(--bg-secondary)] opacity-50 cursor-not-allowed'
                        : selectedCustomers.includes(customer.id)
                        ? 'border-[var(--green)] bg-[var(--green)]/10'
                        : 'border-[var(--border)] bg-[var(--bg-primary)] hover:border-[var(--green)]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                          selectedCustomers.includes(customer.id)
                            ? 'border-[var(--green)] bg-[var(--green)]'
                            : 'border-[var(--border)]'
                        }`}>
                          {selectedCustomers.includes(customer.id) && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-[var(--text-primary)]">
                            {language === 'en' ? customer.name : customer.nameHi}
                          </div>
                          <div className="text-sm text-[var(--text-secondary)]">
                            {customer.days} {language === 'en' ? 'days billing' : 'दिन बिलिंग'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xl font-bold ${
                          customer.amount > 0 ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'
                        }`}>
                          ₹{customer.amount}
                        </div>
                        {customer.amount === 0 && (
                          <div className="text-xs text-[var(--green)]">
                            {language === 'en' ? 'Paid' : 'भुगतान किया'}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white shadow-lg sticky top-24">
              <h3 className="text-lg font-semibold mb-4 opacity-90">
                {language === 'en' ? 'Billing Summary' : 'बिलिंग सारांश'}
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center pb-3 border-b border-white/20">
                  <span className="opacity-90">{language === 'en' ? 'Selected Customers' : 'चयनित ग्राहक'}</span>
                  <span className="text-xl font-bold">{selectedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90">{language === 'en' ? 'Total Amount' : 'कुल राशि'}</span>
                  <span className="text-3xl font-bold">₹{selectedTotal}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setShowPreview(true)}
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCount === 0
                      ? 'bg-white/20 cursor-not-allowed'
                      : 'bg-white text-[var(--green)] hover:scale-105'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  {language === 'en' ? 'Send WhatsApp Bills' : 'व्हाट्सएप बिल भेजें'}
                </button>

                <button
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCount === 0
                      ? 'bg-white/20 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <FileText className="w-5 h-5" />
                  {language === 'en' ? 'Generate PDF' : 'पीडीएफ बनाएं'}
                </button>

                <button
                  disabled={selectedCount === 0}
                  className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    selectedCount === 0
                      ? 'bg-white/20 cursor-not-allowed'
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                >
                  <Download className="w-5 h-5" />
                  {language === 'en' ? 'Download All' : 'सभी डाउनलोड करें'}
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="text-xs opacity-80 text-center mb-3">
                  {language === 'en' ? 'Upgrade to Plus for unlimited bills' : 'असीमित बिलों के लिए प्लस में अपग्रेड करें'}
                </div>
                <button
                  onClick={() => onNavigate('subscription')}
                  className="w-full py-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-sm font-medium"
                >
                  {language === 'en' ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-card)] rounded-3xl max-w-md w-full shadow-2xl animate-scale-in">
            <div className="p-6 border-b border-[var(--border)]">
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                <FileText className="w-6 h-6 text-[var(--green)]" />
                {language === 'en' ? 'Bill Preview' : 'बिल पूर्वावलोकन'}
              </h3>
            </div>

            <div className="p-6">
              <div className="border-2 border-dashed border-[var(--border)] rounded-2xl p-6 mb-6">
                <div className="text-center mb-4">
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-1">DairyDash</h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    {language === 'en' ? 'Monthly Milk Bill' : 'मासिक दूध बिल'}
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      {language === 'en' ? 'Customer:' : 'ग्राहक:'}
                    </span>
                    <span className="text-[var(--text-primary)] font-semibold">
                      {language === 'en' ? 'Ramesh Kumar' : 'रमेश कुमार'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      {language === 'en' ? 'Period:' : 'अवधि:'}
                    </span>
                    <span className="text-[var(--text-primary)] font-semibold">1-30 Dec 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">
                      {language === 'en' ? 'Total Liters:' : 'कुल लीटर:'}
                    </span>
                    <span className="text-[var(--text-primary)] font-semibold">90L</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-[var(--border)]">
                    <span className="text-[var(--text-primary)] font-bold">
                      {language === 'en' ? 'Total Amount:' : 'कुल राशि:'}
                    </span>
                    <span className="text-[var(--green)] font-bold text-lg">₹1,800</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-center">
                  <div className="w-24 h-24 bg-[var(--bg-secondary)] rounded-lg flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-[var(--text-secondary)]" />
                  </div>
                </div>
                <p className="text-xs text-center text-[var(--text-secondary)] mt-2">
                  {language === 'en' ? 'Scan to pay via UPI' : 'यूपीआई से भुगतान करने के लिए स्कैन करें'}
                </p>
              </div>

              <div className="space-y-3">
                <button className="w-full py-3 rounded-xl bg-[var(--green)] text-white font-semibold hover:bg-[var(--dark-green)] transition-colors flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" />
                  {language === 'en' ? 'Send to WhatsApp' : 'व्हाट्सएप पर भेजें'}
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-accent)] transition-colors flex items-center justify-center gap-2">
                    <Printer className="w-5 h-5" />
                    {language === 'en' ? 'Print' : 'प्रिंट'}
                  </button>
                  <button className="py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-accent)] transition-colors flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    {language === 'en' ? 'PDF' : 'पीडीएफ'}
                  </button>
                </div>

                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full py-3 rounded-xl border-2 border-[var(--border)] text-[var(--text-secondary)] font-medium hover:border-[var(--green)] hover:text-[var(--green)] transition-colors"
                >
                  {language === 'en' ? 'Close' : 'बंद करें'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
