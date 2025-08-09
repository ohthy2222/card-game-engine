#!/bin/bash

echo "🔧 Setting up Card Game Engine environment..."

# Make npm and npx executable
chmod +x npm
chmod +x npx
echo "✅ Made npm and npx executable"

# Add current directory to PATH and ensure uname is available
export PATH="$(pwd):/usr/bin:/bin:$PATH"
echo "✅ Added current directory and system paths to PATH"

# Install Claude Code CLI globally (only if not already installed)
if ! command -v claude &> /dev/null; then
    echo "📦 Installing Claude Code CLI in WSL..."
    npm install -g @anthropic-ai/claude-code
    echo "✅ Claude Code CLI installed in WSL"
else
    echo "✅ Claude Code CLI already installed in WSL"
fi

# Also install for Windows npm (for node.exe compatibility)
echo "📦 Installing Claude Code CLI for Windows node.exe..."
./npm install -g @anthropic-ai/claude-code
echo "✅ Claude Code CLI installed for Windows"

echo "🎉 Setup complete! You can now run 'npm start'"
echo "💡 Add 'source setup.sh' to your ~/.bashrc to run this automatically"