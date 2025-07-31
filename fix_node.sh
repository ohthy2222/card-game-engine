#\!/bin/bash
echo "=== Node.js Troubleshooting Script ==="
echo "1. Clearing bash hash table..."
hash -r
echo "2. Testing node command..."
if command -v node > /dev/null 2>&1; then
    echo "✅ Node found at: $(which node)"
    echo "✅ Node version: $(node --version)"
    echo "3. Testing your command..."
    echo "Running: node claude-sandbox.js --server"
    node claude-sandbox.js --server
else
    echo "❌ Node not found. Using absolute path..."
    /usr/bin/node claude-sandbox.js --server
fi
