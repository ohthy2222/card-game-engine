/* Server File For Handling Command Line Interface Requests */

const express = require('express'); /* Import Express framework so that HTTP servers and APIs in Node.js are simplified */
const axios = require('axios'); /* Import the Axios HTTP client library for Node.js. Needed for the POST method to send to Claude API. */
const cors = require('cors'); /* CORS middleware that allows you to access the API without security blocking it */
require('dotenv').config(); /* Force it to load the API key from a .env file. This is necessary to hide the API key. */

console.log('Loaded API Key:', process.env.ANTHROPIC_API_KEY); /* Test to see if the API Key was loaded */

const app = express(); /* Make an Express App Instance where the API endpoints will be defined */
const PORT = 3000; /* This is the port that the server will listen on. It's set to 3000 because my server is on localhost:3000 */

app.use(cors()); /* Enable CORS so that it's able to answer requests from the client. This allows the client to talk to the server without being blocked by security. */
app.use(express.json()); /* Automatically parse (break apart) the JSON strings */

/* This is the API endpoint. It defines the POST route to be /api/send and is triggered when the client calls the sendMessage() function */
app.post('/api/send', async (req, res) =>
{
// ***2a***
    const userMessage = req.body.message; /* extracts the user's message that is being sent over to the server as a request */

    try
    {
// ***2b***
        const response = await axios.post( /* This sends a POST type method request to Claude's API messages endpoint. 'await' causes the function to stop until a response is received. */
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-3-opus-20240229', /* Or whatever version of claude I end up using */
                max_tokens: 1024, /* An arbitrary num of tokens that I'm setting a limit to on how much the user can use when sending a message to claude */
                messages: [{ role: 'user', content: userMessage }] /* The message that the user inputted */
            },
            {
                headers:
                {
                    'Content-Type': 'application/json', /* The content type being sent is json */
                    'x-api-key': process.env.ANTHROPIC_API_KEY, /* ***This is where you access the API key from the .env file*** This is very necessary to send messages to Claude */
                    'anthropic-version': '2023-06-01' /* The version of API I'm using */
                }
            }
        );

// ***2c***
        res.json(response.data); /* ***This is where we send Claude's response back to the client web page*** */
    }
    catch (error) /* Catch the errors to prevent server crashes */
    {
        console.error('Claude API error:', error.response?.data || error.message); /* Log the error */
        res.status(500).json({ error: 'Failed to get response from Claude.' }); /* Send a message back to the client regarding what the error was */
    }
});

    app.listen(PORT, () => /* Have Express listen on port 3000 */
    {
        console.log(`Server running on http://localhost:${PORT}`); /* When the server starts, print this message to confirm it's running */
    });