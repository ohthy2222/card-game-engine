/* Simplified War Card Game Script using Game Engine Methods */

class SimpleWarGame {
    constructor() {
        this.engine = new GameEngine();
        this.gameStatus = new GameStatus();
        this.player1 = null;
        this.player2 = null;
        this.player1Hand = null;
        this.player2Hand = null;
        this.player1BattlePile = null;
        this.player2BattlePile = null;
        this.player1WonCards = null;
        this.player2WonCards = null;
        this.gameLog = [];
        this.turnCount = 0;
        this.isGameOver = false;
    }

    // Initialize the game setup
    initializeGame() {
        this.log("🎮 Initializing Simplified War Game...");
        
        // Create two players using game engine
        this.player1 = this.engine.createPlayer();
        this.player2 = this.engine.createPlayer();
        this.log(`👤 Created Player ${this.player1.id} and Player ${this.player2.id}`);
        
        // Create game status tracking for both players
        this.gameStatus.createGameStatus(this.player1);
        this.gameStatus.createGameStatus(this.player2);
        this.gameStatus.setWinDecider(this.player1); // Set player1 as win decider reference
        
        // Create zones for each player
        this.createPlayerZones();
        
        // Create and distribute cards
        this.createAndDistributeCards();
        
        this.log("✅ Game initialization complete!");
        this.log(`🃏 Each player starts with ${this.engine.getCardAmountFromZone(this.player1Hand)} cards`);
    }

    // Create the necessary zones for both players
    createPlayerZones() {
        // Create hand zones (face down cards)
        this.player1Hand = this.engine.createZone(this.player1, 50, 50, 100, 150, false, false);
        this.player2Hand = this.engine.createZone(this.player2, 300, 50, 100, 150, false, false);
        
        // Create battle pile zones (face up cards)
        this.player1BattlePile = this.engine.createZone(this.player1, 50, 220, 100, 150, false, true);
        this.player2BattlePile = this.engine.createZone(this.player2, 300, 220, 100, 150, false, true);
        
        // Create won cards zones (face up cards)
        this.player1WonCards = this.engine.createZone(this.player1, 50, 390, 100, 150, false, true);
        this.player2WonCards = this.engine.createZone(this.player2, 300, 390, 100, 150, false, true);
        
        this.log("🏠 Created zones: Hands, Battle Piles, and Won Cards zones for both players");
    }

    // Create a standard 52-card deck and distribute to players
    createAndDistributeCards() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
        
        const allCards = [];
        
        // Create all 52 cards
        for (let suit of suits) {
            for (let i = 0; i < ranks.length; i++) {
                const card = this.engine.createCard();
                card.suit = suit;
                card.rank = ranks[i];
                card.value = values[i];
                card.displayName = `${ranks[i]} of ${suit}`;
                allCards.push(card);
            }
        }
        
        this.log(`🃏 Created ${allCards.length} cards`);
        
        // Shuffle the cards randomly
        this.shuffleArray(allCards);
        this.log("🔀 Shuffled the deck");
        
        // Distribute cards alternately to each player's hand
        for (let i = 0; i < allCards.length; i++) {
            if (i % 2 === 0) {
                this.engine.moveCardToZone(allCards[i], null, this.player1Hand, false);
            } else {
                this.engine.moveCardToZone(allCards[i], null, this.player2Hand, false);
            }
        }
        
