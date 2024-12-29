export async function getCurrentWeather({ location }) {
 
    const weather = {
        location,
        temperature: "70",
        forecast: "sunny"
    }
    return JSON.stringify(weather)
}

export async function getLocation() {
    try {
        const response = await fetch('http://ip-api.com/json')
        const text = await response.json()
        console.log(text.lat)
        return JSON.stringify(text)
    } catch (err) {
        console.log(err)
    }
}

export const functions = [
    {
        function: getCurrentWeather,
        parameters: {
            type: "object",
            properties: {
                location: {
                    type: "string",
                    description: "The location from where to get the weather"
                }
            },
            required: ["location"]
        }
    },
    {
        function: getLocation,
        parameters: {
            type: "object",
            properties: {}
        }
    },
]