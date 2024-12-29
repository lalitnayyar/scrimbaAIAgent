import OpenAI from "openai"
import { getCurrentWeather, getLocation, functions } from "./tools.js"
import { renderNewMessage } from "./dom.js"

export const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
})

const availableFunctions = {
    getCurrentWeather,
    getLocation
}

async function agent(query) {
    const messages = [
        {
            role: "system", content: `
You are a helpful AI agent. Transform technical data into engaging, 
conversational responses, but only include the normal information a 
regular person might want unless they explicitly ask for more. Provide 
highly specific answers based on the information you're given. Prefer 
to gather information with the tools provided to you rather than 
giving basic, generic answers.
`
        },
        { role: "user", content: query }
    ]
    renderNewMessage(query, "user")

    const runner = openai.beta.chat.completions.runFunctions({
        model: "gpt-4-1106-preview",
        messages,
        functions
    }).on("message", (message) => console.log(message))

    const finalContent = await runner.finalContent()
    renderNewMessage(finalContent, "assistant")
}

document.getElementById("form").addEventListener("submit", async function (event) {
    event.preventDefault()
    const inputElement = document.getElementById("user-input")
    inputElement.focus()
    const formData = new FormData(event.target)
    const query = formData.get("user-input")
    event.target.reset()
    await agent(query)
})