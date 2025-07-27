/* Game Engine File that any card game script can use for it's methods to run a card game */

class GameEngine
{
    constructor()
    {
        // Create empty arrays to store objects
        this.players = [];
        this.zones = [];
        this.cards = [];
        this.decks = [];

        // Increase the counter every time a new object is made to ensure the ids are unique
        this.cardIdCounter = 0;
        this.zoneIdCounter = 0;
        this.playerIdCounter = 0;

        // Game discovery properties
        this.discoveredGames = [];
        this.currentGame = null;
        this.loadedScripts = new Set();
        this.gameDirectory = './'; // Default search directory
        this.serverUrl = 'http://localhost:3000'; // Server URL for API calls
        
        // Automatically discover games on initialization
        this.discoverGames();
    }

    // CONSTRUCTORS

    createPlayer()
    {
        const player = { id: this.playerIdCounter++ };
        this.players.push(player);
        return player;
    }

    createZone(player, x, y, length, width, hidden, faceUp)
    {
        const zone = {
            id: this.zoneIdCounter++,
            owner: player,
            x, y, length, width,
            hidden,
            faceUp,
            cards: []
        };
        this.zones.push(zone);
        return zone;
    }

    createCard()
    {
        const card = { id: this.cardIdCounter++ };
        this.cards.push(card);
        return card;
    }

    createDeck(player, cardArray)
    {
        const deck = {
            id: `deck-${player.id}`,
            owner: player,
            cards: [...cardArray]
        };
        this.decks.push(deck);
        return deck;
    }

    // ACCESSORS

    getPlayerId(player)
    {
        return player.id;
    }

    getZoneId(player)
    {
        return this.zones.find(z => z.owner === player)?.id;
    }

    getDeckId(player)
    {
        return this.decks.find(d => d.owner === player)?.id;
    }

    getDeckSize(deck)
    {
        return deck.cards.length;
    }

    getCardAmountFromZone(zone)
    {
        return zone.cards.length;
    }

    getCardId(card)
    {
        return card.id;
    }

    // MUTATORS

    moveCardToZone(card, fromZone, toZone, isFaceUp)
    {
        if (fromZone) {
            fromZone.cards = fromZone.cards.filter(c => c.id !== card.id);
        }
        if (toZone) {
            toZone.cards.push({ ...card, faceUp: isFaceUp });
        }
    }

    addCard(deck, card)
    {
        deck.cards.push(card);
    }

    removeCard(deck, card)
    {
        deck.cards = deck.cards.filter(c => c.id !== card.id);
    }

