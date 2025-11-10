// src/components/VoiceAssistant.tsx
// (Replace the old file with this new, complete code)

import { useState, useEffect } from 'react';
import { Mic, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase'; // Import supabase client
import { useCustomer } from '../contexts/CustomerContext'; // Import customer context
import { deliveryService } from '../lib/deliveryService'; // Import delivery service
import { paymentService } from '../lib/paymentService'; // Import payment service
import { useAuth } from '../contexts/AuthContext'; // To get user ID

// --- Speech Recognition Setup ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition: any = null;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false; // Stop listening after a pause
  recognition.interimResults = false;
  recognition.lang = 'en-US'; // Default language
}
// ---------------------------------

export const VoiceAssistant = () => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [statusText, setStatusText] = useState(language === 'en' ? 'Voice Assistant' : 'आवाज सहायक');
  const [transcript, setTranscript] = useState(''); // To show what the user said
  const [isProcessing, setIsProcessing] = useState(false); // For loading state

  // --- Get Supabase hooks ---
  const { user } = useAuth();
  const { createCustomer, customers } = useCustomer(); // We need 'customers' to find IDs

  useEffect(() => {
    // Update language for speech recognition
    if (recognition) {
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }
    // Update status text if not busy
    if (!isListening && !isProcessing && !transcript) {
      setStatusText(language === 'en' ? 'Voice Assistant' : 'आवाज सहायक');
    }
  }, [language, isListening, isProcessing, transcript]);


  const suggestions = [
    { en: 'Add Rakesh — 2L buffalo milk', hi: 'राकेश जोड़ें — 2L भैंस का दूध' },
    { en: 'Bill for Sunita', hi: 'सुनीता के लिए बिल' },
    { en: 'Tomorrow milk prediction?', hi: 'कल का दूध पूर्वानुमान?' },
    { en: 'Show outstanding payments', hi: 'बकाया भुगतान दिखाएं' },
  ];

  // --- Main Function to Handle Speech ---
  const handleSpeechResult = async (speechTranscript: string) => {
    setTranscript(`"${speechTranscript}"`);
    setIsProcessing(true);
    setStatusText(language === 'en' ? 'Processing...' : 'प्रोसेस हो रहा है...');
    setIsListening(false);

    try {
      // 1. Call our new Supabase function
      const { data, error } = await supabase.functions.invoke('process-speech', {
        body: { prompt: speechTranscript },
      });

      if (error) throw error;

      console.log('Got JSON from Gemini:', data);

      // 2. Decide what to do with the JSON
      if (!user) throw new Error('User not found');

      switch (data.action) {
        case 'create_customer':
          await createCustomer(data.payload);
          setStatusText(language === 'en' ? `Added customer ${data.payload.name}` : `ग्राहक ${data.payload.name} जोड़ा गया`);
          break;
        
        case 'create_delivery': {
          // Find the customer ID from the name
          const customerName = data.payload.customer_name.toLowerCase();
          const customer = customers.find(c => 
            c.name.toLowerCase().includes(customerName)
          );
          
          if (!customer) {
            throw new Error(language === 'en' ? `Customer '${data.payload.customer_name}' not found.` : `ग्राहक '${data.payload.customer_name}' नहीं मिला।`);
          }

          await deliveryService.createDelivery(user.id, {
            customer_id: customer.id,
            liters_delivered: data.payload.liters_delivered,
            rate_used: customer.rate_per_liter, // Use customer's default rate
            delivery_date: data.payload.delivery_date,
          });
          setStatusText(language === 'en' ? `Added delivery for ${customer.name}` : `${customer.name} के लिए डिलीवरी जोड़ी गई`);
          break;
        }

        case 'create_payment': {
          // Find the customer ID from the name
          const customerName = data.payload.customer_name.toLowerCase();
          const payingCustomer = customers.find(c => 
            c.name.toLowerCase().includes(customerName)
          );
          
          if (!payingCustomer) {
            throw new Error(language === 'en' ? `Customer '${data.payload.customer_name}' not found.` : `ग्राहक '${data.payload.customer_name}' नहीं मिला।`);
          }

          await paymentService.createPayment(user.id, {
            customer_id: payingCustomer.id,
            amount: data.payload.amount,
            payment_date: data.payload.payment_date,
            payment_method: 'cash', // Default to cash for voice
          });
          setStatusText(language === 'en' ? `Added payment for ${payingCustomer.name}` : `${payingCustomer.name} के लिए भुगतान जोड़ा गया`);
          break;
        }

        default:
          setStatusText(language === 'en' ? "Sorry, I didn't understand that command." : "क्षमा करें, मैं वह आदेश नहीं समझ सका।");
      }

    } catch (err: any) {
      console.error('Action Error:', err);
      const errorMsg = err.message || "An error occurred";
      setStatusText(errorMsg.includes('Customer') ? errorMsg : (language === 'en' ? 'Action failed' : 'कार्रवाई विफल'));
    } finally {
      setIsProcessing(false);
      // Automatically close the modal after 3 seconds
      setTimeout(() => {
        if (isExpanded) { // Only close if it's still open
          setIsExpanded(false);
          setTranscript('');
        }
      }, 3000);
    }
  };

  // --- Setup Speech Recognition Listeners ---
  useEffect(() => {
    if (!recognition) return;

    recognition.onstart = () => {
      setIsListening(true);
      setStatusText(language === 'en' ? 'Listening...' : 'सुन रहे हैं...');
      setTranscript('');
    };

    recognition.onend = () => {
      setIsListening(false);
      if (!isProcessing && !transcript) {
        setStatusText(language === 'en' ? 'Voice Assistant' : 'आवाज सहायक');
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setStatusText(language === 'en' ? 'Speech Error' : 'बोलने में त्रुटि');
    };

    recognition.onresult = (event: any) => {
      const speechTranscript = event.results[0][0].transcript;
      handleSpeechResult(speechTranscript);
    };
    // We pass dependencies to re-hook listeners if these values change
  }, [isProcessing, language, customers, user, createCustomer, isExpanded, transcript]); 

  // --- Control Functions ---
  const toggleListen = () => {
    if (isListening) {
      recognition.stop();
    } else {
      if (!recognition) {
        alert('Speech recognition is not supported in this browser.');
        return;
      }
      try {
        recognition.start();
      } catch (err) {
        console.error('Speech start error:', err);
      }
    }
  };

  const toggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      if (isListening) recognition.stop();
      setIsProcessing(false);
      setTranscript('');
    } else {
      setIsExpanded(true);
      toggleListen(); // Automatically start listening when opened
    }
  };

  return (
    <>
      <button
        onClick={toggleExpand}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] text-white shadow-2xl hover:scale-110 transition-transform flex items-center justify-center group"
        aria-label="Voice Assistant"
      >
        {isExpanded ? (
          <X className="w-7 h-7" />
        ) : (
          <Mic className={`w-7 h-7 ${isListening ? 'animate-pulse' : ''}`} />
        )}
      </button>

      {isExpanded && (
        <div className="fixed bottom-28 right-6 z-50 w-80 max-w-[calc(100vw-3rem)] animate-scale-in">
          <div className="bg-[var(--bg-card)] rounded-3xl shadow-2xl border border-[var(--border)] overflow-hidden">
            <div className="p-6">
              <div className="text-center mb-6">
                <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[var(--blue)] to-[var(--green)] flex items-center justify-center mb-4 ${
                  isListening || isProcessing ? 'animate-pulse' : ''
                }`}>
                  <Mic className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 min-h-[2rem]">
                  {statusText}
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  {transcript || (language === 'en' ? 'Try saying...' : 'कहने का प्रयास करें...')}
                </p>
              </div>

              {/* Suggestions */}
              {!isListening && !isProcessing && !transcript && (
                <div className="space-y-2 mb-6">
                  {suggestions.slice(0, 3).map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSpeechResult(language === 'en' ? suggestion.en : suggestion.hi)}
                      className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] text-sm text-left hover:bg-[var(--bg-accent)] transition-colors border border-[var(--border)]"
                    >
                      {language === 'en' ? suggestion.en : suggestion.hi}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={toggleListen}
                  disabled={isProcessing}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                    isListening
                      ? 'bg-[var(--red)] text-white hover:opacity-90'
                      : 'bg-[var(--green)] text-white hover:bg-[var(--dark-green)]'
                  } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isListening
                    ? language === 'en' ? 'Stop' : 'रुकें'
                    : language === 'en' ? 'Start' : 'शुरू करें'}
                </button>
                <button
                  onClick={toggleExpand}
                  className="px-6 py-3 rounded-xl bg-[var(--bg-secondary)] text-[var(--text-primary)] font-semibold hover:bg-[var(--bg-accent)] transition-colors"
                >
                  {language === 'en' ? 'Close' : 'बंद'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};