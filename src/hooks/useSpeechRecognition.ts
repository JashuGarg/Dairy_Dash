import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Access the browser's SpeechRecognition API
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = SpeechRecognition ? new SpeechRecognition() : null;

export const useSpeechRecognition = () => {
  const { language } = useLanguage();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Use a ref to hold the recognition instance
  const recognitionRef = useRef(mic);

  useEffect(() => {
    if (!recognitionRef.current) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }
    const recognition = recognitionRef.current;
    
    // Set language based on app's context
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = true; // Show results as you speak

    // Event when speech is recognized
    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }
      setTranscript(finalTranscript || interimTranscript);
    };

    // Event when listening stops
    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error);
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return { 
    isListening, 
    transcript, 
    error, 
    startListening, 
    stopListening, 
    hasSupport: !!mic 
  };
};