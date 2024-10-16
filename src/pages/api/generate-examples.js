import OpenAI from "openai";
import { textToSpeech } from "../../utils/elevenLabsApi";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { content } = req.body;
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `The following is a language concept identified for a learner's focus: ${content}. Your task is to create a concise teaching guide that emphasizes:

            1. Real-world applications of the concept—focus only on practical, common examples used in everyday life or work.
            2. Short explanations on how the concept functions across contexts (e.g., making requests, expressing permission, conveying causation). 
            3. Key phrases incorporating this concept—keep explanations brief, and avoid over-explaining.
            
            Ensure the guide is straightforward, without elaborating unnecessarily. Keep it dynamic and accessible, focusing on practical applications with minimal fillers or textbook-style language.
            `,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const examples = response.choices[0].message.content.trim();
      // lantency issues in severless so will use hardcoded audio url for now
      //   const audioBase64 = await textToSpeech(examples);

      res.status(200).json({
        examples,
        audioUrl:
          "https://www.dropbox.com/scl/fi/dd2x7b4b5a09uq1h0110n/audio_1728683248626.mp3?rlkey=oveoxgs6b7i71goflnoy85bi4&st=zbtfigkt&dl=1", // Use the hardcoded audio URL
      });
    } catch (error) {
      console.error("Error generating examples:", error);
      res.status(500).json({ error: "Error generating examples" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
