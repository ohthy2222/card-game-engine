function startGame(gameEngine) {
    console.log("🎮 Starting Simple War Card Game...");
    
    try {
        // Clear the display
        gameEngine.clearDisplay();
        gameEngine.setGameTitle("⚔️ WAR - Card Battle ⚔️");
        
        // Create two players
        const player1 = gameEngine.createPlayer();
        const player2 = gameEngine.createPlayer();
        console.log("Created players:", player1, player2);
        
        // Create the standard 52-card deck
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const rankValues = {
            '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
            'J': 11, 'Q': 12, 'K': 13, 'A': 14
        };
        
        let allCards = [];
        
        // Create all 52 cards
        for (let suit of suits) {
            for (let rank of ranks) {
                const card = gameEngine.createCard();
                card.suit = suit;
                card.rank = rank;
                card.value = rankValues[rank];
                card.display = rank + suit;
                allCards.push(card);
            }
        }
        
        // Shuffle the deck
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }
        
        // Split cards between players
        const player1Cards = allCards.slice(0, 26);
        const player2Cards = allCards.slice(26, 52);
        
        // Create decks for each player
        const player1Deck = gameEngine.createDeck(player1, player1Cards);
        const player2Deck = gameEngine.createDeck(player2, player2Cards);
        
        // Create zones for the battlefield
        const player1Zone = gameEngine.createZone(player1, 100, 200, 100, 150, false, true);
        const player2Zone = gameEngine.createZone(player2, 300, 200, 100, 150, false, true);
        
        // Store game state
        window.warGameState = {
            gameEngine: gameEngine,
            player1: player1,
            player2: player2,
            player1Deck: player1Deck,
            player2Deck: player2Deck,
            player1Zone: player1Zone,
            player2Zone: player2Zone,
            player1Cards: player1Cards,
            player2Cards: player2Cards,
            gameStarted: false,
            gameOver: false
        };
        
        // Display initial game state
        updateDisplay();
        
        // Set up click handler for revealing cards
        const gameContent = document.getElementById('game-content');
        gameContent.onclick = function(event) {
            if (window.warGameState.gameOver) {
                window.log("Game is over! Refresh to play again.", 'info');
                return;
            }
            
            if (!window.warGameState.gameStarted) {
                revealCards();
            }
        };
        
        window.log("Game initialized! Click anywhere to reveal the top cards.", 'success');
        window.showNotification("Click to start the battle!", 'info');
        
        return true;
        
    } catch (error) {
        console.error("Error starting game:", error);
        window.log("Failed to start game: " + error.message, 'error');
        return false;
    }
}

function updateDisplay() {
    const state = window.warGameState;
    const gameEngine = state.gameEngine;
    
    gameEngine.clearDisplay();
    gameEngine.setGameTitle("⚔️ WAR - Card Battle ⚔️");
    
    // Display player decks
    gameEngine.displayText("Player 1", 'left', 'medium');
    gameEngine.displayText(`Cards: ${state.player1Cards.length}`, 'left', 'small');
    
    gameEngine.displayText("Player 2", 'left', 'medium');
    gameEngine.displayText(`Cards: ${state.player2Cards.length}`, 'left', 'small');
    
    if (!state.gameStarted && !state.gameOver) {
        gameEngine.displayText("Click to reveal cards!", 'center', 'large');
    }
}

function revealCards() {
    const state = window.warGameState;
    const gameEngine = state.gameEngine;
    
    if (state.player1Cards.length === 0 || state.player2Cards.length === 0) {
        window.log("No cards left to play!", 'error');
        return;
    }
    
    state.gameStarted = true;
    
    // Get top cards
    const player1Card = state.player1Cards[0];
    const player2Card = state.player2Cards[0];
    
    // Move cards to battlefield zones
    gameEngine.moveCardToZone(player1Card, state.player1Deck, state.player1Zone, true);
    gameEngine.moveCardToZone(player2Card, state.player2Deck, state.player2Zone, true);
    
    // Clear and update display
    gameEngine.clearDisplay();
    gameEngine.setGameTitle("⚔️ WAR - Card Battle ⚔️");
    
    // Display the battle
    gameEngine.displayText("BATTLE!", 'center', 'large');
    
    // Display player 1's card
    gameEngine.displayText(`Player 1: ${player1Card.display}`, 'left', 'medium');
    gameEngine.displayText(`Value: ${player1Card.value}`, 'left', 'small');
    
    // Display player 2's card
    gameEngine.displayText(`Player 2: ${player2Card.display}`, 'left', 'medium');
    gameEngine.displayText(`Value: ${player2Card.value}`, 'left', 'small');
    
    // Determine winner
    let winner = null;
    let winnerMessage = "";
    
    if (player1Card.value > player2Card.value) {
        winner = "Player 1";
        winnerMessage = `🎉 Player 1 WINS! ${player1Card.display} beats ${player2Card.display}`;
    } else if (player2Card.value > player1Card.value) {
        winner = "Player 2";
        winnerMessage = `🎉 Player 2 WINS! ${player2Card.display} beats ${player1Card.display}`;
    } else {
        winner = "TIE";
        winnerMessage = `🤝 It's a TIE! Both cards are ${player1Card.rank}`;
    }
    
    // Display winner
    gameEngine.displayText(winnerMessage, 'bottom', 'large');
    
    // Log the result
    window.log(winnerMessage, 'success');
    window.showNotification(winnerMessage, 'success');
    
    // Mark game as over
    state.gameOver = true;
    
    // Final message
    gameEngine.displayText("Game Over! Refresh to play again.", 'bottom', 'small');
}
