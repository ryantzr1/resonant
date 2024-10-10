import OpenAI from "openai";
import { textToSpeech } from "../../utils/elevenLabsApi";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { content } = req.body;
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: `Based on the language concept identified, which is: ${content}, generate comprehensive examples and explanations for better understanding. Include various sentences and exercises in both English and the identified language, focusing on key uses and nuances.`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      });

      const examples = response.choices[0].message.content.trim();

      const audioBase64 = await textToSpeech(examples);

      res
        .status(200)
        .json({ examples, audioUrl: `data:audio/mpeg;base64,${audioBase64}` });
    } catch (error) {
      console.error("Error generating examples:", error);
      res.status(500).json({ error: "Error generating examples" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
