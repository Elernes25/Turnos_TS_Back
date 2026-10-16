import {GoogleGenerativeAI} from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY as string;

if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

export const genIA = new GoogleGenerativeAI(apiKey).
    getGenerativeModel({model: "gemini-1.5-flash"});

