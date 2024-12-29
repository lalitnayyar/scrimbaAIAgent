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
const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        { role: "system", content: "You are a helpful AI agent. Give highly specific answers based on the information you're provided. Prefer to gather information with the tools provided to you rather than giving basic, generic answers. show me lat and lon of location also current temperature" },
        { role: "user", content: query }
    ]

    const runner = openai.beta.chat.completions.runFunctions({
        model: "gpt-3.5-turbo-1106",
        messages,
        functions
    }).on("message", (message) => console.log(message))

    const finalContent = await runner.finalContent()

    // Add timestamp to the log entry
    const timestamp = new Date().toISOString()
    const logEntry = `${timestamp} - ${JSON.stringify(finalContent)}\n`
    fs.writeFileSync('log.txt', logEntry, { flag: 'a' })
    console.log(finalContent)
}

await agent("What's the current weather in my current location?")

/**
The current weather in New York is sunny with a temperature of 75°F.
 */