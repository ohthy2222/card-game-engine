// Hello World Card Game
class HelloWorldGame {
    constructor() {
        this.gameTitle = "Hello World Card Game";
        this.gameStarted = false;
    }

    // Initialize the game
    init(engine) {
        this.engine = engine;
        this.engine.setGameTitle(this.gameTitle);
        this.setupGame();
    }

    // Set up the game
    setupGame() {
        // Clear any existing content
        this.engine.clearAll();
        
        // Create a simple start button
        this.engine.addButton("Start Game", () => this.startGame());
    }

    // Start the game and display Hello World
    startGame() {
        this.gameStarted = true;
        this.engine.clearAll();
        
        // Display Hello World message
        this.engine.displayMessage("Hello World", "large");
        
        // Add a reset button
        this.engine.addButton("Reset", () => this.resetGame());
    }

    // Reset the game
    resetGame() {
        this.gameStarted = false;
        this.setupGame();
    }
}

// Create and export the game instance
const game = new HelloWorldGame();

// Initialize the game when the engine is ready
if (typeof cardGameEngine !== 'undefined') {
    game.init(cardGameEngine);
}