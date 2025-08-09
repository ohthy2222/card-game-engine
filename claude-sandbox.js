/* Card Game Generator - Command Line Interface for Creating Card Games */

const express = require('express'); /* Import Express framework for HTTP server functionality */
const { spawn, execSync } = require('child_process'); /* Import child_process for running Claude Code CLI */
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
app.use(express.static(__dirname)); /* Serve static files from current directory */

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
        console.log('='.repeat(50));
        rl.question('Enter your game description: ', (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

// ***2b***
/* Function to send message to Claude using Claude Code CLI */
async function sendToClaudeAPI(systemPrompt, userDescription, claudeCommand = 'claude') {
    try {
        console.log('\n🤖 Sending request to Claude Code...');
        
        /* Prepare the full message combining system prompt and user description */
        const fullMessage = `${systemPrompt}\n\nUser's game description: ${userDescription}`;
        
        try {
            /* Set up environment for Claude Code CLI on Windows */
            const env = { ...process.env };
            
            /* Try to find Git bash executable */
            const possibleBashPaths = [
                'C:\\Program Files\\Git\\bin\\bash.exe',
                'C:\\Program Files (x86)\\Git\\bin\\bash.exe',
                process.env.USERPROFILE + '\\Documents\\Git\\usr\\bin\\bash.exe',  // Based on your PATH
                'C:\\Users\\sauce\\Documents\\Git\\usr\\bin\\bash.exe'  // Your specific path
            ];
            
            for (const bashPath of possibleBashPaths) {
                if (fs.existsSync(bashPath)) {
                    env.CLAUDE_CODE_GIT_BASH_PATH = bashPath;
                    console.log(`🔧 Using Git bash: ${bashPath}`);
                    break;
                }
            }
            
            /* Try using execSync with input parameter instead of spawn */
            try {
                const response = execSync(`${claudeCommand} --print`, {
                    input: fullMessage,
                    encoding: 'utf8',
                    env: env,
                    maxBuffer: 1024 * 1024 * 10,
                    timeout: 60000 // 60 second timeout
                });
                
                console.log('✅ Claude response received');
                return response.trim();
            } catch (execError) {
                console.log('💥 execSync failed, trying alternative approach...');
                console.log('Error:', execError.message);
                
                // Fallback to spawn with direct stdin writing
                const response = await new Promise((resolve, reject) => {
                    console.log(`🔧 Fallback: Using spawn with direct stdin`);
                    
                    const claude = spawn('bash', ['-c', `${claudeCommand} --print`], {
                        env: env,
                        stdio: ['pipe', 'pipe', 'pipe'],
                        cwd: __dirname
                    });
                    
                    let stdout = '';
                    let stderr = '';
                    
                    claude.stdout.on('data', (data) => {
                        stdout += data.toString();
                    });
                    
                    claude.stderr.on('data', (data) => {
                        stderr += data.toString();
                    });
                    
                    claude.on('close', (code) => {
                        if (code === 0) {
                            resolve(stdout);
                        } else {
                            reject(new Error(`Claude fallback failed with code ${code}: ${stderr}`));
                        }
                    });
                    
                    claude.on('error', (err) => {
                        reject(err);
                    });
                    
                    // Write the prompt to stdin
                    claude.stdin.write(fullMessage);
                    claude.stdin.end();
                });
                
                return response.trim();
            }
            
            return response.trim();
        } catch (cliError) {
            throw cliError;
        }
        
    } catch (error) {
        console.error('❌ Claude Code error:', error.message);
        throw new Error('Failed to get response from Claude Code CLI');
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
        /* Check if Claude Code CLI is available - use npx as fallback */
        let claudeCommand = 'npx @anthropic-ai/claude-code';
        
        console.log('🔍 Looking for Claude Code CLI...');
        
        /* Try to find the best available Claude command */
        const possibleCommands = [
            'claude',
            'npx @anthropic-ai/claude-code'
        ];
        
        let claudeFound = false;
        for (const cmd of possibleCommands) {
            try {
                execSync(`${cmd} --version`, { stdio: 'ignore', timeout: 5000 });
                claudeCommand = cmd;
                claudeFound = true;
                console.log(`✅ Claude Code CLI found: ${cmd}`);
                break;
            } catch (error) {
                // Continue trying other commands
            }
        }
        
        if (!claudeFound) {
            console.log('⚠️  Claude CLI not directly available, using npx fallback...');
            claudeCommand = 'npx @anthropic-ai/claude-code';
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
        const response = await sendToClaudeAPI(systemPrompt, userDescription, claudeCommand);
        
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
                console.log('🌐 Open simple-gui.html in your browser to play');
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

/* API endpoint for listing generated game files */
app.get('/api/games', (req, res) => {
    try {
        const gameFiles = fs.readdirSync(__dirname)
            .filter(file => file.endsWith('.js') && file !== 'claude-sandbox.js' && file !== 'card-game-engine.js')
            .map(file => ({
                filename: file,
                name: file.replace('.js', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                created: fs.statSync(path.join(__dirname, file)).mtime
            }))
            .sort((a, b) => b.created - a.created);
        
        res.json({ games: gameFiles });
    } catch (error) {
        console.error('Error listing games:', error.message);
        res.status(500).json({ error: 'Failed to list games' });
    }
});

/* API endpoint for web-based requests (optional) */
app.post('/api/generate', async (req, res) => {
    try {
        const { description } = req.body;
        
        if (!description) {
            return res.status(400).json({ error: 'Game description is required' });
        }
        
        const systemPrompt = loadSystemPrompt();
        const response = await sendToClaudeAPI(systemPrompt, description, 'claude');
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