        this.log("📤 Distributed cards to both players' hands");
    }

    // Utility function to shuffle an array
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Play one round of the simplified war game
    playRound() {
        if (this.isGameOver) {
            this.log("❌ Game is already over!");
            return;
        }
        
        this.turnCount++;
        this.log(`\n🔄 === ROUND ${this.turnCount} ===`);
        
        // Check if either player has an empty hand (win condition)
        if (this.checkWinCondition()) {
            return;
        }
        
        // Move one card from each player's hand to their battle pile
        const player1Card = this.drawCardFromHand(this.player1, this.player1Hand, this.player1BattlePile);
        const player2Card = this.drawCardFromHand(this.player2, this.player2Hand, this.player2BattlePile);
        
        if (!player1Card || !player2Card) {
            this.log("❌ Cannot draw cards - game ending");
            this.endGame();
            return;
        }
        
        this.log(`⚔️  Player ${this.player1.id} plays: ${player1Card.displayName} (value: ${player1Card.value})`);
        this.log(`⚔️  Player ${this.player2.id} plays: ${player2Card.displayName} (value: ${player2Card.value})`);
        
        // Compare cards and determine winner
        const comparison = this.engine.compareCards(player1Card, player2Card);
        let winner;
        
        if (comparison > 0) {
            winner = this.player1;
            this.log(`🏆 Player ${this.player1.id} wins the battle!`);
        } else if (comparison < 0) {
            winner = this.player2;
            this.log(`🏆 Player ${this.player2.id} wins the battle!`);
        } else {
            // Tie - choose winner randomly (simplified war rule)
            winner = Math.random() < 0.5 ? this.player1 : this.player2;
            this.log(`🎲 Tie! Random winner: Player ${winner.id}`);
        }
        
        // Transfer battle cards to winner's won cards pile
        this.collectBattleCards(winner);
        
        // Update game status (scores)
        this.updateGameStatus();
        
        // Check win condition again after the round
        this.checkWinCondition();
    }

    // Draw a card from a player's hand to their battle pile
    drawCardFromHand(player, handZone, battleZone) {
        if (this.engine.getCardAmountFromZone(handZone) === 0) {
            // Hand is empty, try to move cards from won cards pile back to hand
            if (this.engine.getCardAmountFromZone(player === this.player1 ? this.player1WonCards : this.player2WonCards) === 0) {
                this.log(`💔 Player ${player.id} has no cards left!`);
                return null;
            }
            
            // Move all won cards back to hand
            const wonCardsZone = player === this.player1 ? this.player1WonCards : this.player2WonCards;
            const cardsToMove = [...wonCardsZone.cards];
            
            for (let card of cardsToMove) {
                this.engine.moveCardToZone(card, wonCardsZone, handZone, false);
            }
            
            this.log(`♻️  Player ${player.id} moved ${cardsToMove.length} won cards back to hand`);
        }
        
        // Draw top card from hand
        if (handZone.cards.length > 0) {
            const topCard = handZone.cards[handZone.cards.length - 1];
            this.engine.moveCardToZone(topCard, handZone, battleZone, true);
            return topCard;
        }
        
        return null;
    }

    // Collect all battle pile cards for the winner
    collectBattleCards(winner) {
        const winnerWonCards = winner === this.player1 ? this.player1WonCards : this.player2WonCards;
        
        // Collect all cards from both battle piles
        const player1BattleCards = [...this.player1BattlePile.cards];
        const player2BattleCards = [...this.player2BattlePile.cards];
        
        let totalCardsCollected = 0;
        
        // Move Player 1's battle cards to winner
        for (let card of player1BattleCards) {
            this.engine.moveCardToZone(card, this.player1BattlePile, winnerWonCards, true);
            totalCardsCollected++;
        }
        
        // Move Player 2's battle cards to winner
        for (let card of player2BattleCards) {
            this.engine.moveCardToZone(card, this.player2BattlePile, winnerWonCards, true);
            totalCardsCollected++;
        }
        
        this.log(`📥 Player ${winner.id} collected ${totalCardsCollected} cards`);
    }

    // Update game status scores based on total cards each player has
    updateGameStatus() {
        const player1Total = this.engine.getCardAmountFromZone(this.player1Hand) + 
                           this.engine.getCardAmountFromZone(this.player1WonCards);
        const player2Total = this.engine.getCardAmountFromZone(this.player2Hand) + 
                           this.engine.getCardAmountFromZone(this.player2WonCards);
        
        this.gameStatus.setGameStatus(this.player1, player1Total);
        this.gameStatus.setGameStatus(this.player2, player2Total);
        
        this.log(`📊 Scores - Player ${this.player1.id}: ${player1Total} cards, Player ${this.player2.id}: ${player2Total} cards`);
    }

    // Check if the game should end (simplified win condition: empty hand)
    checkWinCondition() {
        const player1HandEmpty = this.engine.getCardAmountFromZone(this.player1Hand) === 0;
        const player2HandEmpty = this.engine.getCardAmountFromZone(this.player2Hand) === 0;
        const player1WonCardsEmpty = this.engine.getCardAmountFromZone(this.player1WonCards) === 0;
        const player2WonCardsEmpty = this.engine.getCardAmountFromZone(this.player2WonCards) === 0;
        
        // Game ends if a player has completely empty hand and no won cards to refill
        if (player1HandEmpty && player1WonCardsEmpty) {
            this.log(`🏁 Game Over! Player ${this.player2.id} wins - Player ${this.player1.id} has no cards left!`);
            this.endGame();
            return true;
        }
        
        if (player2HandEmpty && player2WonCardsEmpty) {
            this.log(`🏁 Game Over! Player ${this.player1.id} wins - Player ${this.player2.id} has no cards left!`);
            this.endGame();
            return true;
        }
        
        return false;
    }

    // End the game and display final results
    endGame() {
        this.isGameOver = true;
        this.log(`\n🎯 === FINAL RESULTS ===`);
        this.log(`🕐 Game lasted ${this.turnCount} rounds`);
        
        const player1Total = this.gameStatus.getGameStatus(this.player1);
        const player2Total = this.gameStatus.getGameStatus(this.player2);
        
        this.log(`📊 Final Scores:`);
        this.log(`   Player ${this.player1.id}: ${player1Total} cards`);
        this.log(`   Player ${this.player2.id}: ${player2Total} cards`);
        
        if (player1Total > player2Total) {
            this.log(`👑 Player ${this.player1.id} is the winner!`);
        } else if (player2Total > player1Total) {
            this.log(`👑 Player ${this.player2.id} is the winner!`);
        } else {
            this.log(`🤝 It's a tie!`);
        }
    }

    // Play the entire game automatically
    playCompleteGame() {
        this.initializeGame();
        
        while (!this.isGameOver && this.turnCount < 1000) { // Safety limit to prevent infinite loops
            this.playRound();
        }
        
        if (this.turnCount >= 1000) {
            this.log("⏰ Game stopped due to round limit (1000 rounds)");
            this.endGame();
        }
    }

    // Get the current game state summary
    getGameState() {
        return {
            turnCount: this.turnCount,
            isGameOver: this.isGameOver,
            player1: {
                id: this.player1?.id,
                handCards: this.player1Hand ? this.engine.getCardAmountFromZone(this.player1Hand) : 0,
                wonCards: this.player1WonCards ? this.engine.getCardAmountFromZone(this.player1WonCards) : 0,
                totalCards: this.player1 ? this.gameStatus.getGameStatus(this.player1) : 0
            },
            player2: {
                id: this.player2?.id,
                handCards: this.player2Hand ? this.engine.getCardAmountFromZone(this.player2Hand) : 0,
                wonCards: this.player2WonCards ? this.engine.getCardAmountFromZone(this.player2WonCards) : 0,
                totalCards: this.player2 ? this.gameStatus.getGameStatus(this.player2) : 0
            }
        };
    }

    // Logging function
    log(message) {
        this.gameLog.push(message);
        if (typeof console !== 'undefined') {
            console.log(message);
        }
    }

    // Get all game logs
    getGameLog() {
        return this.gameLog;
    }
}