    shuffleDeck(deck)
    {
        for (let i = deck.cards.length - 1; i > 0; --i)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
        }
    }

    // GAME DISCOVERY AND LOADING METHODS

    async discoverGames()
    {
        try {
            console.log('🔍 GameEngine: Searching for game scripts...');
            
            const response = await fetch(`${this.serverUrl}/api/games`);
            if (!response.ok) {
                throw new Error('Server responded with error. Make sure server is running with: node claude-sandbox.js --server');
            }
            
            const data = await response.json();
            this.discoveredGames = data.games;
            
            console.log(`✅ GameEngine: Found ${this.discoveredGames.length} game script(s)`);
            this.displayDiscoveredGames();
            
            return this.discoveredGames;
        } catch (error) {
            let errorMessage = error.message;
            if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
                errorMessage = 'Server not running! Start with: node claude-sandbox.js --server';
            }
            console.error('❌ GameEngine: Failed to discover games:', errorMessage);
            this.displayError(errorMessage);
            return [];
        }
    }

    displayDiscoveredGames()
    {
        // Create or update the games display area
        let gamesDisplay = document.getElementById('discovered-games-display');
        if (!gamesDisplay) {
            gamesDisplay = document.createElement('div');
            gamesDisplay.id = 'discovered-games-display';
            gamesDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(72, 187, 120, 0.9);
                color: white;
                padding: 10px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
                z-index: 1000;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(gamesDisplay);
        }

        if (this.discoveredGames.length === 0) {
            gamesDisplay.innerHTML = '🎮 No games found';
            gamesDisplay.style.background = 'rgba(229, 62, 62, 0.9)';
        } else {
            gamesDisplay.innerHTML = `
                <strong>🎮 Discovered Games (${this.discoveredGames.length}):</strong><br>
                ${this.discoveredGames.map(game => `📄 ${game.name}`).join('<br>')}
                <br><small>Click "Start Game" to select and run</small>
            `;
            gamesDisplay.style.background = 'rgba(72, 187, 120, 0.9)';
        }
    }

    displayError(message)
    {
        let errorDisplay = document.getElementById('discovered-games-display');
        if (!errorDisplay) {
            errorDisplay = document.createElement('div');
            errorDisplay.id = 'discovered-games-display';
            errorDisplay.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(229, 62, 62, 0.9);
                color: white;
                padding: 10px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
                z-index: 1000;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(errorDisplay);
        }
        
        errorDisplay.innerHTML = `❌ ${message}`;
        errorDisplay.style.background = 'rgba(229, 62, 62, 0.9)';
    }

    async loadGameScript(filename)
    {
        if (this.loadedScripts.has(filename)) {
            console.log(`🔄 GameEngine: Script ${filename} already loaded`);
            return true;
        }

        try {
            console.log(`📥 GameEngine: Loading script ${filename}...`);
            
            const script = document.createElement('script');
            script.src = `${this.serverUrl}/${filename}`;
            
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    this.loadedScripts.add(filename);
                    console.log(`✅ GameEngine: Successfully loaded ${filename}`);
                    resolve(true);
                };
                script.onerror = () => {
                    console.error(`❌ GameEngine: Failed to load ${filename}`);
                    reject(new Error(`Failed to load ${filename}`));
                };
                document.head.appendChild(script);
            });
        } catch (error) {
            console.error(`❌ GameEngine: Error loading ${filename}:`, error.message);
            return false;
        }
    }

    async startGame(gameIndex = 0)
    {
        console.log('🚀 GameEngine: Starting game...');
        
        if (this.discoveredGames.length === 0) {
            console.error('❌ GameEngine: No games available. Discovering games...');
            await this.discoverGames();
            if (this.discoveredGames.length === 0) {
                this.displayError('No games found to start!');
                return false;
            }
        }

        const selectedGame = this.discoveredGames[gameIndex];
        if (!selectedGame) {
            console.error(`❌ GameEngine: Game index ${gameIndex} not found`);
            this.displayError(`Game index ${gameIndex} not found`);
            return false;
        }

        console.log(`🎯 GameEngine: Starting ${selectedGame.name} (${selectedGame.filename})`);
        this.currentGame = selectedGame;

        try {
            // Load the game script
            await this.loadGameScript(selectedGame.filename);

            // Try to call startGame function with game engine reference
            if (typeof startGame === 'function') {
                console.log(`🎮 GameEngine: Calling startGame() for ${selectedGame.name}`);
                startGame(this); // Pass game engine reference
            } else if (typeof window.startGame === 'function') {
                console.log(`🎮 GameEngine: Calling window.startGame() for ${selectedGame.name}`);
                window.startGame(this);
            } else {
                console.warn(`⚠️  GameEngine: No startGame() function found in ${selectedGame.filename}`);
                this.displayError(`No startGame() function in ${selectedGame.filename}`);
                return false;
            }

            console.log(`✅ GameEngine: ${selectedGame.name} started successfully`);
            
            // Update display to show current game
            this.displayCurrentGame();
            return true;

        } catch (error) {
            console.error(`❌ GameEngine: Failed to start ${selectedGame.name}:`, error.message);
            this.displayError(`Failed to start ${selectedGame.name}: ${error.message}`);
            return false;
        }
    }

    displayCurrentGame()
    {
        let currentGameDisplay = document.getElementById('current-game-display');
        if (!currentGameDisplay) {
            currentGameDisplay = document.createElement('div');
            currentGameDisplay.id = 'current-game-display';
            currentGameDisplay.style.cssText = `
                position: fixed;
                bottom: 10px;
                right: 10px;
                background: rgba(66, 153, 225, 0.9);
                color: white;
                padding: 10px;
                border-radius: 8px;
                font-family: monospace;
                font-size: 12px;
                max-width: 300px;
                z-index: 1000;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            `;
            document.body.appendChild(currentGameDisplay);
        }

        if (this.currentGame) {
            currentGameDisplay.innerHTML = `
                <strong>🎯 Current Game:</strong><br>
                📄 ${this.currentGame.name}<br>
                💾 ${this.currentGame.filename}
            `;
        } else {
            currentGameDisplay.innerHTML = '🎯 No game running';
        }
    }

    // Refresh games list
    async refreshGamesList()
    {
        console.log('🔄 GameEngine: Refreshing games list...');
        return await this.discoverGames();
    }

    // Get list of available games
    getAvailableGames()
    {
        return this.discoveredGames;
    }

    // Get current running game info
    getCurrentGame()
    {
        return this.currentGame;
    }

    // OTHER METHODS

    compareCards(cardA, cardB)
    {
        return cardA.value > cardB.value ? 1 : cardA.value < cardB.value ? -1 : 0;
    }
};

class GameStatus
{
    constructor()
    {
        this.statuses = new Map(); // key: player.id, value: integer
        this.winDecider = null;
    }

    // CONSTRUCTORS

    createGameStatus(player)
    {
        this.statuses.set(player.id, 0);
    }

    // ACCESSORS

    getGameStatus(player)
    {
        return this.statuses.get(player.id);
    }

    getGameWinner(scoreP1, scoreP2)
    {
        if (scoreP1 > scoreP2)
        {
                return "Player 1";
        }
        else if (scoreP2 > scoreP1)
        {
            return "Player 2";
        }
        else
        {
            return "Tie";
        }
    }

    // MUTATORS

    setGameStatus(player, value)
    {
        this.statuses.set(player.id, value);
    }

    setWinDecider(player)
    {
        this.winDecider = player.id;
    }

};
