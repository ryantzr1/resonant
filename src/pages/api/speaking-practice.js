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
            content: `Create a speaking practice prompt on this topic: "${content}". Engage in a 1:1 conversation that encourages the user to form sentences, ask questions, and receive corrections. Start with a prompt and be ready to respond interactively.`,
          },
        ],
        max_tokens: 1000,
        temperature: 0.8,
      });

      const prompt = response.choices[0].message.content.trim();
      const audioBase64 = await textToSpeech(prompt);

      res
        .status(200)
        .json({ prompt, audioUrl: `data:audio/mpeg;base64,${audioBase64}` });
    } catch (error) {
      console.error("Error starting speaking practice:", error);
      res.status(500).json({ error: "Error starting speaking practice" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
