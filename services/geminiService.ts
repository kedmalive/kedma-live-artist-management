
import { GoogleGenAI, Type } from "@google/genai";
import { ARTISTS_DATA } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export interface RecommendationResponse {
  artistId: number;
  reason: string;
}

export const getArtistRecommendation = async (userPrompt: string): Promise<RecommendationResponse | null> => {
  if (!process.env.API_KEY) return null;

  try {
    const artistListText = ARTISTS_DATA.map(a => `ID: ${a.id}, Name: ${a.name}, Category: ${a.category}, Description: ${a.description}`).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are an expert booking agent for Kedma Live. Based on the following user request for an event, suggest the SINGLE best artist from our list.
      
      User Request: "${userPrompt}"
      
      Artist List:
      ${artistListText}
      
      Return ONLY a JSON object with the artistId and a short reason (in Hebrew) why they fit.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artistId: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["artistId", "reason"]
        }
      },
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text.trim());
    }
    return null;
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};