// UI Integration Class - Handles all tester-gui.html integration
class WarGameUI {
    constructor() {
        this.warGame = null;
        this.initializeWhenReady();
    }

    // Initialize when DOM is loaded
    initializeWhenReady() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    // Set up the UI integration
    initialize() {
        this.addWarGameControls();
        this.addWarGameStats();
        this.updateWarGameStats();
        this.log("War Game UI initialized", 'success');
    }

    // Add War game controls to the existing controls panel
    addWarGameControls() {
        const controlsPanel = document.querySelector('.controls-panel .button-group');
        if (!controlsPanel) return;

        // Create War game section
        const warSection = document.createElement('div');
        warSection.style.marginTop = '20px';
        warSection.style.paddingTop = '20px';
        warSection.style.borderTop = '2px solid #e2e8f0';
        warSection.innerHTML = `
            <h3 style="color: #2d3748; margin-bottom: 15px;">⚔️ Simplified War Game</h3>
            <div class="button-group">
                <button id="start-war-game">
                    🎯 Start New War Game
                </button>
                <button id="play-war-round" disabled>
                    ⚡ Play One Round
                </button>
                <button id="auto-play-war" disabled>
                    ⏩ Auto-Play Complete Game
                </button>
                <button id="show-war-state" disabled>
                    📊 Show Game State
                </button>
            </div>
        `;

        controlsPanel.parentNode.appendChild(warSection);

        // Add event listeners
        document.getElementById('start-war-game').addEventListener('click', () => this.handleStartWarGame());
        document.getElementById('play-war-round').addEventListener('click', () => this.handlePlayWarRound());
        document.getElementById('auto-play-war').addEventListener('click', () => this.handleAutoPlayWar());
        document.getElementById('show-war-state').addEventListener('click', () => this.handleShowWarState());
    }

