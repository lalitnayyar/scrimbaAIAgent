import OpenAI from "openai"
import dotenv from "dotenv"
import { getCurrentWeather, getLocation ,tools} from "./tools.js"

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
    
    // for (let i = 0; i < MAX_ITERATIONS; i++) {
    //     console.log(`Iteration #${i + 1}`)
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            tools
        })

        // const responseText = response.choices[0].message.content
        console.log(JSON.stringify(response, null, 2))
    }
// }

await agent("What is my current location?")

/**
 * "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_pi9Ot3bWaOqnAOYGosa6uM5s",
            "type": "function",
            "function": {
              "name": "getLocation",
              "arguments": "{}"
            }
          }
        ],
        "refusal": null
      },
      "logprobs": null,
      "finish_reason": "tool_calls"
    }
  ],
 */