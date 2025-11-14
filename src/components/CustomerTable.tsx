import { Edit, Eye, Trash2, Phone, Milk, Calendar, CreditCard } from 'lucide-react';
import { Customer } from '../lib/supabase';
import { useLanguage } from '../contexts/LanguageContext';

interface CustomerTableProps {
  customers: Customer[];
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer?: (customer: Customer) => void;
  onDeleteCustomer?: (customer: Customer) => void;
  onOpenCalendar?: (customer: Customer) => void;
  onTogglePaymentStatus?: (customer: Customer) => void;
}

export const CustomerTable = ({ customers, onViewCustomer, onEditCustomer, onDeleteCustomer, onOpenCalendar, onTogglePaymentStatus }: CustomerTableProps) => {
  const { language } = useLanguage();

  if (customers.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <Milk className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4 opacity-50" />
        <p className="text-[var(--text-secondary)] text-lg">
          {language === 'en' ? 'No customers found' : 'कोई ग्राहक नहीं मिला'}
        </p>
        <p className="text-[var(--text-tertiary)] text-sm mt-2">
          {language === 'en' ? 'Add your first customer to get started' : 'शुरू करने के लिए अपना पहला ग्राहक जोड़ें'}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-sm">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--border)] bg-[var(--bg-secondary)]">
            <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Customer' : 'ग्राहक'}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Phone' : 'फोन'}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Milk Type' : 'दूध प्रकार'}
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Quantity (L)' : 'मात्रा (ली)'}
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Rate (₹)' : 'दर (₹)'}
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Start Date' : 'आरंभ तिथि'}
            </th>
            <th className="px-6 py-4 text-right text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Outstanding' : 'बकाया'}
            </th>
            <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
              {language === 'en' ? 'Actions' : 'कार्य'}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {customers.map((customer) => (
            <tr 
              key={customer.id}
              className="hover:bg-[var(--bg-secondary)] transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {customer.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-[var(--text-primary)]">{customer.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{customer.milk_type === 'cow' ? '🐄' : '🐃'}</span>
                  <span className="text-sm text-[var(--text-primary)] font-medium">
                    {customer.milk_type === 'cow' 
                      ? (language === 'en' ? 'Cow' : 'गाय')
                      : (language === 'en' ? 'Buffalo' : 'भैंस')
                    }
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  {customer.daily_liters} L
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className="text-sm font-semibold text-[var(--text-primary)]">
                  ₹{customer.rate_per_liter}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-[var(--text-secondary)]">
                  {customer.start_date 
                    ? new Date(customer.start_date).toLocaleDateString('en-IN')
                    : (language === 'en' ? 'Not set' : 'सेट नहीं')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                  customer.payment_status === 'unpaid'
                    ? 'bg-[var(--orange)]/10 text-[var(--orange)] border border-[var(--orange)]/20'
                    : 'bg-[var(--green)]/10 text-[var(--green)] border border-[var(--green)]/20'
                }`}>
                  {customer.payment_status === 'unpaid'
                    ? (language === 'en' ? 'Unpaid' : 'अवैतनिक')
                    : (language === 'en' ? 'Paid' : 'चुकता')}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  {onOpenCalendar && (
                    <button
                      onClick={() => onOpenCalendar(customer)}
                      className="p-2 rounded-lg hover:bg-[var(--blue)]/10 text-[var(--blue)] transition-colors"
                      title={language === 'en' ? 'Open Calendar' : 'कैलेंडर खोलें'}
                    >
                      <Calendar className="w-4 h-4" />
                    </button>
                  )}
                  {onTogglePaymentStatus && (
                    <button
                      onClick={() => onTogglePaymentStatus(customer)}
                      className={`p-2 rounded-lg transition-colors ${
                        customer.payment_status === 'unpaid'
                          ? 'hover:bg-[var(--green)]/10 text-[var(--green)]'
                          : 'hover:bg-[var(--orange)]/10 text-[var(--orange)]'
                      }`}
                      title={customer.payment_status === 'unpaid'
                        ? (language === 'en' ? 'Mark as Paid' : 'भुगतान के रूप में चिह्नित करें')
                        : (language === 'en' ? 'Mark as Unpaid' : 'अवैतनिक के रूप में चिह्नित करें')
                      }
                    >
                      <CreditCard className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onViewCustomer(customer)}
                    className="p-2 rounded-lg hover:bg-[var(--blue)]/10 text-[var(--blue)] transition-colors"
                    title={language === 'en' ? 'View Details' : 'विवरण देखें'}
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {onEditCustomer && (
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="p-2 rounded-lg hover:bg-[var(--green)]/10 text-[var(--green)] transition-colors"
                      title={language === 'en' ? 'Edit' : 'संपादित करें'}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteCustomer && (
                    <button
                      onClick={() => onDeleteCustomer(customer)}
                      className="p-2 rounded-lg hover:bg-[var(--red)]/10 text-[var(--red)] transition-colors"
                      title={language === 'en' ? 'Delete' : 'हटाएं'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
