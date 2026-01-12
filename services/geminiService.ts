
import { GoogleGenAI, Type } from "@google/genai";
import { SongCategory, RecommendationResponse } from "../types";

export const getMusicRecommendations = async (theme: string): Promise<RecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Recommend exactly 7 songs suitable for a commute (subway or bus) based on this theme/genre: "${theme}".
    Requirement:
    1. Exactly 5 songs must be Korean (K-Pop, K-Indie, K-Ballad, etc.).
    2. Exactly 2 songs must be International (Pop, Rock, Jazz, etc.).
    3. The reasoning should be concise and in Korean, explaining why it's good for a commute.
    4. Provide the response in JSON format.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: 'Song title' },
                artist: { type: Type.STRING, description: 'Artist name' },
                category: { 
                  type: Type.STRING, 
                  enum: [SongCategory.KOREAN, SongCategory.INTERNATIONAL],
                  description: 'Category of the song'
                },
                reason: { type: Type.STRING, description: 'Why this song is recommended for the commute' }
              },
              required: ['title', 'artist', 'category', 'reason']
            }
          }
        },
        required: ['recommendations']
      }
    }
  });

  const text = response.text;
  try {
    return JSON.parse(text) as RecommendationResponse;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("추천 목록을 불러오는 데 실패했습니다.");
  }
};
