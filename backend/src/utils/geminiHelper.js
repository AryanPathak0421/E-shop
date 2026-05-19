const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

exports.generateResponse = async (userMessage, intent, dbResults) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      // Graceful fallback for unconfigured API key
      return "I apologize, but my AI assistant features are currently in offline mode (API key is not configured). However, I can confirm we have wonderful products ready in our store for you!";
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a helpful, professional, and friendly AI store assistant for our MERN E-Commerce platform.
A customer asked: "${userMessage}"
Detected Intent: ${intent}

Here is the 100% accurate, real-time database results answering their query:
\"\"\"
${dbResults}
\"\"\"

CRITICAL SECURITY & VALIDATION RULES:
1. Ground your response STRICTLY in the database results provided above. DO NOT make up products, pricing, or stock quantities under any circumstance.
2. If the database results indicate no items were found, are empty ("No results found" / "No products found"), or the product name in the query doesn't match anything, say: "Sorry, we don't have that product in our catalog."
3. If the database results indicate that a matching product's stock is 0 (or "OUT OF STOCK"), say: "Unfortunately, [Product Name] is currently out of stock."
4. If there are multiple products matching a broad search query and the results return multiple entries, start your response with: "I found multiple products matching your search..." and list them with their prices.
5. If the user message is empty, contains only gibberish, or is completely unclear, politely ask them for clarification.
6. Keep the response concise, natural, and friendly. Do not output raw JSON or internal database IDs. Format prices nicely (e.g. $19.99).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || 'I apologize, but I could not generate a response at this time.';
  } catch (error) {
    console.error('Gemini API error:', error);
    // Graceful fallback on API service failure
    return 'I apologize, but I am currently experiencing issues connecting to my AI service. Please try again in a moment or ask a general query!';
  }
};