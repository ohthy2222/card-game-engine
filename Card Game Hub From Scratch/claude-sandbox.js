/* Card Game Generator - Command Line Interface for Creating Card Games */

const express = require('express'); /* Import Express framework for HTTP server functionality */
const axios = require('axios'); /* Import Axios HTTP client for making API requests to Claude */
const cors = require('cors'); /* CORS middleware for cross-origin requests */
const fs = require('fs'); /* File system module for reading and writing files */
const path = require('path'); /* Path module for handling file paths */
const readline = require('readline'); /* Readline module for command line input */
require('dotenv').config(); /* Load environment variables from .env file */

console.log('Loaded API Key:', process.env.ANTHROPIC_API_KEY ? 'Present' : 'Missing'); /* Test API key loading */

const app = express(); /* Create Express app instance */
const PORT = 3000; /* Server port */

/* Enable middleware */
app.use(cors()); /* Enable CORS for cross-origin requests */
app.use(express.json()); /* Parse JSON request bodies */

/* Function to load system prompt from file */
function loadSystemPrompt() {
    try {
        const promptPath = path.join(__dirname, 'system prompts', 'simple-system-prompt.md');
        const systemPrompt = fs.readFileSync(promptPath, 'utf8');
        console.log('✅ System prompt loaded successfully');
        return systemPrompt.trim();
    } catch (error) {
        console.error('❌ Error loading system prompt:', error.message);
        console.error('Make sure simple-system-prompt.md exists in the system prompts directory');
        process.exit(1);
    }
}

