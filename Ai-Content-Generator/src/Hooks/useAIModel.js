import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_KEY||"AIzaSyClkC6-lvp6Y2_PQ48SX807Gfq6B70Czsg";
const genAI = new GoogleGenerativeAI(apiKey);

export const useAIModel = () => {
  const generate = async (prompt) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      return "Error generating content. Try again!";
    }
  };

  return { generate };
};


