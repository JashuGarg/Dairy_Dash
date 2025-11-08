import { UserPlus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FloatingActionButtonsProps {
  onAddCustomer: () => void;
  onVoiceAdd: () => void;
}

export const FloatingActionButtons = ({ onAddCustomer }: FloatingActionButtonsProps) => {
  const { language } = useLanguage();

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Add Customer Button - Primary Action */}
      <button
        onClick={onAddCustomer}
        className="group relative px-6 py-3 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] text-white shadow-2xl hover:shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-2 font-semibold"
        style={{ boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)' }}
      >
        <UserPlus className="w-5 h-5" />
        <span>{language === 'en' ? 'Add Customer' : 'ग्राहक जोड़ें'}</span>
      </button>
    </div>
  );
};