/* Function to get user input from command line */
function getUserInput() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        console.log('🎮 Card Game Generator');
        console.log('=' * 50);
        rl.question('Enter your game description: ', (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// ***2b***
/* Function to send message to Claude API */
async function sendToClaudeAPI(systemPrompt, userDescription) {
    try {
        console.log('\n🤖 Sending request to Claude...');
        
        /* Prepare the full message combining system prompt and user description */
        const fullMessage = `${systemPrompt}\n\nUser's game description: ${userDescription}`;
        
        /* Make API request to Claude */
        const response = await axios.post(
            'https://api.anthropic.com/v1/messages',
            {
                model: 'claude-opus-4-20250514', /* Using Claude 3 Sonnet model */
                max_tokens: 4000, /* Higher token limit for code generation */
                messages: [{ role: 'user', content: fullMessage }]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.ANTHROPIC_API_KEY, /* API key from environment */
                    'anthropic-version': '2023-06-01'
                }
            }
        );
// ***2c***
        return response.data.content[0].text;
    } catch (error) {
        console.error('❌ Claude API error:', error.response?.data || error.message);
        throw new Error('Failed to get response from Claude API');
    }
}

/* Function to parse JavaScript code from Claude's response */
function parseJavaScriptCode(response) {
    const startMarker = 'JAVASCRIPT BEGINS HERE';
    const endMarker = 'JAVASCRIPT ENDS HERE';
    
    const startIndex = response.indexOf(startMarker);
    const endIndex = response.indexOf(endMarker);
    
    if (startIndex === -1 || endIndex === -1) {
        console.log('⚠️  Warning: Could not find JavaScript markers in response');
        console.log('Looking for alternative code block markers...');
        
        /* Try to find code blocks with ```javascript markers */
        const codeBlockStart = response.indexOf('```javascript');
        if (codeBlockStart !== -1) {
            const codeStart = codeBlockStart + '```javascript'.length;
            const codeBlockEnd = response.indexOf('```', codeStart);
            if (codeBlockEnd !== -1) {
                const jsCode = response.substring(codeStart, codeBlockEnd).trim();
                console.log('✅ Found JavaScript code in markdown code block');
                return jsCode;
            }
        }
        
        console.log('❌ Could not extract JavaScript code from response');
        return null;
    }
    
    /* Extract JavaScript code between markers */
    const jsStartIndex = startIndex + startMarker.length;
    let jsCode = response.substring(jsStartIndex, endIndex).trim();
    
    /* Clean up any markdown code block markers */
    jsCode = jsCode.replace(/^```(?:javascript)?\n?/gm, '');
    jsCode = jsCode.replace(/\n?```$/gm, '');
    
    return jsCode;
}

/* Function to generate appropriate filename from user description */
function generateFileName(userDescription) {
    /* Clean the description to create a valid filename */
    let filename = userDescription.toLowerCase()
        .replace(/[^\w\s-]/g, '') /* Remove special characters */
        .replace(/[-\s]+/g, '-') /* Replace spaces and dashes with single dash */
        .substring(0, 30); /* Limit length */
    
    if (!filename || filename.length === 0) {
        filename = 'card-game';
    }
    
    /* Ensure unique filename by adding counter if file exists */
    let finalFilename = filename;
    let counter = 1;
    while (fs.existsSync(`${finalFilename}.js`)) {
        finalFilename = `${filename}-${counter}`;
        counter++;
    }
    
    return `${finalFilename}.js`;
}

/* Function to write JavaScript code to file */
function writeJavaScriptFile(jsCode, filename) {
    try {
        fs.writeFileSync(filename, jsCode, 'utf8');
        console.log(`\n✅ JavaScript code written to: ${filename}`);
        return true;
    } catch (error) {
        console.error(`❌ Error writing file: ${error.message}`);
        return false;
    }
}

/* Main function to run the card game generator */
async function runCardGameGenerator() {
    try {
        /* Check if API key is present */
        if (!process.env.ANTHROPIC_API_KEY) {
            console.error('❌ Error: ANTHROPIC_API_KEY environment variable not set');
            console.error('Please set your API key: export ANTHROPIC_API_KEY=your_key_here');
            process.exit(1);
        }
        
        /* Load system prompt */
        const systemPrompt = loadSystemPrompt();
        
        /* Get user input */
        const userDescription = await getUserInput();
        
        if (!userDescription) {
            console.error('❌ No game description provided');
            process.exit(1);
        }
        
        /* Send to Claude API */
        const response = await sendToClaudeAPI(systemPrompt, userDescription);
        
        /* Display Claude's response */
        console.log('\n' + '='.repeat(50));
        console.log('🤖 Claude\'s Response:');
        console.log('='.repeat(50));
        console.log(response);
        console.log('='.repeat(50));
        
        /* Parse JavaScript code */
        const jsCode = parseJavaScriptCode(response);
        
        if (jsCode) {
            /* Generate filename and write file */
            const filename = generateFileName(userDescription);
            
            if (writeJavaScriptFile(jsCode, filename)) {
                console.log('\n✅ Game successfully generated!');
                console.log(`📁 File saved as: ${filename}`);
                console.log('🌐 Open tester-gui.html in your browser to play');
                console.log('💡 Make sure to include the script in your HTML file');
            } else {
                console.error('❌ Failed to write JavaScript file');
            }
        } else {
            console.error('❌ Could not extract JavaScript code from response');
            console.log('💡 The full response is shown above - you may need to manually extract the code');
        }
        
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

/* API endpoint for web-based requests (optional) */
app.post('/api/generate', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: 'Game description is required' });
        }
        
        const systemPrompt = loadSystemPrompt();
        const response = await sendToClaudeAPI(systemPrompt, description);
        const jsCode = parseJavaScriptCode(response);
        
        if (jsCode) {
            const filename = generateFileName(description);
            const success = writeJavaScriptFile(jsCode, filename);
            
            res.json({
                success: success,
                filename: filename,
                response: response,
                jsCode: jsCode
            });
        } else {
            res.status(500).json({ 
                error: 'Could not extract JavaScript code', 
                response: response 
            });
        }
        
    } catch (error) {
        console.error('API error:', error.message);
        res.status(500).json({ error: 'Failed to generate game' });
    }
});

/* Start server for API mode */
function startServer() {
    app.listen(PORT, () => { /* Have Express listen on port 3000 */
        console.log(`🚀 Card Game Generator server running on http://localhost:${PORT}`);
        console.log('📡 API endpoint: POST /api/generate');
    });
}

/* Check if running as command line tool or server */
if (require.main === module) {
    /* Check command line arguments */
    const args = process.argv.slice(2);
    
    if (args.includes('--server')) {
        /* Run as server */
        startServer();
    } else {
        /* Run as command line tool */
        runCardGameGenerator();
    }
}