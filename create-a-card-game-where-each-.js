function startGame(gameEngine) {
    console.log("🎮 Starting War Card Game...");
    
    try {
        // Clear display and set title
        gameEngine.clearDisplay();
        gameEngine.setGameTitle("⚔️ War - Card Battle ⚔️");
        
        // Create players
        const player1 = gameEngine.createPlayer();
        const player2 = gameEngine.createPlayer();
        console.log("Players created:", player1, player2);
        
        // Create standard 52-card deck
        const suits = ['♠', '♥', '♦', '♣'];
        const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const values = { 'A': 14, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, 
                        '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13 };
        
        const allCards = [];
        
        // Generate all 52 cards
        for (const suit of suits) {
            for (const rank of ranks) {
                const card = gameEngine.createCard();
                card.suit = suit;
                card.rank = rank;
                card.display = rank + suit;
                card.value = values[rank];
                allCards.push(card);
            }
        }
        
        // Shuffle the deck
        for (let i = allCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
        }
        
        // Split deck between players
        const player1Cards = allCards.slice(0, 26);
        const player2Cards = allCards.slice(26);
        
        // Create decks for each player
        const player1Deck = gameEngine.createDeck(player1, player1Cards);
        const player2Deck = gameEngine.createDeck(player2, player2Cards);
        
        console.log("Player 1 deck size:", player1Cards.length);
        console.log("Player 2 deck size:", player2Cards.length);
        
        // Get top cards for the battle
        const player1TopCard = player1Cards[0];
        const player2TopCard = player2Cards[0];
        
        // Display initial game state
        gameEngine.displayText("WAR - CARD BATTLE", 'center', 'large');
        gameEngine.displayText("Player 1: 26 cards", 'left', 'medium');
        gameEngine.displayText("Player 2: 26 cards", 'left', 'medium');
        gameEngine.displayText("Click anywhere to reveal cards!", 'bottom', 'large');
        
        // Display face-down cards
        gameEngine.displayCard(player1TopCard, 200, 300, false);
        gameEngine.displayCard(player2TopCard, 500, 300, false);
        
        // Store game state
        window.warGameState = {
            player1: player1,
            player2: player2,
            player1Deck: player1Deck,
            player2Deck: player2Deck,
            player1TopCard: player1TopCard,
            player2TopCard: player2TopCard,
            gameEngine: gameEngine,
            battleRevealed: false
        };
        
        // Set up click handler for battle
        const gameContent = document.getElementById('game-content');
        gameContent.onclick = function(event) {
            if (!window.warGameState.battleRevealed) {
                revealBattle();
            }
        };
        
        window.log("War game initialized successfully!", 'success');
        return true;
        
    } catch (error) {
        console.error("Error starting War game:", error);
        window.log("Failed to start War game: " + error.message, 'error');
        return false;
    }
}

function revealBattle() {
    const state = window.warGameState;
    const gameEngine = state.gameEngine;
    
    // Mark battle as revealed
    state.battleRevealed = true;
    
    // Clear and update display
    gameEngine.clearDisplay();
    gameEngine.setGameTitle("⚔️ War - Battle Result ⚔️");
    
    // Determine winner
    const card1 = state.player1TopCard;
    const card2 = state.player2TopCard;
    let winner = "";
    let resultText = "";
    
    if (card1.value > card2.value) {
        winner = "Player 1";
        resultText = "🎉 PLAYER 1 WINS! 🎉";
    } else if (card2.value > card1.value) {
        winner = "Player 2";
        resultText = "🎉 PLAYER 2 WINS! 🎉";
    } else {
        winner = "Tie";
        resultText = "⚖️ IT'S A TIE! ⚖️";
    }
    
    // Display battle information
    gameEngine.displayText("BATTLE REVEALED!", 'center', 'large');
    gameEngine.displayText(`Player 1: ${card1.display}`, 'left', 'medium');
    gameEngine.displayText(`Player 2: ${card2.display}`, 'left', 'medium');
    gameEngine.displayText(resultText, 'bottom', 'large');
    
    // Display cards face-up with slight animation effect
    gameEngine.displayCard(card1, 250, 300, true);
    gameEngine.displayCard(card2, 450, 300, true);
    
    // Animate cards moving to center for dramatic effect
    setTimeout(() => {
        const card1Element = document.getElementById(`visual-card-${card1.id}`);
        const card2Element = document.getElementById(`visual-card-${card2.id}`);
        
        if (card1Element && card2Element) {
            gameEngine.animateCardMovement(card1Element, 250, 300, 300, 300, 500);
            gameEngine.animateCardMovement(card2Element, 450, 300, 400, 300, 500);
        }
    }, 100);
    
    // Log the result
    window.log(`Battle: ${card1.display} vs ${card2.display} - ${winner} wins!`, 'success');
    
    // Show notification
    window.showNotification(resultText, winner === "Tie" ? 'info' : 'success');
}
