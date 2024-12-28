import OpenAI from "openai"
import dotenv from "dotenv"
import { getCurrentWeather, getLocation } from "./tools.js"

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

// Call a function to get the current location and the current weather
const weather = await getCurrentWeather()
const location = await getLocation()

async function getActivityIdeas() {
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            {
                role: "user",
                content: `Give me a list of activity ideas based on my current location of ${location} and weather of ${weather}`
            }
        ]
    })

    console.log(response.choices[0].message.content)
}

getActivityIdeas()

/**
 * Output:
 * 1. Visiting the Great Salt Lake: Enjoy this nearby natural wonder, go for a swim or enjoy a picnic.

2. Biking at the Bonneville Shoreline Trail: Enjoy this beautiful weather by taking a bike ride along the stunning trail.

3. Hike Mount Olympus: Mount Olympus's trail is demanding but the view at the top is worth it.

4. Visit the Utah State Capitol: Explore the state's history by touring the Capitol building and its beautiful grounds.

5. City and County Building Walk: Take advantage of the beautiful sunny weather and enjoy a stroll around the City and County Building, a landmark in Salt Lake City. 

6. Liberty Park: Pack a picnic and spend a few hours enjoying the beautiful weather in the park. If you have kids, they'll love the Seven Canyons Fountain, which represents the seven canyons through the water flows to reach Salt Lake City.

7. Red Butte Garden and Arboretum: If you are a nature lover, don’t miss a visit. There you can spend a heated day in the shade of different plants, trees, and even enjoy outdoor concerts.

8. Visit the Hogle Zoo: This fantastic zoo is perfect for a day out. From elephants to bats, there's so much to see.

9. Start Golfing: With the perfect weather, you can go golfing at one of the city's many beautiful golf courses like Bonneville Golf Course.

10. Play Tennis at Liberty Park: Liberty Park has public tennis courts and the weather is perfect for a game of tennis.

11. Visit the Tracy Aviary: See more than 400 birds at this beautiful aviary located in Liberty Park.

12. Visit Wheeler Historic Farm: A day at the farm includes a peek into a historic Victorian home, cow milking, and wagon rides.

13. Go Shopping: City Creek Center and Trolley Square are wonderful places to start.

14. Try out watersports: Great Salt Lake is not only great for swimming but also for kayaking, canoeing, and standup paddleboarding.

15. Grab a meal outdoors: With the temperature at a comfortable 72 degrees, enjoy outdoor dining at one of the many restaurants in the downtown area.
 */