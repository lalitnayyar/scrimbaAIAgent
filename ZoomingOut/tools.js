export async function getCurrentWeather() {
    const weather = {
        temperature: "72",
        unit: "F",
        forecast: "sunny"
    }
    return JSON.stringify(weather)
}

export async function getLocation() {
    return "Salt Lake City, UT"
}

export const tools = [
    {
        type: "function",
        function: {
            name: "getCurrentWeather",
            description: "Get the current weather",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
    {
        type: "function",
        function: {
            name: "getLocation",
            description: "Get the user's current location",
            parameters: {
                type: "object",
                properties: {}
            }
        }
    },
]