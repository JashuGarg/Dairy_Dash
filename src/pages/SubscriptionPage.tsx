import { ArrowLeft, CheckCircle, Zap, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

interface SubscriptionPageProps {
  onNavigate: (page: string) => void;
}

export const SubscriptionPage = ({ onNavigate }: SubscriptionPageProps) => {
  const { language } = useLanguage();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet'>('upi');

  const plans = {
    monthly: {
      name: 'Plus Monthly',
      nameHi: 'प्लस मासिक',
      price: 79,
      period: 'month',
      periodHi: 'महीना',
      savings: null,
    },
    annual: {
      name: 'Pro Annual',
      nameHi: 'प्रो वार्षिक',
      price: 699,
      period: 'year',
      periodHi: 'साल',
      savings: '26%',
    },
  };

  const features = [
    { text: 'AI Demand Forecast', textHi: 'एआई मांग पूर्वानुमान', included: ['monthly', 'annual'] },
    { text: 'Unlimited Customers', textHi: 'असीमित ग्राहक', included: ['monthly', 'annual'] },
    { text: 'WhatsApp Billing', textHi: 'व्हाट्सएप बिलिंग', included: ['monthly', 'annual'] },
    { text: 'PDF Bill Generation', textHi: 'पीडीएफ बिल जनरेशन', included: ['monthly', 'annual'] },
    { text: 'Voice Input', textHi: 'आवाज इनपुट', included: ['monthly', 'annual'] },
    { text: 'Cloud Backup', textHi: 'क्लाउड बैकअप', included: ['annual'] },
    { text: 'Priority Support', textHi: 'प्राथमिकता समर्थन', included: ['annual'] },
    { text: 'Advanced Analytics', textHi: 'उन्नत विश्लेषण', included: ['annual'] },
  ];

  const currentPlan = plans[selectedPlan];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-accent)]">
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
                {language === 'en' ? 'Upgrade Your Plan' : 'अपना प्लान अपग्रेड करें'}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {language === 'en' ? 'Unlock all premium features' : 'सभी प्रीमियम सुविधाएं अनलॉक करें'}
              </p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 p-2 bg-[var(--bg-card)] rounded-2xl shadow-md w-fit mx-auto">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                selectedPlan === 'monthly'
                  ? 'bg-[var(--green)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {language === 'en' ? 'Monthly' : 'मासिक'}
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all relative ${
                selectedPlan === 'annual'
                  ? 'bg-[var(--green)] text-white shadow-lg'
                  : 'text-[var(--text-secondary)]'
              }`}
            >
              {language === 'en' ? 'Annual' : 'वार्षिक'}
              <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-[var(--orange)] text-white text-xs font-bold rounded-full">
                {language === 'en' ? 'Save 26%' : '26% बचाएं'}
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="p-8 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--green)] to-[var(--dark-green)] flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                  {language === 'en' ? currentPlan.name : currentPlan.nameHi}
                </h3>
                {currentPlan.savings && (
                  <span className="text-sm text-[var(--orange)] font-bold">
                    {language === 'en' ? `Save ${currentPlan.savings}` : `${currentPlan.savings} बचाएं`}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-5xl font-bold text-[var(--green)]">₹{currentPlan.price}</span>
                <span className="text-[var(--text-secondary)]">
                  /{language === 'en' ? currentPlan.period : currentPlan.periodHi}
                </span>
              </div>
              {selectedPlan === 'annual' && (
                <p className="text-sm text-[var(--text-secondary)]">
                  {language === 'en' ? '₹58 per month' : '₹58 प्रति माह'}
                </p>
              )}
            </div>

            <div className="space-y-3 mb-8">
              <h4 className="font-bold text-[var(--text-primary)] mb-4">
                {language === 'en' ? 'What you get:' : 'आपको क्या मिलता है:'}
              </h4>
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className={`flex items-center gap-3 ${
                    feature.included.includes(selectedPlan) ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  <CheckCircle
                    className={`w-5 h-5 flex-shrink-0 ${
                      feature.included.includes(selectedPlan)
                        ? 'text-[var(--green)]'
                        : 'text-[var(--text-tertiary)]'
                    }`}
                  />
                  <span className="text-[var(--text-primary)]">
                    {language === 'en' ? feature.text : feature.textHi}
                  </span>
                  {!feature.included.includes(selectedPlan) && selectedPlan === 'monthly' && (
                    <span className="ml-auto text-xs text-[var(--orange)] font-medium">
                      {language === 'en' ? 'Annual only' : 'केवल वार्षिक'}
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-accent)] border border-[var(--green)]/30">
              <p className="text-sm text-[var(--text-primary)]">
                {language === 'en'
                  ? '✨ 7-day money-back guarantee. Cancel anytime.'
                  : '✨ 7-दिन की मनी-बैक गारंटी। कभी भी रद्द करें।'}
              </p>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-xl">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-6">
              {language === 'en' ? 'Payment Method' : 'भुगतान विधि'}
            </h3>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setPaymentMethod('upi')}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'upi'
                    ? 'border-[var(--green)] bg-[var(--green)]/10'
                    : 'border-[var(--border)] hover:border-[var(--green)]/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'upi' ? 'border-[var(--green)]' : 'border-[var(--border)]'
                }`}>
                  {paymentMethod === 'upi' && (
                    <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
                  )}
                </div>
                <Smartphone className="w-6 h-6 text-[var(--text-primary)]" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[var(--text-primary)]">UPI</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {language === 'en' ? 'Google Pay, PhonePe, Paytm' : 'गूगल पे, फोनपे, पेटीएम'}
                  </div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'card'
                    ? 'border-[var(--green)] bg-[var(--green)]/10'
                    : 'border-[var(--border)] hover:border-[var(--green)]/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'card' ? 'border-[var(--green)]' : 'border-[var(--border)]'
                }`}>
                  {paymentMethod === 'card' && (
                    <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
                  )}
                </div>
                <CreditCard className="w-6 h-6 text-[var(--text-primary)]" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {language === 'en' ? 'Credit / Debit Card' : 'क्रेडिट / डेबिट कार्ड'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Visa, Mastercard, RuPay</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('wallet')}
                className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                  paymentMethod === 'wallet'
                    ? 'border-[var(--green)] bg-[var(--green)]/10'
                    : 'border-[var(--border)] hover:border-[var(--green)]/50'
                }`}
              >
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === 'wallet' ? 'border-[var(--green)]' : 'border-[var(--border)]'
                }`}>
                  {paymentMethod === 'wallet' && (
                    <div className="w-3 h-3 rounded-full bg-[var(--green)]" />
                  )}
                </div>
                <Wallet className="w-6 h-6 text-[var(--text-primary)]" />
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[var(--text-primary)]">
                    {language === 'en' ? 'Wallet' : 'वॉलेट'}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">Paytm, PhonePe</div>
                </div>
              </button>
            </div>

            <div className="p-4 rounded-xl bg-[var(--bg-secondary)] mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text-secondary)]">
                  {language === 'en' ? 'Subtotal' : 'उपयोग'}
                </span>
                <span className="text-[var(--text-primary)] font-semibold">₹{currentPlan.price}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[var(--text-secondary)]">
                  {language === 'en' ? 'GST (18%)' : 'जीएसटी (18%)'}
                </span>
                <span className="text-[var(--text-primary)] font-semibold">
                  ₹{Math.round(currentPlan.price * 0.18)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--border)]">
                <span className="font-bold text-[var(--text-primary)]">
                  {language === 'en' ? 'Total' : 'कुल'}
                </span>
                <span className="text-2xl font-bold text-[var(--green)]">
                  ₹{currentPlan.price + Math.round(currentPlan.price * 0.18)}
                </span>
              </div>
            </div>

            <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--green)] to-[var(--dark-green)] text-white font-bold text-lg hover:scale-105 transition-transform shadow-lg mb-4">
              {language === 'en' ? `Pay ₹${currentPlan.price + Math.round(currentPlan.price * 0.18)}` : `₹${currentPlan.price + Math.round(currentPlan.price * 0.18)} भुगतान करें`}
            </button>

            <p className="text-xs text-center text-[var(--text-secondary)]">
              {language === 'en'
                ? 'Secure payment powered by Razorpay. Your card details are safe.'
                : 'Razorpay द्वारा संचालित सुरक्षित भुगतान। आपके कार्ड विवरण सुरक्षित हैं।'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <div className="text-3xl mb-2">🔒</div>
            <h4 className="font-bold text-[var(--text-primary)] mb-1">
              {language === 'en' ? 'Secure Payment' : 'सुरक्षित भुगतान'}
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? 'SSL encrypted' : 'SSL एन्क्रिप्टेड'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="font-bold text-[var(--text-primary)] mb-1">
              {language === 'en' ? 'Instant Access' : 'तुरंत एक्सेस'}
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? 'Activated immediately' : 'तुरंत सक्रिय'}
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
            <div className="text-3xl mb-2">💰</div>
            <h4 className="font-bold text-[var(--text-primary)] mb-1">
              {language === 'en' ? 'Money Back' : 'पैसे वापस'}
            </h4>
            <p className="text-sm text-[var(--text-secondary)]">
              {language === 'en' ? '7-day guarantee' : '7-दिन की गारंटी'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
