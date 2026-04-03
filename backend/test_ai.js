const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const testChat = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
        const result = await model.generateContent("Say hello!");
        console.log('AI Response:', result.response.text());
    } catch (error) {
        console.error('AI Test Error:', error.message);
    }
};

testChat();
