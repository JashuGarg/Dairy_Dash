// 1. NO MORE http/server IMPORT
import { VertexAI } from 'npm:@google-cloud/vertexai';

// --- CONFIGURATION ---
const PROJECT_ID = Deno.env.get("PROJECT_ID")!; // Switched to all caps, which is standard
const CLIENT_EMAIL = Deno.env.get("CLIENT_EMAIL")!;
const PRIVATE_KEY = Deno.env.get("PRIVATE_KEY")!.replace(/\\n/g, '\n');

const LOCATION = "us-central1";
const MODEL_NAME = "gemini-2.5-flash"; // Our working model

// --- PROMPT ENGINEERING ---
const systemPrompt = `
  You are a data entry assistant for a milk delivery app called DairyDash.
  The user will give you a voice command in English or Hindi.
  Your ONLY job is to extract the entities and return a valid JSON object.
  Do not add any conversational text, just the JSON.

  You must identify one of the following actions:
  1. 'create_customer': When the user wants to add a new customer.
  2. 'create_delivery': When the user wants to add a milk delivery.
  3. 'create_payment': When the user logs a payment.
  4. 'unknown': If the command is unclear or not one of the above.

  JSON Formats:

  1. For adding a customer:
     {
       "action": "create_customer",
       "payload": {
         "name": "Ramesh Kumar",
         "phone": "9876543210",
         "milk_type": "cow", 
         "daily_liters": 2,
         "rate_per_liter": 65,
         "outstanding_amount": 0 
       }
     }
     (Note: 'outstanding_amount' should be 0 for new customers.)

  2. For adding a delivery:
     {
       "action": "create_delivery",
       "payload": {
         "customer_name": "Ramesh", 
         "liters_delivered": 2,
         "delivery_date": "YYYY-MM-DD" 
       }
     }
     (Note: Always use today's date for 'delivery_date' unless specified.)

  3. For logging a payment:
     {
       "action": "create_payment",
       "payload": {
         "customer_name": "Sunita",
         "amount": 500,
         "payment_date": "YYYY-MM-DD"
       }
     }
     (Note: Always use today's date for 'payment_date' unless specified.)

  If a name is mentioned (like "Ramesh" or "Sunita"), include it as 'customer_name'.
  The app will find the customer's ID later.
  Today's date is: ${new Date().toISOString().split('T')[0]}
`;

// Initialize Vertex AI Client
const vertex_ai = new VertexAI({
  project: PROJECT_ID,
  location: LOCATION,
  googleAuthOptions: {
    credentials: {
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    },
  },
});

const model = vertex_ai.getGenerativeModel({ model: MODEL_NAME });

// --- THE SERVER ---
// 3. Use the modern 'Deno.serve'
Deno.serve(async (req) => {
  // Add CORS headers for local development
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const { prompt } = await req.json();
    if (!prompt) {
      throw new Error("No prompt provided.");
    }

    const request = {
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        { role: 'user', parts: [{ text: prompt }] }
      ],
    };

    const result = await model.generateContent(request);
    const response = result.response;

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response from Gemini.");
    }

    const jsonText = response.candidates[0].content.parts[0].text;
    const cleanedJsonText = jsonText.replace(/```json\n?|\n?```/g, "").trim();
    const data = JSON.parse(cleanedJsonText);

    return new Response(
      JSON.stringify(data),
      { headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Add CORS header
        } 
      },
    );

  } catch (error) {
    console.error("Error processing speech:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // Add CORS header
        } 
      },
    );
  }
});