    // Add War game stats to the stats panel
    addWarGameStats() {
        const statsPanel = document.querySelector('.stats-panel');
        if (!statsPanel) return;

        const warRoundsCard = document.createElement('div');
        warRoundsCard.className = 'stat-card';
        warRoundsCard.innerHTML = `
            <div class="stat-value" id="war-rounds">0</div>
            <div class="stat-label">War Rounds</div>
        `;

        const warStatusCard = document.createElement('div');
        warStatusCard.className = 'stat-card';
        warStatusCard.innerHTML = `
            <div class="stat-value" id="war-status">Not Started</div>
            <div class="stat-label">War Game</div>
        `;

        statsPanel.appendChild(warRoundsCard);
        statsPanel.appendChild(warStatusCard);
    }

    // Handle starting a new War game
    handleStartWarGame() {
        try {
            // Clear existing visualization
            const gameBoard = document.getElementById('game-board');
            if (gameBoard) gameBoard.innerHTML = '';
            
            // Create new war game instance
            this.warGame = new SimpleWarGame();
            this.warGame.initializeGame();
            
            // Update UI
            this.updateWarGameButtons(true);
            this.updateWarGameStats();
            this.visualizeWarGame();
            
            // Log war game messages to main log
            const warLogs = this.warGame.getGameLog();
            warLogs.forEach(msg => this.log(msg, 'success'));
            
            this.showNotification("War game started!");
        } catch (err) {
            this.log("Failed to start War game", 'error', { error: err.message });
            this.showNotification("Failed to start War game", 'error');
        }
    }

    // Handle playing one round
    handlePlayWarRound() {
        try {
            if (!this.warGame || this.warGame.isGameOver) {
                throw new Error("No active war game!");
            }
            
            const oldLogCount = this.warGame.getGameLog().length;
            this.warGame.playRound();
            
            // Log new messages
            const newLogs = this.warGame.getGameLog().slice(oldLogCount);
            newLogs.forEach(msg => this.log(msg, 'info'));
            
            this.updateWarGameStats();
            this.visualizeWarGame();
            
            if (this.warGame.isGameOver) {
                this.updateWarGameButtons(false);
                this.showNotification("War game finished!");
            }
        } catch (err) {
            this.log("Failed to play war round", 'error', { error: err.message });
            this.showNotification(err.message, 'error');
        }
    }

    // Handle auto-playing the complete game
    handleAutoPlayWar() {
        try {
            if (!this.warGame || this.warGame.isGameOver) {
                throw new Error("No active war game!");
            }
            
            const oldLogCount = this.warGame.getGameLog().length;
            
            // Play until game over or max rounds
            while (!this.warGame.isGameOver && this.warGame.turnCount < 1000) {
                this.warGame.playRound();
            }
            
            // Log new messages
            const newLogs = this.warGame.getGameLog().slice(oldLogCount);
            newLogs.forEach(msg => this.log(msg, 'info'));
            
            this.updateWarGameStats();
            this.visualizeWarGame();
            this.updateWarGameButtons(false);
            
            this.showNotification("Auto-play completed!");
        } catch (err) {
            this.log("Failed to auto-play war game", 'error', { error: err.message });
            this.showNotification(err.message, 'error');
        }
    }

    // Handle showing current game state
    handleShowWarState() {
        try {
            if (!this.warGame) {
                throw new Error("No war game instance!");
            }
            
            const state = this.warGame.getGameState();
            this.log("Current War Game State:", 'info', state);
            this.showNotification("Game state logged!");
        } catch (err) {
            this.log("Failed to show war state", 'error', { error: err.message });
            this.showNotification(err.message, 'error');
        }
    }

    // Update button states
    updateWarGameButtons(gameActive) {
        const playRoundBtn = document.getElementById('play-war-round');
        const autoPlayBtn = document.getElementById('auto-play-war');
        const showStateBtn = document.getElementById('show-war-state');
        
        if (playRoundBtn) playRoundBtn.disabled = !gameActive;
        if (autoPlayBtn) autoPlayBtn.disabled = !gameActive;
        if (showStateBtn) showStateBtn.disabled = !this.warGame;
    }

    // Update War game statistics display
    updateWarGameStats() {
        const roundsElement = document.getElementById('war-rounds');
        const statusElement = document.getElementById('war-status');
        
        if (this.warGame) {
            if (roundsElement) roundsElement.textContent = this.warGame.turnCount;
            if (statusElement) statusElement.textContent = this.warGame.isGameOver ? 'Finished' : 'Playing';
        } else {
            if (roundsElement) roundsElement.textContent = '0';
            if (statusElement) statusElement.textContent = 'Not Started';
        }
    }

