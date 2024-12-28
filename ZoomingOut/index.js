import OpenAI from "openai"
import dotenv from "dotenv"

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

async function getActivityIdeas() {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: "Give me a list of activity ideas based on my current location and weather"
            }
        ]
    })

    console.log(response.choices[0].message.content)
}

getActivityIdeas()

/** Response
 * As an AI, I currently do not have access to your geographical location or real-time environmental data. However, I can provide you with activity suggestions tailored to various weather types and locations:

1. Sunny and Warm:
   - Visit the beach
   - Have a picnic at a park
   - Go hiking or biking
   - Tour local attractions

2. Rainy and Cold:
   - Visit a museum or art gallery
   - Check out a local bookstore or library
   - Try a new recipe at home

3. Snowy:
   - Go skiing or snowboarding
   - Build a snowman
   - Visit a local café and enjoy a warm beverage

4. City:
   - Explore new restaurants or cafés
   - View a movie at a local cinema
   - Attend a concert or theatre performance

5. Countryside:
   - Go for a peaceful walk or bike ride
   - Try bird watching or stargazing
   - Visit a local farm or farmers market

For specific suggestions, I would suggest you provide the type of weather and your location details.
 */