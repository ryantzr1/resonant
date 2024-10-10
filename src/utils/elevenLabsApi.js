// utils/elevenLabsApi.js
import axios from "axios";

const XI_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

export async function getVoices() {
  const url = "https://api.elevenlabs.io/v1/voices";
  const headers = {
    Accept: "application/json",
    "xi-api-key": XI_API_KEY,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(url, { headers });
    return response.data.voices;
  } catch (error) {
    console.error("Error fetching voices:", error);
    throw error;
  }
}

export async function textToSpeech(text) {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;
  const headers = {
    Accept: "application/json",
    "xi-api-key": XI_API_KEY,
    "Content-Type": "application/json",
  };
  const data = {
    text,
    model_id: "eleven_multilingual_v2",
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true,
    },
  };

  try {
    const response = await axios.post(url, data, {
      headers,
      responseType: "arraybuffer",
    });
    return Buffer.from(response.data, "binary").toString("base64");
  } catch (error) {
    console.error("Error converting text to speech:", error);
    throw error;
  }
}
