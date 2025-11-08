import { useState } from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useCustomer } from '../contexts/CustomerContext';

interface CustomerFormProps {
  onClose: () => void;
}

export const CustomerForm = ({ onClose }: CustomerFormProps) => {
  const { language } = useLanguage();
  const { createCustomer } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    milk_type: 'cow' as 'cow' | 'buffalo',
    daily_liters: 1,
    rate_per_liter: 60,
    outstanding_amount: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await createCustomer(formData);
      onClose();
    } catch (error) {
      console.error('Error creating customer:', error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-card)] rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in">
        <div className="relative p-6 bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-2">
            {language === 'en' ? 'Add New Customer' : 'नया ग्राहक जोड़ें'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {language === 'en' ? 'Name' : 'नाम'}
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {language === 'en' ? 'Phone Number' : 'फोन नंबर'}
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
              pattern="[0-9+ -]+"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                {language === 'en' ? 'Milk Type' : 'दूध प्रकार'}
              </label>
              <select
                value={formData.milk_type}
                onChange={(e) => setFormData(prev => ({ ...prev, milk_type: e.target.value as 'cow' | 'buffalo' }))}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
              >
                <option value="cow">{language === 'en' ? '🐄 Cow' : '🐄 गाय'}</option>
                <option value="buffalo">{language === 'en' ? '🐃 Buffalo' : '🐃 भैंस'}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
                {language === 'en' ? 'Daily Quantity (L)' : 'दैनिक मात्रा (ली)'}
              </label>
              <input
                type="number"
                required
                min="0.5"
                step="0.5"
                // [FIX] Check for NaN and set value to empty string if true
                value={isNaN(formData.daily_liters) ? '' : formData.daily_liters}
                onChange={(e) => setFormData(prev => ({ ...prev, daily_liters: parseFloat(e.target.value) }))}
                className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
              {language === 'en' ? 'Rate per Liter (₹)' : 'प्रति लीटर दर (₹)'}
            </label>
            <input
              type="number"
              required
              min="1"
              // [FIX] Check for NaN and set value to empty string if true
              value={isNaN(formData.rate_per_liter) ? '' : formData.rate_per_liter}
              onChange={(e) => setFormData(prev => ({ ...prev, rate_per_liter: parseInt(e.target.value) }))}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-primary)] focus:border-[var(--green)] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-accent)] transition-colors"
            >
              {language === 'en' ? 'Cancel' : 'रद्द करें'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-[var(--green)] text-white font-medium hover:bg-[var(--dark-green)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? language === 'en' ? 'Adding...' : 'जोड़ा जा रहा है...'
                : language === 'en' ? 'Add Customer' : 'ग्राहक जोड़ें'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};