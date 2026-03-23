const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * AI Service for analyzing customer complaints using Google Gemini API.
 */
const analyzeComplaint = async (complaintText) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Analyze the following banking customer complaint and return a structured JSON response.
        The JSON should contain:
        1. "category" (e.g., Loan, Fraud, Account, Card, Other)
        2. "sentiment" (e.g., Positive, Neutral, Negative, Urgent)
        3. "priority" (e.g., Low, Medium, High)
        4. "response" (a short, professional, and helpful response for the bank staff to send to the customer).

        Complaint Text: "${complaintText}"

        Respond ONLY with the JSON object.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from response (handling potential markdown formatting)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        throw new Error("Invalid AI response format");
    } catch (error) {
        console.error("Gemini AI Analysis Error:", error);
        // Fallback response structure
        return {
            category: "General",
            sentiment: "Negative",
            priority: "Medium",
            response: "We acknowledge your complaint. A representative will contact you shortly."
        };
    }
};

module.exports = { analyzeComplaint };
