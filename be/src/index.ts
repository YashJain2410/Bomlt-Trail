// import { GoogleGenAI } from "@google/genai";
// import * as dotenv from "dotenv"; // Use * as dotenv for ESM projects

// // Load environment variables from the .env file
// dotenv.config();

// // The API Key is automatically picked up from the environment variable 
// // process.env.GEMINI_API_KEY, but it's good practice to pass it explicitly 
// // or ensure it's available.
// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });

// /**
//  * Runs a simple content generation request using the Gemini model.
//  */
// async function main() {
//   try {    
//     // Call the generateContent method
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: "Explain how AI works in a few words, and give one fun fact.",
//     });

//     // Log the generated text content
//     console.log("\n--- Gemini Response ---");
//     console.log(response.text);
//     console.log("-----------------------\n");

//   } catch (error) {
//     console.error("An error occurred during API call:", error);
//   }
// }

// // Execute the main function
// main();

import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize the AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    console.log("Sending prompt to Gemini for streaming...\n");
    console.log("--- Gemini Response (Streaming) ---");

    // Call the streaming method
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: "Explain how AI works in a few words, and give one fun fact.",
    });

    // Iterate over the stream parts and print the text as it arrives
    for await (const chunk of responseStream) {
      // FIX: Check if chunk.text is defined before writing it.
      if (chunk.text) {
        // Use process.stdout.write to print text without adding a newline
        // This creates the continuous typing effect
        process.stdout.write(chunk.text);
      }
    }
    
    console.log("\n-----------------------------------"); 

  } catch (error) {
    console.error("\nAn error occurred during API call:", error);
  }
}

main();