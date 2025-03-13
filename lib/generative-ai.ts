const { GoogleGenerativeAI } = require("@google/generative-ai");
import * as fs from "node:fs";

const genAI = new GoogleGenerativeAI(process.env.GOOLGE_GENERATIVE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const generateTextToText = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateTextAndImageToText = async (
  prompt: string,
  imageUrl: string
) => {
  try {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const contentType = response.headers.get('content-type');
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Data = buffer.toString('base64');
    
    // Create the image part
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: contentType || 'image/jpeg', // Default to jpeg if no content type
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

export { generateTextToText, generateTextAndImageToText };
