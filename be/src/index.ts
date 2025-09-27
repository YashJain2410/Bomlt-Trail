import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv"; // Use * as dotenv for ESM projects

// Load environment variables from the .env file
dotenv.config();

// The API Key is automatically picked up from the environment variable 
// process.env.GEMINI_API_KEY, but it's good practice to pass it explicitly 
// or ensure it's available.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

/**
 * Runs a simple content generation request using the Gemini model.
 */
async function main() {
  try {    
    // Call the generateContent method
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words, and give one fun fact.",
    });

    // Log the generated text content
    console.log("\n--- Gemini Response ---");
    console.log(response.text);
    console.log("-----------------------\n");

  } catch (error) {
    console.error("An error occurred during API call:", error);
  }
}

// Execute the main function
main();