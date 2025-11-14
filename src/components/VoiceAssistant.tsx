import { useState, useEffect, useCallback } from 'react'; // --- FIX: Added useCallback
import { Mic, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase'; // Import supabase client
import { useCustomer } from '../contexts/CustomerContext'; // Import customer context
import { paymentService } from '../lib/paymentService'; // Import payment service
import { deliveryCalendarService } from '../lib/deliveryCalendarService';
import { useAuth } from '../contexts/AuthContext'; // To get user ID

// --- Define the shape of a conversation turn ---
interface ConversationTurn {
  role: 'user' | 'model';
  text: string;
}

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

  // --- FIX: Add state to manage the conversation history ---
  const [conversationHistory, setConversationHistory] = useState<ConversationTurn[]>([]);

  // --- Get Supabase hooks ---
  const { user } = useAuth();
  const { createCustomer, customers, fetchCustomers } = useCustomer(); // We need 'customers' to find IDs

  useEffect(() => {
    // Update language for speech recognition
    if (recognition) {
      recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    }
    // Update status text if not busy
    if (!isListening && !isProcessing && !transcript && conversationHistory.length === 0) {
      setStatusText(language === 'en' ? 'Voice Assistant' : 'आवाज सहायक');
    }
  }, [language, isListening, isProcessing, transcript, conversationHistory]);


  const suggestions = [
    { en: 'Add Rakesh — 2L buffalo milk', hi: 'राकेश जोड़ें — 2L भैंस का दूध' },
    { en: 'Bill for Sunita', hi: 'सुनीता के लिए बिल' },
    { en: 'Tomorrow milk prediction?', hi: 'कल का दूध पूर्वानुमान?' },
    { en: 'Show outstanding payments', hi: 'बकाया भुगतान दिखाएं' },
  ];

  // --- Main Function to Handle Speech ---
  // --- FIX: Wrapped in useCallback to get correct state in useEffect ---
  const handleSpeechResult = useCallback(async (speechTranscript: string) => {
    setTranscript("${speechTranscript}");
    setIsProcessing(true);
    setStatusText(language === 'en' ? 'Processing...' : 'प्रोसेस हो रहा है...');
    setIsListening(false);

    // --- FIX: Create new history with the user's turn ---
    const newUserTurn: ConversationTurn = { role: 'user', text: speechTranscript };
    const newHistory = [...conversationHistory, newUserTurn];

    try {
      // 1. Call our new Supabase function with the correct body
      const { data, error } = await supabase.functions.invoke('process-speech', {
        // --- FIX: Send the 'conversation' array ---
        body: { conversation: newHistory },
      });

      if (error) throw error;

      console.log('Got JSON from Gemini:', data);
      const aiResponseJson = data; // 'data' is already the parsed JSON

      // --- FIX: Create the AI's turn to add to history ---
      const aiTurn: ConversationTurn = {
        role: 'model', // Gemini API role is 'model'
        text: aiResponseJson.response_message,
      };

      // 2. Decide what to do with the JSON
      if (!user) throw new Error('User not found');

      // --- FIX: Handle 'incomplete' status for follow-up questions ---
      if (aiResponseJson.status === 'complete') {
        const resultMessage = await executeDatabaseAction(aiResponseJson.action, aiResponseJson.payload);
        setStatusText(resultMessage);

        // Action is done, clear history and schedule close
        setConversationHistory([]); // Clear history
        setIsProcessing(false);

        setTimeout(() => {
          if (isExpanded) { // Only close if it's still open
            setIsExpanded(false);
            setTranscript('');
          }
        }, 3000);

      } else { // status === 'incomplete'
        // AI is asking a follow-up question
        setStatusText(aiResponseJson.response_message);
        // Save history so the next turn has context
        setConversationHistory([...newHistory, aiTurn]);
        setIsProcessing(false);
        // Automatically start listening for the answer
        setTimeout(() => toggleListen(), 500);
      }

    } catch (err: any) {
      console.error('Action Error:', err);
      const errorMsg = err.message || "An error occurred";
      setStatusText(errorMsg.includes('Customer') ? errorMsg : (language === 'en' ? 'Action failed' : 'कार्रवाई विफल'));
      setIsProcessing(false);
      // Clear history on failure
      setConversationHistory([]);
    }
    // --- FIX: Removed 'finally' block, as logic is now handled in 'complete'/'incomplete' blocks ---
  }, [
    // --- FIX: Added all dependencies handleSpeechResult needs ---
    conversationHistory,
    language,
    user,
    customers,
    createCustomer,
    fetchCustomers,
    isExpanded,
  ]);

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
      if (!isProcessing && !transcript && conversationHistory.length === 0) {
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

    // --- FIX: The dependency array now correctly points to the memoized handleSpeechResult ---
    // This ensures the listeners are only re-attached if language or the handler function itself changes.
  }, [language, handleSpeechResult, isProcessing, transcript, conversationHistory.length]);

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
        // Handle cases where recognition is already running
        if (err.name === 'InvalidStateError') {
          setIsListening(false);
        }
      }
    }
  };

  const toggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false);
      if (isListening) recognition.stop();
      setIsProcessing(false);
      setTranscript('');
      // --- FIX: Clear history when manually closing ---
      setConversationHistory([]);
    } else {
      setIsExpanded(true);
      toggleListen(); // Automatically start listening when opened
    }
  };

  // --- Helpers for DB actions ---
  // (This section is unchanged, but I've included it for completeness)
  const findCustomer = (name: string) => {
    if (!name) return undefined;
    const needle = name.toLowerCase();
    return customers.find(c => (c.name || '').toLowerCase().includes(needle) || (c.phone || '').includes(name));
  };

  const executeDatabaseAction = async (action: string, payload: any): Promise<string> => {
    if (!user) throw new Error('User not found');

    switch (action) {
      case 'create_customer': {
        // Provide defaults for missing fields to avoid DB constraint errors
        const created = await createCustomer({
          name: payload.name || 'Unnamed',
          phone: payload.phone || '',
          milk_type: payload.milk_type || 'cow',
          daily_liters: payload.daily_liters || 1,
          rate_per_liter: payload.rate_per_liter || 70,
          outstanding_amount: payload.outstanding_amount || 0,
          payment_status: 'unpaid' as 'paid' | 'unpaid',
          // optional/system defaults
          start_date: payload.start_date || new Date().toISOString().split('T')[0],
          skipped_dates: payload.skipped_dates || [],
          billing_cycle: payload.billing_cycle || 'monthly',
        });

        // Refresh list
        try { await fetchCustomers(); } catch (e) { /* ignore */ }

        return language === 'en'
          ? `Added customer ${created.name}`
          : `ग्राहक ${created.name} जोड़ा गया`;
      }

      case 'log_delivery':
      case 'log_skipped_delivery': {
        const customer = findCustomer(payload.customer_name || payload.name || '');
        if (!customer) throw new Error(language === 'en' ? `Customer '${payload.customer_name}' not found.` : `ग्राहक '${payload.customer_name}' नहीं मिला।`);

        await deliveryCalendarService.updateDeliveryStatus(
          user.id,
          customer.id,
          payload.delivery_date,
          payload.status,
          payload.status === 'delivered' ? (payload.liters_delivered || customer.daily_liters) : 0,
          payload.notes
        );

        return language === 'en'
          ? `${payload.status === 'delivered' ? 'Logged delivery for' : 'Marked skipped for'} ${customer.name}`
          : `${customer.name} के लिए ${payload.status === 'delivered' ? 'डिलीवरी दर्ज की गई' : 'स्किप मार्क किया गया'}`;
      }

      case 'log_payment': {
        const customer = findCustomer(payload.customer_name || payload.name || '');
        if (!customer) throw new Error(language === 'en' ? `Customer '${payload.customer_name}' not found.` : `ग्राहक '${payload.customer_name}' नहीं मिला।`);

        await paymentService.createPayment(user.id, {
          customer_id: customer.id,
          amount: payload.amount,
          payment_date: payload.payment_date,
          payment_method: payload.payment_method || 'cash',
          reference_id: payload.reference_id,
          notes: payload.notes,
        });

        return language === 'en'
          ? `Added payment for ${customer.name}`
          : `${customer.name} के लिए भुगतान जोड़ा गया`;
      }

      case 'check_bill': {
        // optional: compute bill and return summary text
        const customer = findCustomer(payload.customer_name || payload.name || '');
        if (!customer) return language === 'en' ? "Customer not found for bill" : 'बिल के लिए ग्राहक नहीं मिला';
        try {
          const summary = await deliveryCalendarService.calculateBill(customer.id);
          return language === 'en'
            ? `Bill for ${customer.name}: ₹${summary.calculated_bill}`
            : `${customer.name} के लिए बिल: ₹${summary.calculated_bill}`;
        } catch (err) {
          return language === 'en' ? 'Failed to calculate bill' : 'बिल गणना विफल';
        }
      }

      default:
        return language === 'en' ? "Sorry, I didn't understand that command." : 'क्षमा करें, मैं वह आदेश नहीं समझ सका।';
    }
  };

  // --- FIX: Updated suggestion prompt logic ---
  const showSuggestions = !isListening && !isProcessing && !transcript && conversationHistory.length === 0;

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
                  {/* --- FIX: Show transcript or suggestion prompt --- */}
                  {transcript || (showSuggestions ? (language === 'en' ? 'Try saying...' : 'कहने का प्रयास करें...') : ' ')}
                </p>
              </div>

              {/* Suggestions */}
              {showSuggestions && (
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