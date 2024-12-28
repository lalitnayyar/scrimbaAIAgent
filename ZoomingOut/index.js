import OpenAI from 'openai';
import dotenv from 'dotenv';
import { getCurrentWeather, getLocation } from './tools.js';

// Load environment variables from .env file
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

/**
 * Goal - build an agent that can answer any questions that might require knowledge about my current location and the current weather at my location.
 */

/**
 PLAN:
 1. Design a well-written ReAct prompt
 2. Build a loop for my agent to run in. **
 3. Parse any actions that the LLM determines are necessary
 4. End condition - final Answer is given
 
 */

const systemPrompt = `
You cycle through Thought, Action, PAUSE, Observation. At the end of the loop you output a final Answer. Your final answer should be highly specific to the observations you have from running
the actions.
1. Thought: Describe your thoughts about the question you have been asked.
2. Action: run one of the actions available to you - then return PAUSE.
3. PAUSE
4. Observation: will be the result of running those actions.

Available actions:
- getCurrentWeather: 
    E.g. getCurrentWeather: Salt Lake City
    Returns the current weather of the location specified.
- getLocation:
    E.g. getLocation: null
    Returns user's location details. No arguments needed.

Example session:
Question: Please give me some ideas for activities to do this afternoon.
Thought: I should look up the user's location so I can give location-specific activity ideas.
Action: getLocation: null
PAUSE

You will be called again with something like this:
Observation: "New York City, NY"

Then you loop again:
Thought: To get even more specific activity ideas, I should get the current weather at the user's location.
Action: getCurrentWeather: New York City
PAUSE

You'll then be called again with something like this:
Observation: { location: "New York City, NY", forecast: ["sunny"] }

You then output:
Answer: <Suggested activities based on sunny weather that are highly specific to New York City and surrounding areas.>
`;

/**
 * Challenge: Set up the function
 * 1. Create a function called `agent` that takes a `query` as a parameter
 * 2. Create a messages array that follows the pattern openai expects for
 *    its chat completions endpoint. The first message should be the system
 *    prompt we wrote above, and the second message should be the query
 *    from the user found in the `agent` function parameter.
 * 3. Move the code below inside the function (and uncomment it)
 * 4. Call the function with a string query of any kind and see what gets returned.
 */

async function agent(query) {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ],
  });
  const availableFunctions = {
    getCurrentWeather: getCurrentWeather,
    getLocation: getLocation,
  };

  /**
   * PLAN:
   * 1. Split the string on the newline character \n
   * 2. Search through the array of strings for one that has "Action:"
   * 3. Parse the action (function and parameter) from the string
   * 4. Calling the function
   * 5. Add an "Obversation" message with the results of the function call
   */
  /**
   * CHALLENGE:
   * 1. Split the string on the newline character ("\n")
   * 2. Search through the array of strings for one that has "Action:"
   *      regex to use:
   *      const actionRegex = /^Action: (\w+): (.*)$/
   * 3. Parse the action (function and parameter) from the string
   * 4. Calling the function
   * 5. Add an "Obversation" message with the results of the function call
   */
  //C-step -1
  const responseText = response.choices[0].message.content;
  const responseLines = responseText.split('\n');
  console.log(responseLines);

  //C-step -2
  const actionRegex = /^Action: (\w+): (.*)$/;
  const foundActionStr = responseLines.find((str) => actionRegex.test(str));
  const actions = actionRegex.exec(foundActionStr);
  // console.log(actions)

  //C-step -4

  const [_, action, actionArg] = actions;
  const observation = await availableFunctions[action](actionArg);
  console.log(observation);
}

agent('What is the current weather in New York City?');

/**
 * output ❯ node index.js
"Thought: To suggest a self-help book, I should first consider the user's location to recommend something relevant.\n\nAction: getLocation: null\nPAUSE"
 */
