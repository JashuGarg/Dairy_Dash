// supabase/functions/parse-voice-command/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

// Add CORS headers to allow requests from your web app
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This is the "Brain" from Step 3
const SYSTEM_PROMPT = `
You are an expert parsing system for a dairy management app called DairyDash.
Your task is to parse a user's voice command (in English, Hindi, or Hinglish) into a single, valid JSON object.
Do NOT include any text, markdown, or explanations outside of the JSON object.

The user can perform 3 actions:
1.  "CREATE_CUSTOMER": Adds a new customer.
2.  "CREATE_DELIVERY": Records a milk delivery for an EXISTING customer.
3.  "CREATE_PAYMENT": Records a payment from an EXISTING customer.

Your JSON output must have an "intent" field and associated data.

---
INTENT: CREATE_CUSTOMER
- Requires: customerName, milkType, liters, rate.
- milkType MUST be 'cow' or 'buffalo'. Default to 'cow' if unspecified.
- Example Input: "Add Rakesh, 2 liters buffalo milk, 60 rupees"
- Example Output: {"intent": "CREATE_CUSTOMER", "customerName": "Rakesh", "milkType": "buffalo", "liters": 2, "rate": 60}

---
INTENT: CREATE_DELIVERY
- Requires: customerName, liters.
- The app will find the customer and use their default milk type/rate.
- Example Input: "Ramesh 2 liter"
- Example Output: {"intent": "CREATE_DELIVERY", "customerName": "Ramesh", "liters": 2}

---
INTENT: CREATE_PAYMENT
- Requires: customerName, amount.
- Example Input: "Sunita ne 150 rupaye diye"
- Example Output: {"intent": "CREATE_PAYMENT", "customerName": "Sunita", "amount": 150}

---
If the intent is unclear, return:
{"intent": "UNKNOWN", "error": "Could not understand. Please try again."}
`;

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    
    if (!GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY environment variable.');
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: `Input: "${text}"` },
              { text: "Output:" },
            ],
          },
        ],
        // Ensure we get clean JSON
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 200,
          temperature: 0,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${await response.text()}`);
    }

    const geminiResult = await response.json();
    // The Gemini response is JSON, and the *content* is also JSON, so we parse it.
    const parsedJson = JSON.parse(geminiResult.candidates[0].content.parts[0].text);

    return new Response(JSON.stringify(parsedJson), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ intent: 'UNKNOWN', error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});