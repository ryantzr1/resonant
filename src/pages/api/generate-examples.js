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
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `The following is a language concept identified for a learner's focus: ${content}. Your task is to create a practical teaching guide that emphasizes:

1. Real-world applications of the concept, illustrating how it’s commonly used in everyday conversations and situations. Focus on scenarios that learners are likely to encounter in daily life or work settings.
2. Explanations of how the concept functions across different contexts, such as making requests, expressing permission, or conveying causation, depending on the concept.
3. Common, widely used phrases or expressions that incorporate this concept. Show how these phrases are used by native speakers, and provide examples with explanations for clarity.
4. Simple and memorable techniques to help learners remember how and when to use this concept effectively. Include any tips or mnemonic devices that make it easier for learners to recall and apply the concept.

Avoid textbook-style content. Instead, ensure the guide is dynamic and accessible, helping learners understand how this concept is applied in practical, real-life situations. 
`,
          },
        ],
        max_tokens: 3000,
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
