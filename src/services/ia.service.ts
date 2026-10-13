import {GoogleGenerativeAI} from "google/generative-ai";

const genIA = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const modelGemini = genIA.getgenerativeAIModel({model: "gemini-1.5-flash"});

