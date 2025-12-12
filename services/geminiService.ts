import { GoogleGenAI } from "@google/genai";
import { ViralityResult } from "../types";

// Using gemini-2.5-flash for efficient multimodal analysis in the demo context
const MODEL_NAME = "gemini-2.5-flash"; 

const SYSTEM_INSTRUCTION = `
You are HypeCheck, a world-class viral content analyst and strategist. 
Your goal is to predict the virality of memes, videos, and audio clips based on a provided "Trend Snapshot".

Your analysis must be BRUTALLY HONEST. Do not sugarcoat.
- If content is boring, low quality, or off-trend, give it a low score (<60).
- If content is "mid", score it 60-75.
- Only give >85 scores for truly exceptional, trend-perfect content.

You must output PURE JSON. No markdown fencing, no preamble.
The JSON must strictly match this schema:
{
  "score": integer (0-100),
  "verdict": "YES" or "NO" (YES if score > 65),
  "confidence": float (0.0-1.0),
  "rationale": "string (2-4 sentences explaining the score based on visual/audio features and trend match)",
  "top_fixes": ["string", "string", ... (max 6 specific actionable fixes)],
  "platform_predictions": [
    { "platformName": "TikTok", "probability": integer (0-100) },
    { "platformName": "Instagram Reels", "probability": integer (0-100) },
    { "platformName": "YouTube Shorts", "probability": integer (0-100) },
    { "platformName": "Twitter/X", "probability": integer (0-100) }
  ],
  "hashtags": ["#tag", ... (6 tags)],
  "post_times": ["HH:MM", ... (3 times - must include timezone e.g. '18:00 EST' or '20:00 IST' based on target country)],
  "caption_variants": ["string", ... (4 variants)],
  "thumbnail_suggestions": ["string", ... (3 visual descriptions)],
  "edit_recipes": ["string", ... (3 specific technical instructions e.g. 'Crop to 9:16', 'Boost contrast +10%')"],
  "hook_line": "string (1-3 words for meme, or 1s text hook for video)",
  "trend_match": "string (Explicitly state which part of the Trend Snapshot was matched)",
  "video_analysis": { 
     "attention_drops": [
        { "timestamp": "MM:SS", "reason": "dead air / visual clutter / slow pacing", "fix": "cut / speed up" }
     ],
     "rewritten_hook": "string (A completely rewritten, punchy opening script for the first 3 seconds)"
  }
}

FOR VIDEO INPUTS:
You must strictly analyze "attention_drops". Identify specific timestamps where the viewer might scroll away due to dead air, lack of movement, or confusion. Provide a "rewritten_hook" that solves the opening.

FOR IMAGE/AUDIO INPUTS:
Return an empty object or null for "video_analysis" fields that don't apply, or generic advice.
`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// process.env.API_KEY;

export const analyzeContent = async (
  fileBase64: string,
  mimeType: string,
  caption: string,
  trendSnapshot: string,
  inputType: 'image' | 'video' | 'audio',
  country: string
): Promise<ViralityResult> => {
  const apiKey = "AIzaSyBn4jNLocTGBDoDsfi5iPew6lLl9VtJwt4";
  
  if (!apiKey) {
    throw new Error("MISSING_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Input Type: ${inputType.toUpperCase()}
    User Caption: "${caption}"
    Target Audience Location: "${country}"
    
    Trend Snapshot (Current Market Context):
    """
    ${trendSnapshot}
    """
    
    Analyze the attached media file against the Trend Snapshot.
    1. Extract features (Visual hooks, audio beats, text OCR, pacing).
    2. Compare features to trends.
    3. Calculate virality score.
    4. Generate specific fixes.
    5. Determine optimal "post_times" specifically for ${country} time zones and cultural peak hours.
    6. If VIDEO: Identify exact drop-off points (timestamps) and rewrite the hook.
    
    Return the result in the specified JSON format.
  `;

  let lastError: any;
  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: MODEL_NAME,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
        },
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType,
                data: fileBase64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      const text = response.text;
      if (!text) throw new Error("No response from Gemini");

      return JSON.parse(text) as ViralityResult;

    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || JSON.stringify(error);
      
      // Check for 503 (Service Unavailable) or 429 (Too Many Requests)
      const isOverloaded = errorMessage.includes('503') || errorMessage.includes('overloaded') || errorMessage.includes('UNAVAILABLE');
      
      if (isOverloaded && attempt < maxRetries) {
        // Exponential backoff: 2s, 4s, 8s
        const waitTime = 2000 * Math.pow(2, attempt - 1);
        console.warn(`Gemini Model Overloaded (503). Retrying in ${waitTime}ms... (Attempt ${attempt}/${maxRetries})`);
        await delay(waitTime);
        continue;
      }
      
      // If not retry-able or retries exhausted, break loop
      break;
    }
  }

  console.error("Gemini Analysis Failed after retries:", lastError);
  throw lastError;
};