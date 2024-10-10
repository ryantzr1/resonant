import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import pdf from "pdf-parse";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const extractedContents = {};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const tempDir = path.join(process.cwd(), "temp_uploads");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const fileName = path.join(tempDir, "uploaded.pdf");
      const fileStream = fs.createWriteStream(fileName);

      req.pipe(fileStream);

      await new Promise((resolve, reject) => {
        fileStream.on("finish", resolve);
        fileStream.on("error", reject);
      });

      const dataBuffer = fs.readFileSync(fileName);
      const extractedData = await pdf(dataBuffer);
      const extractedText = extractedData.text;
      if (!extractedText.trim()) {
        throw new Error(
          "No text could be extracted from the PDF. Please try with a different document."
        );
      }

      const systemPrompt = `You will receive text extracted from a PDF. Identify the primary language being used and any specific language concepts being discussed, such as grammar rules, verb conjugations, or idioms. Provide a summary of these concepts and specify the language.`;

      const gptResponse = await client.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: extractedText,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const summarizedContent = gptResponse.choices[0].message.content;

      const uniqueId = Date.now().toString();
      extractedContents[uniqueId] = summarizedContent;

      fs.unlinkSync(fileName);
      res
        .status(200)
        .json({ extractedContent: extractedContents[uniqueId], uniqueId });
    } catch (error) {
      console.error("Error parsing PDF:", error);
      res.status(500).json({ error: "Error parsing PDF" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
