const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const listModels = async () => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (!data.models) {
            console.log('No models found in response:', JSON.stringify(data));
            return;
        }

        console.log('Available Flash models:');
        data.models.filter(m => m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent'))
                   .forEach(m => console.log(`- ${m.name}`));

        console.log('\nOther suitable models (generateContent supported):');
        data.models.filter(m => !m.name.includes('flash') && m.supportedGenerationMethods.includes('generateContent'))
                   .forEach(m => console.log(`- ${m.name}`));

    } catch (error) {
        console.error('Error listing models:', error);
    }
};

listModels();
