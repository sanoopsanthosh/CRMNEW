import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateCarDescription = async (make: string, model: string, year: number, features: string): Promise<string> => {
  if (!apiKey) return "API Key missing. Please configure your API key.";
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a compelling, professional, and exciting sales description (max 80 words) for a used car showroom listing.
      Car: ${year} ${make} ${model}.
      Key Features/Notes: ${features}.
      Focus on value, driving experience, and condition.`,
    });
    return response.text || "No description generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please try again.";
  }
};

export const generateLeadEmail = async (leadName: string, carDetails: string, status: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Draft a professional and polite email from a car dealership sales agent to a customer.
      Customer Name: ${leadName}
      Context: They are interested in: ${carDetails}.
      Current Status: ${status}.
      Goal: Encourage them to book a test drive or finalize the deal. Keep it under 150 words.`,
    });
    return response.text || "No email generated.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate email.";
  }
};

export const generateCarImage = async (prompt: string): Promise<string | null> => {
  if (!apiKey) return null;

  try {
    // Using the 2.5 flash image model (nano banana) as per instructions for general image gen
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `A realistic, high-quality photo of a car: ${prompt}. Photorealistic, showroom lighting, 4k.` }
        ]
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    return null;
  }
};