    // Visualize the War game state
    visualizeWarGame() {
        if (!this.warGame) return;
        
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard) return;
        
        const state = this.warGame.getGameState();
        
        // Clear existing content
        gameBoard.innerHTML = '';
        
        // Create visual representation of war game zones
        this.createWarGameZone('Player 1 Hand', 50, 50, state.player1.handCards, '#4299e1');
        this.createWarGameZone('Player 1 Battle', 50, 150, this.warGame.engine.getCardAmountFromZone(this.warGame.player1BattlePile), '#e53e3e');
        this.createWarGameZone('Player 1 Won Cards', 50, 250, state.player1.wonCards, '#38a169');
        
        this.createWarGameZone('Player 2 Hand', 300, 50, state.player2.handCards, '#4299e1');
        this.createWarGameZone('Player 2 Battle', 300, 150, this.warGame.engine.getCardAmountFromZone(this.warGame.player2BattlePile), '#e53e3e');
        this.createWarGameZone('Player 2 Won Cards', 300, 250, state.player2.wonCards, '#38a169');
        
        // Add game info display
        const infoDiv = document.createElement('div');
        infoDiv.style.position = 'absolute';
        infoDiv.style.top = '350px';
        infoDiv.style.left = '50px';
        infoDiv.style.color = '#e2e8f0';
        infoDiv.style.fontSize = '1rem';
        infoDiv.innerHTML = `
            <div><strong>Round:</strong> ${this.warGame.turnCount}</div>
            <div><strong>Player 1 Total:</strong> ${state.player1.totalCards} cards</div>
            <div><strong>Player 2 Total:</strong> ${state.player2.totalCards} cards</div>
            <div><strong>Status:</strong> ${this.warGame.isGameOver ? 'Game Over' : 'Playing'}</div>
        `;
        gameBoard.appendChild(infoDiv);
    }

    // Create a visual zone for the War game
    createWarGameZone(label, x, y, cardCount, color) {
        const gameBoard = document.getElementById('game-board');
        if (!gameBoard) return;
        
        const zoneElement = document.createElement('div');
        zoneElement.className = 'zone';
        zoneElement.style.left = x + 'px';
        zoneElement.style.top = y + 'px';
        zoneElement.style.width = '120px';
        zoneElement.style.height = '80px';
        zoneElement.style.borderColor = color;
        zoneElement.style.background = `${color}20`;
        
        zoneElement.innerHTML = `
            <div class="zone-label">${label}</div>
            <div style="color: ${color}; font-weight: bold; font-size: 1.2rem;">${cardCount} cards</div>
        `;
        
        gameBoard.appendChild(zoneElement);
    }

    // Utility functions for UI integration
    log(message, type = 'info', data = null) {
        // Try to use existing log function if available
        if (typeof window.log === 'function') {
            window.log(message, type, data);
            return;
        }
        
        // Fallback to creating log entries manually
        const logContainer = document.getElementById("log-entries");
        if (!logContainer) {
            console.log(message, data);
            return;
        }
        
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement("div");
        
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `<strong>[${time}]</strong> ${message}`;
        
        if (data) {
            const pre = document.createElement("pre");
            pre.textContent = JSON.stringify(data, null, 2);
            pre.style.marginTop = '8px';
            pre.style.fontSize = '0.8rem';
            entry.appendChild(pre);
        }

        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    showNotification(message, type = 'success') {
        // Try to use existing notification function if available
        if (typeof window.showNotification === 'function') {
            window.showNotification(message, type);
            return;
        }
        
        // Fallback to simple console log
        console.log(`${type.toUpperCase()}: ${message}`);
    }
}

// Global functions to be called from HTML (for compatibility)
let warGameUI = null;

function handleStartWarGame() {
    if (warGameUI) warGameUI.handleStartWarGame();
}

function handlePlayWarRound() {
    if (warGameUI) warGameUI.handlePlayWarRound();
}

function handleAutoPlayWar() {
    if (warGameUI) warGameUI.handleAutoPlayWar();
}

function handleShowWarState() {
    if (warGameUI) warGameUI.handleShowWarState();
}

// Auto-initialize when script loads
warGameUI = new WarGameUI();

// Example usage for standalone testing:
// const game = new SimpleWarGame();
// game.playCompleteGame();
// console.log(game.getGameState());
