import { useState, useEffect } from 'react';
import { Mic, X, Loader2, ServerCrash, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { supabase } from '../lib/supabase';
import { useCustomer } from '../contexts/CustomerContext';
import { deliveryService } from '../lib/deliveryService';
import { paymentService } from '../lib/paymentService';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../lib/customerService';

type Status = 'idle' | 'listening' | 'processing' | 'error' | 'success';

export const VoiceAssistant = () => {
  const { language } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [feedback, setFeedback] = useState('');
  
  const { user } = useAuth();
  const { customers, createCustomer, fetchCustomers } = useCustomer();
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    hasSupport 
  } = useSpeechRecognition();

  // This function is called when speech recognition stops
  const handleSpeechResult = async (command: string) => {
    if (!command.trim()) {
      setStatus('idle');
      return;
    }
    
    setStatus('processing');
    setFeedback(language === 'en' ? 'Thinking...' : 'सोच रहे हैं...');

    try {
      // 1. Call the Edge Function
     const { data: parsed, error } = await supabase.functions.invoke(
          'parse-voice-command',
    {
        body: { text: command },
       headers: {
      "Content-Type": "application/json"
        }
  }
);

      if (error) throw new Error(error.message);

      // 2. Execute the parsed command
      switch (parsed.intent) {
        case 'CREATE_CUSTOMER':
          if (!user) throw new Error("Not logged in");
          await createCustomer({
            name: parsed.customerName,
            phone: '0000000000', // Set a default/placeholder phone
            milk_type: parsed.milkType,
            daily_liters: parsed.liters,
            rate_per_liter: parsed.rate,
            outstanding_amount: 0,
          });
          setStatus('success');
          setFeedback(language === 'en' 
            ? `Added new customer: ${parsed.customerName}`
            : `नया ग्राहक जोड़ा गया: ${parsed.customerName}`);
          break;

        case 'CREATE_DELIVERY':
          const deliveryCustomer = customers.find(c => c.name.toLowerCase() === parsed.customerName.toLowerCase());
          if (!deliveryCustomer || !user) {
            throw new Error(language === 'en' 
              ? `Customer "${parsed.customerName}" not found.`
              : `ग्राहक "${parsed.customerName}" नहीं मिला।`);
          }
          await deliveryService.createDelivery(user.id, {
            customer_id: deliveryCustomer.id,
            liters_delivered: parsed.liters,
            rate_used: deliveryCustomer.rate_per_liter,
            delivery_date: new Date().toISOString().split('T')[0],
          });
          setStatus('success');
          setFeedback(language === 'en'
            ? `Added ${parsed.liters}L delivery for ${deliveryCustomer.name}`
            : `${deliveryCustomer.name} के लिए ${parsed.liters}L डिलीवरी जोड़ी गई`);
          break;

        case 'CREATE_PAYMENT':
          const paymentCustomer = customers.find(c => c.name.toLowerCase() === parsed.customerName.toLowerCase());
          if (!paymentCustomer || !user) {
            throw new Error(language === 'en' 
              ? `Customer "${parsed.customerName}" not found.`
              : `ग्राहक "${parsed.customerName}" नहीं मिला।`);
          }
          await paymentService.createPayment(user.id, {
            customer_id: paymentCustomer.id,
            amount: parsed.amount,
            payment_method: 'cash', // Default
            payment_date: new Date().toISOString().split('T')[0],
          });
          
          // Also update the customer's outstanding amount
          const newOutstanding = (paymentCustomer.outstanding_amount || 0) - parsed.amount;
          await customerService.updateOutstandingAmount(paymentCustomer.id, user.id, newOutstanding);

          setStatus('success');
          setFeedback(language === 'en'
            ? `Recorded ₹${parsed.amount} payment from ${paymentCustomer.name}`
            : `${paymentCustomer.name} से ₹${parsed.amount} भुगतान रिकॉर्ड किया गया`);
          break;

        default:
          throw new Error(parsed.error || (language === 'en' ? 'I did not understand that.' : 'मैं यह समझ नहीं पाया।'));
      }
      
      // Refresh customer list after an action
      await fetchCustomers();

    } catch (err) {
      setStatus('error');
      setFeedback(err instanceof Error ? err.message : 'An unknown error occurred.');
    }
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      setStatus('listening');
      setFeedback(''); // Clear old feedback
      startListening();
    }
  };
  
  // Auto-submit when listening stops
  useEffect(() => {
    if (!isListening && status === 'listening' && transcript) {
      handleSpeechResult(transcript);
    }
  }, [isListening, status, transcript]);

  // Don't render if the browser doesn't support speech
  if (!hasSupport) {
    return null; 
  }

  return (
    <>
      {/* The Main FAB */}
      <button
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) {
            setStatus('idle'); // Reset status when opening
            setFeedback('');
          }
        }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Voice Assistant"
      >
        {isExpanded ? (
          <X className="w-7 h-7" />
        ) : (
          <Mic className="w-7 h-7" />
        )}
      </button>

      {/* The Modal */}
      {isExpanded && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setIsExpanded(false)}>
          <div className="bg-[var(--bg-card)] rounded-3xl p-8 max-w-md w-full shadow-2xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              
              {/* Main Button */}
              <button
                onClick={toggleListen}
                className={`w-24 h-24 mx-auto mb-6 rounded-full text-white flex items-center justify-center transition-all
                  ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-[var(--blue)] to-[var(--green)]'}`}
              >
                {status === 'processing' && <Loader2 className="w-12 h-12 animate-spin" />}
                {status === 'error' && <ServerCrash className="w-12 h-12" />}
                {status === 'success' && <CheckCircle className="w-12 h-12" />}
                {(status === 'idle' || status === 'listening') && <Mic className="w-12 h-12" />}
              </button>
              
              {/* Status Title */}
              <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">
                {status === 'listening' && (language === 'en' ? 'Listening...' : 'सुन रहे हैं...')}
                {status === 'processing' && (language === 'en' ? 'Processing...' : 'समझ रहे हैं...')}
                {status === 'error' && (language === 'en' ? 'Error' : 'त्रुटि')}
                {status === 'success' && (language === 'en' ? 'Success!' : 'सफल!')}
                {status === 'idle' && (language === 'en' ? 'Tap to Speak' : 'बोलने के लिए टैप करें')}
              </h3>

              {/* Feedback Text */}
              <p className="text-[var(--text-secondary)] min-h-[4em]">
                {status === 'listening' && (transcript || (language === 'en' ? 'Try saying: "Add Rakesh, 2 liters buffalo milk"' : 'कहें: "राकेश जोड़ें, 2 लीटर भैंस का दूध"'))}
                {status !== 'listening' && feedback}
              </p>
            </div>
            
            {/* Close Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-medium hover:bg-[var(--bg-accent)] transition-colors"
            >
              {language === 'en' ? 'Close' : 'बंद'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};