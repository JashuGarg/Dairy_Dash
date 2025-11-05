import { X, Milk, Phone, IndianRupee, Send, FileText, Printer } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Customer {
  id: string;
  name: string;
  nameHi: string;
  phone: string;
  milkType: 'cow' | 'buffalo';
  dailyLiters: number;
  ratePerLiter: number;
  outstanding: number;
  photo: string;
}

interface CustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onNavigate: (page: string) => void;
}

export const CustomerModal = ({ customer, onClose, onNavigate }: CustomerModalProps) => {
  const { language } = useLanguage();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-card)] rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in overflow-hidden">
        <div className="relative p-6 bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl border-4 border-white/30">
              {customer.photo}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {language === 'en' ? customer.name : customer.nameHi}
              </h2>
              <div className="flex items-center gap-2 text-white/90">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Milk className="w-4 h-4" />
                <span className="text-xs opacity-80">{language === 'en' ? 'Milk Type' : 'दूध प्रकार'}</span>
              </div>
              <div className="text-lg font-bold">
                {customer.milkType === 'cow'
                  ? language === 'en' ? '🐄 Cow' : '🐄 गाय'
                  : language === 'en' ? '🐃 Buffalo' : '🐃 भैंस'}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-1">
                <Milk className="w-4 h-4" />
                <span className="text-xs opacity-80">{language === 'en' ? 'Daily Qty' : 'दैनिक मात्रा'}</span>
              </div>
              <div className="text-lg font-bold">{customer.dailyLiters}L</div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
              <div className="text-sm text-[var(--text-secondary)] mb-1">
                {language === 'en' ? 'Rate per Liter' : 'प्रति लीटर दर'}
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">
                ₹{customer.ratePerLiter}
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              customer.outstanding > 0
                ? 'bg-[var(--orange)]/10 border-[var(--orange)]/30'
                : 'bg-[var(--green)]/10 border-[var(--green)]/30'
            }`}>
              <div className="text-sm mb-1" style={{ color: customer.outstanding > 0 ? 'var(--orange)' : 'var(--green)' }}>
                {language === 'en' ? 'Outstanding' : 'बकाया'}
              </div>
              <div className="text-2xl font-bold" style={{ color: customer.outstanding > 0 ? 'var(--orange)' : 'var(--green)' }}>
                ₹{customer.outstanding}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full p-4 rounded-xl bg-[var(--green)] text-white font-semibold hover:bg-[var(--dark-green)] transition-all hover:scale-105 flex items-center justify-center gap-2">
              <Milk className="w-5 h-5" />
              {language === 'en' ? 'Add Delivery' : 'डिलीवरी जोड़ें'}
            </button>

            <button className="w-full p-4 rounded-xl bg-[var(--blue)] text-white font-semibold hover:opacity-90 transition-all hover:scale-105 flex items-center justify-center gap-2">
              <IndianRupee className="w-5 h-5" />
              {language === 'en' ? 'Collect Payment' : 'भुगतान एकत्र करें'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  onClose();
                  onNavigate('billing');
                }}
                className="p-4 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-accent)] transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5 text-[var(--green)]" />
                <span>{language === 'en' ? 'WhatsApp' : 'व्हाट्सएप'}</span>
              </button>

              <button className="p-4 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-accent)] transition-colors flex items-center justify-center gap-2">
                <FileText className="w-5 h-5 text-[var(--orange)]" />
                <span>{language === 'en' ? 'PDF' : 'पीडीएफ'}</span>
              </button>
            </div>

            <button className="w-full p-3 rounded-xl border-2 border-[var(--border)] text-[var(--text-secondary)] font-medium hover:border-[var(--green)] hover:text-[var(--green)] transition-colors flex items-center justify-center gap-2">
              <Printer className="w-5 h-5" />
              {language === 'en' ? 'Print Bill' : 'बिल प्रिंट करें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
