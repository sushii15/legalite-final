import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyC38btKI9i_hZfD9VsmVONorbuZ-d173Bs";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

try {
  const models = await genAI.listModels();
  console.log('📋 Available Models:');
  for (const model of models.models) {
    console.log(`  - ${model.name}`);
  }
} catch (err) {
  console.error('❌ Error:', err.message);
}
