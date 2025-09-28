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
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

import express from "express";

import fs from "fs";
import { basePrompt as nodeBasePrompt } from "./defaults/node.js";
import { basePrompt as reactBasePrompt } from "./defaults/react.js";
import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";

dotenv.config();

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    try {
        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [{ text: `${prompt}\n\nSystem: Return either node or react based on what you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra.` }]
            }]
        });

        const answer = result.response.text().trim().toLowerCase(); // react or node

        if (answer === "react") {
            res.json({
                prompts: [
                    BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
                ],
                uiPrompts: [reactBasePrompt]
            });
            return;
        }

        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`
                ],
                uiPrompts: [nodeBasePrompt]
            });
            return;
        }

        res.status(403).json({ message: "You can't access this" });
    } catch (err) {
        console.error("Gemini API error:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(3000);

// async function main() {
//   try {
//     console.log("Sending prompt to Gemini for streaming...\n");
//     console.log("--- Gemini Response (Streaming) ---");

//     // Call the streaming method
//     const responseStream = await ai.models.generateContentStream({
//       model: "gemini-2.5-flash",
//       contents: "Explain how AI works in a few words, and give one fun fact.",
//     });

//     // Iterate over the stream parts and print the text as it arrives
//     for await (const chunk of responseStream) {
//       // FIX: Check if chunk.text is defined before writing it.
//       if (chunk.text) {
//         // Use process.stdout.write to print text without adding a newline
//         // This creates the continuous typing effect
//         process.stdout.write(chunk.text);
//       }
//     }

//     console.log("\n-----------------------------------");

//   } catch (error) {
//     console.error("\nAn error occurred during API call:", error);
//   }
// }

// main();
