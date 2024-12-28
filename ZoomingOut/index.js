import OpenAI from "openai"
import dotenv from "dotenv"
import fs from "fs"
import { getCurrentWeather, getLocation, tools } from "./tools.js"

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

    const MAX_ITERATIONS = 5

    for (let i = 0; i < MAX_ITERATIONS; i++) {
        console.log(`Iteration #${i + 1}`)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            tools
        })

        const { finish_reason: finishReason, message } = response.choices[0]
        const { tool_calls: toolCalls } = message
        console.log(toolCalls)

        // Add timestamp to the log entry
        const timestamp = new Date().toISOString()
        const logEntry = `${timestamp} - ${JSON.stringify(toolCalls)}\n`
        fs.writeFileSync('log.txt', logEntry, { flag: 'a' })

        messages.push(message)

        if (finishReason === "stop") {
            console.log(message.content)
            console.log("AGENT ENDING")
            return
        } else if (finishReason === "tool_calls") {
            for (const toolCall of toolCalls) {
                const functionName = toolCall.function.name
                const functionToCall = availableFunctions[functionName]
                const functionArgs = JSON.parse(toolCall.function.arguments)
                const functionResponse = await functionToCall(functionArgs)
                console.log(functionResponse)
                // Add timestamp to the log entry
                const timestamp = new Date().toISOString()
                const logEntry = `${timestamp} - ${JSON.stringify(functionResponse)}\n`
                fs.writeFileSync('log.txt', logEntry, { flag: 'a' })
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: functionResponse
                })
            }
        }

    }
}

await agent("What's the current weather in my current location?")