import OpenAI from "openai"
import dotenv from "dotenv"
import fs from "fs"
import { getCurrentWeather, getLocation, functions } from "./tools.js"

// Load environment variables from .env file
dotenv.config()

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

/**
 * Goal - build an agent that can get the current weather at my current location
 * and give me some localized ideas of activities I can do.
 */

const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers." },
        { role: "user", content: query }
    ]

    const runner = openai.chat.completions.runTools({
        model: "gpt-3.5-turbo-1106",
        messages,
        functions
    })
    
    const finalContent = await runner.finalContent()
    console.log(finalContent)
}

await agent("What's the current weather in my current location?")

/**
The current weather in New York is sunny with a temperature of 75°F.
 */