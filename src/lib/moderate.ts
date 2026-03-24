import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface ModerationResult {
  safe: boolean;
  reason?: string;
}

export async function moderateMessage(text: string): Promise<ModerationResult> {
  if (!GEMINI_API_KEY) {
    // No API key = skip moderation in dev
    return { safe: true };
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `You are a content moderator for a quit-vaping support community app. 
Users are anonymous and trying to quit vaping/nicotine. The community should be supportive and safe.

Evaluate the following message and respond with ONLY a JSON object:
{"safe": true} if the message is appropriate
{"safe": false, "reason": "brief reason"} if the message should be shadow-banned

Shadow-ban messages that are:
- Hateful, abusive, or harassing
- Promoting vaping or nicotine use
- Spam or advertising
- Sexually explicit
- Sharing personal contact info (phone numbers, social media handles)
- Glorifying substance use

Do NOT shadow-ban messages that are:
- Expressing frustration about cravings (even with profanity)
- Sharing struggles or setbacks honestly
- Encouraging others
- Asking for help or advice

Message to evaluate: "${text.replace(/"/g, '\\"')}"

Respond with ONLY the JSON object, nothing else.`;

    const result = await model.generateContent(prompt);
    let response = result.response.text().trim();
    
    // Strip markdown code fences if Gemini wraps the response
    response = response.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    
    const parsed = JSON.parse(response);
    return {
      safe: parsed.safe === true,
      reason: parsed.reason,
    };
  } catch (error) {
    console.error('Moderation error:', error);
    // Fail open — don't block messages if moderation fails
    return { safe: true };
  }
}
