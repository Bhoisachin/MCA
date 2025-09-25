
import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult, CommentAnalysis, Sentiment } from '../types';

// Ensure process.env.API_KEY is available. This is a hard requirement.
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface InputComment {
  id: number;
  comment: string;
  stakeholderType?: string;
}

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        comments: {
            type: Type.ARRAY,
            description: "An array of analysis objects for each stakeholder comment.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: {
                        type: Type.INTEGER,
                        description: "A unique identifier for the comment, matching its position in the input array (0-indexed)."
                    },
                    sentiment: {
                        type: Type.STRING,
                        description: "The sentiment of the comment.",
                        enum: ['Positive', 'Negative', 'Neutral']
                    },
                    summary: {
                        type: Type.STRING,
                        description: "A concise 1-2 sentence summary of the original comment."
                    },
                    themes: {
                        type: Type.ARRAY,
                        description: "A list of 2-4 key themes or topics mentioned in the comment.",
                        items: { type: Type.STRING }
                    }
                },
                required: ["id", "sentiment", "summary", "themes"]
            }
        }
    },
    required: ["comments"]
};

export async function analyzeFeedback(comments: InputComment[]): Promise<AnalysisResult> {
  const model = 'gemini-2.5-flash';
  
  const commentsForApi = comments.map(({ id, comment }) => ({ id, text: comment }));
  const commentsJson = JSON.stringify(commentsForApi, null, 2);

  const prompt = `
    You are an expert policy analyst for a government agency. Your task is to analyze stakeholder feedback provided in a JSON array. Each object in the array has an "id" and a "text" field representing a single comment.
    For each comment object, perform the following actions on its "text" value:
    1.  **Sentiment Analysis:** Classify the sentiment as 'Positive', 'Negative', or 'Neutral'.
    2.  **Summarization:** If the comment is long, summarize it into 1-2 clear sentences. If it's short, keep the summary brief.
    3.  **Theme Extraction:** Identify and extract 2-4 key themes or topics.

    Return a single JSON object that strictly adheres to the provided schema. The output should contain a "comments" array. Each object in this array must include the original comment's ID, its sentiment, a summary, and a list of its themes.

    Here is the list of comments to analyze:
    ${commentsJson}
  `;

  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    const jsonText = response.text;
    const parsedJson = JSON.parse(jsonText);

    if (!parsedJson.comments || !Array.isArray(parsedJson.comments)) {
        throw new Error("Invalid JSON structure received from API.");
    }
    
    const commentAnalyses: CommentAnalysis[] = parsedJson.comments.map((item: any) => {
      const originalInput = comments.find(c => c.id === item.id);
      if (!originalInput) return null;

      return {
        id: item.id,
        originalComment: originalInput.comment,
        stakeholderType: originalInput.stakeholderType,
        sentiment: item.sentiment as Sentiment,
        summary: item.summary,
        themes: item.themes,
      };
    }).filter((item): item is CommentAnalysis => item !== null);
    
    // Calculate overall themes
    const themeCounts: { [key: string]: number } = {};
    commentAnalyses.forEach(c => {
        c.themes.forEach(theme => {
            const normalizedTheme = theme.trim().toLowerCase();
            themeCounts[normalizedTheme] = (themeCounts[normalizedTheme] || 0) + 1;
        });
    });

    const overallThemes = Object.entries(themeCounts)
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Top 15 themes


    return { comments: commentAnalyses, overallThemes };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not analyze feedback due to an API error.");
  }
}
