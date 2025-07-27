// Hello World Card Game
const HelloWorldGame = {
    // Game initialization
    init: function() {
        this.gameState = 'playing';
        this.message = 'Hello World';
    },

    // Setup the game
    setup: function() {
        // Clear any existing content
        if (typeof clearTable !== 'undefined') {
            clearTable();
        }
        
        // Display Hello World message
        this.displayMessage();
    },

    // Display the message
    displayMessage: function() {
        // Create a text element to display Hello World
        const messageElement = document.createElement('div');
        messageElement.style.fontSize = '48px';
        messageElement.style.textAlign = 'center';
        messageElement.style.marginTop = '100px';
        messageElement.style.color = '#333';
        messageElement.style.fontFamily = 'Arial, sans-serif';
        messageElement.textContent = this.message;
        
        // Add to the game area
        if (document.getElementById('game-area')) {
            document.getElementById('game-area').appendChild(messageElement);
        } else if (document.body) {
            document.body.appendChild(messageElement);
        } else {
            console.log(this.message);
        }
    },

    // Handle player actions (minimal implementation)
    handleAction: function(action) {
        console.log('Action received:', action);
    },

    // Get game state
    getState: function() {
        return {
            gameState: this.gameState,
            message: this.message
        };
    },

    // Start new game
    newGame: function() {
        this.init();
        this.setup();
    }
};

// Initialize the game when loaded
if (typeof window !== 'undefined') {
    window.addEventListener('load', function() {
        HelloWorldGame.newGame();
    });
}

// Export for use with the card game engine
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelloWorldGame;
}
