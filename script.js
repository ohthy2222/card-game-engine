// Card Game Engine - Complete JavaScript Implementation

// Core Classes

class Card {
	constructor(id, suit, rank, value) {
		this.id = id;
		this.suit = suit; // 'hearts', 'diamonds', 'clubs', 'spades'
		this.rank = rank; // 'A', '2', '3', ..., 'J', 'Q', 'K'
		this.value = value; // Numeric value for comparisons
		this.faceUp = false;
		this.element = null;
	}
	
	getId() {
		return this.id;
	}
	
	getValue() {
		return this.value;
	}
	
	getSuit() {
		return this.suit;
	}
	
	getRank() {
		return this.rank;
	}
	
	flip() {
		this.faceUp = !this.faceUp;
		this.updateDisplay();
	}
	
	isFaceUp() {
		return this.faceUp;
	}
	
	setFaceUp(faceUp) {
		this.faceUp = faceUp;
		this.updateDisplay();
	}
	
	getDisplayText() {
		if (!this.faceUp) return '';
		return this.rank;
	}
	
	getDisplayRank() {
		if (!this.faceUp) return '';
		// Convert face cards to display characters
		switch(this.rank) {
			case 'A': return 'A';
			case 'J': return 'J';
			case 'Q': return 'Q'; 
			case 'K': return 'K';
			default: return this.rank;
		}
	}
	
	getSuitSymbol() {
		const symbols = {
			'hearts': '♥',
			'diamonds': '♦',
			'clubs': '♣',
			'spades': '♠'
		};
		return symbols[this.suit] || '?';
	}
	
	isRed() {
		return this.suit === 'hearts' || this.suit === 'diamonds';
	}
	
	createElement() {
		this.element = document.createElement('div');
		this.element.className = 'card';
		this.element.onclick = () => this.onClick();
		this.updateDisplay();
		return this.element;
	}
	
	updateDisplay() {
		if (!this.element) return;
		
		// Clear previous content
		this.element.innerHTML = '';
		
		if (this.faceUp) {
			// Create card structure for face-up cards
			const topCorner = document.createElement('div');
			topCorner.className = 'card-top';
			topCorner.innerHTML = this.getDisplayRank() + '<br>' + this.getSuitSymbol();
			
			const centerSuit = document.createElement('div');
			centerSuit.className = 'card-center';
			centerSuit.textContent = this.getSuitSymbol();
			
			const bottomCorner = document.createElement('div');
			bottomCorner.className = 'card-bottom';
			bottomCorner.innerHTML = this.getDisplayRank() + '<br>' + this.getSuitSymbol();
			
			this.element.appendChild(topCorner);
			this.element.appendChild(centerSuit);
			this.element.appendChild(bottomCorner);
		} else {
			// Face-down card shows card back pattern
			this.element.innerHTML = '<div style="color: white; font-size: 16px; margin: auto;">🂠</div>';
		}
		
		this.element.className = 'card ' + 
			(this.faceUp ? 'face-up' : 'face-down') + 
			(this.faceUp ? (this.isRed() ? ' red' : ' black') : '');
	}
	
	onClick() {
		gameEngine.onCardClick(this);
	}
}

class Deck {
	constructor() {
		this.cards = [];
		this.createStandardDeck();
	}
	
	createStandardDeck() {
		const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
		const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
		const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
		
		let id = 1;
		for (let suit of suits) {
			for (let i = 0; i < ranks.length; i++) {
				this.cards.push(new Card(id++, suit, ranks[i], values[i]));
			}
		}
	}
	
	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
	}
	
	deal(count = 1) {
		return this.cards.splice(0, count);
	}
	
	addCard(card) {
		this.cards.push(card);
	}
	
	getCards() {
		return [...this.cards];
	}
	
	isEmpty() {
		return this.cards.length === 0;
	}
	
	getCount() {
		return this.cards.length;
	}
}

class Zone {
	constructor(name, playerId, x, y, width, height, options = {}) {
		this.name = name;
		this.playerId = playerId;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.options = options;
		this.cards = [];
		this.element = null;
		this.maxCards = options.maxCards || Infinity;
		this.faceDown = options.faceDown || false;
		this.faceUp = options.faceUp || false;
	}
	
	addCard(card) {
		if (this.cards.length >= this.maxCards) {
			gameEngine.log(`Cannot add card to ${this.name}: zone is full`);
			return false;
		}
		
		this.cards.push(card);
		
		// Set card face based on zone settings
		if (this.faceDown) card.setFaceUp(false);
		if (this.faceUp) card.setFaceUp(true);
		
		this.updateDisplay();
		return true;
	}
	
	removeCard(cardId) {
		const index = this.cards.findIndex(card => card.getId() === cardId);
		if (index === -1) return null;
		
		const card = this.cards.splice(index, 1)[0];
		this.updateDisplay();
		return card;
	}
	
	removeTopCard() {
		if (this.cards.length === 0) return null;
		const card = this.cards.pop();
		this.updateDisplay();
		return card;
	}
	
	getTopCard() {
		return this.cards.length > 0 ? this.cards[this.cards.length - 1] : null;
	}
	
	getCardCount() {
		return this.cards.length;
	}
	
	getCards() {
		return [...this.cards];
	}
	
	shuffle() {
		for (let i = this.cards.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
		}
		this.updateDisplay();
	}
	
	clear() {
		this.cards = [];
		this.updateDisplay();
	}
	
	createElement() {
		this.element = document.createElement('div');
		this.element.className = 'zone';
		this.element.style.left = (this.x * 80) + 'px';
		this.element.style.top = (this.y * 100) + 'px';
		this.element.style.width = (this.width * 80) + 'px';
		this.element.style.height = (this.height * 100) + 'px';
		
		// Ensure zones stay below UI elements
		this.preventOverlapWithUI();
		
		const label = document.createElement('div');
		label.className = 'zone-label';
		label.textContent = this.name + (this.playerId !== null ? ` (P${this.playerId})` : '');
		this.element.appendChild(label);
		
		this.updateDisplay();
		return this.element;
	}
	
	preventOverlapWithUI() {
		// Calculate boundaries to prevent overlap with logs and controls
		const gameBoard = document.getElementById('game-board');
		const logElement = document.getElementById('game-log');
		
		if (gameBoard && logElement) {
			const boardRect = gameBoard.getBoundingClientRect();
			const logRect = logElement.getBoundingClientRect();
			
			// Calculate maximum safe Y position to avoid log overlap
			const maxSafeY = boardRect.height - 220; // Leave space for log (200px + margin)
			const currentY = this.y * 100;
			
			// If zone would overlap with log area, constrain it
			if (currentY + (this.height * 100) > maxSafeY) {
				const adjustedY = Math.max(0, maxSafeY - (this.height * 100));
				this.element.style.top = adjustedY + 'px';
				this.element.style.zIndex = '1'; // Ensure zones stay below UI
			}
			
			// Ensure zones don't go off the right edge
			const maxSafeX = boardRect.width - (this.width * 80);
			const currentX = this.x * 80;
			
			if (currentX > maxSafeX) {
				this.element.style.left = Math.max(0, maxSafeX) + 'px';
			}
		}
		
		// Prevent overlap with other zones
		this.preventZoneOverlap();
	}
	
	preventZoneOverlap() {
		const gameBoard = document.getElementById('game-board');
		if (!gameBoard) return;
		
		// Get all existing zones on the board (excluding this one)
		const existingZones = Array.from(gameBoard.querySelectorAll('.zone')).filter(zone => zone !== this.element);
		const currentZoneRect = this.getZoneBounds();
		
		let adjustmentsMade = true;
		let attempts = 0;
		const maxAttempts = 20; // Increased attempts for better resolution
		
		while (adjustmentsMade && attempts < maxAttempts) {
			adjustmentsMade = false;
			attempts++;
			
			for (let existingZone of existingZones) {
				const existingRect = this.getElementBounds(existingZone);
				
				// Check for overlap with expanded collision detection
				if (this.zonesOverlap(currentZoneRect, existingRect, 15)) { // 15px buffer
					// Calculate new position to avoid overlap
					const newPosition = this.calculateNonOverlappingPosition(currentZoneRect, existingRect);
					
					if (newPosition) {
						this.element.style.left = newPosition.x + 'px';
						this.element.style.top = newPosition.y + 'px';
						
						// Update current zone bounds for next iteration
						currentZoneRect.x = newPosition.x;
						currentZoneRect.y = newPosition.y;
						
						adjustmentsMade = true;
						break; // Handle one overlap at a time
					}
				}
			}
		}
		
		// Final validation - if still overlapping, find any free space
		if (attempts >= maxAttempts) {
			const freePosition = this.findFreeSpace();
			if (freePosition) {
				this.element.style.left = freePosition.x + 'px';
				this.element.style.top = freePosition.y + 'px';
			}
		}
	}
	
	getZoneBounds() {
		return {
			x: parseInt(this.element.style.left) || (this.x * 80),
			y: parseInt(this.element.style.top) || (this.y * 100),
			width: this.width * 80,
			height: this.height * 100
		};
	}
	
	getElementBounds(element) {
		return {
			x: parseInt(element.style.left) || 0,
			y: parseInt(element.style.top) || 0,
			width: parseInt(element.style.width) || 80,
			height: parseInt(element.style.height) || 100
		};
	}
	
	zonesOverlap(rect1, rect2, buffer = 0) {
		return !(rect1.x + rect1.width + buffer <= rect2.x || 
				rect2.x + rect2.width + buffer <= rect1.x || 
				rect1.y + rect1.height + buffer <= rect2.y || 
				rect2.y + rect2.height + buffer <= rect1.y);
	}
	
	calculateNonOverlappingPosition(currentRect, existingRect) {
		const gameBoard = document.getElementById('game-board');
		if (!gameBoard) return null;
		
		const boardRect = gameBoard.getBoundingClientRect();
		const maxSafeY = boardRect.height - 250; // Account for log area
		const maxSafeX = boardRect.width - currentRect.width - 40; // Account for padding
		
		const buffer = 20; // Increased buffer between zones
		
		// Try different positions: right, left, below, above
		const positions = [
			// Right of existing zone
			{ x: existingRect.x + existingRect.width + buffer, y: currentRect.y },
			// Left of existing zone  
			{ x: existingRect.x - currentRect.width - buffer, y: currentRect.y },
			// Below existing zone
			{ x: currentRect.x, y: existingRect.y + existingRect.height + buffer },
			// Above existing zone
			{ x: currentRect.x, y: existingRect.y - currentRect.height - buffer },
			// Right and below
			{ x: existingRect.x + existingRect.width + buffer, y: existingRect.y + existingRect.height + buffer },
			// Left and above
			{ x: existingRect.x - currentRect.width - buffer, y: existingRect.y - currentRect.height - buffer },
			// Right and above
			{ x: existingRect.x + existingRect.width + buffer, y: existingRect.y - currentRect.height - buffer },
			// Left and below
			{ x: existingRect.x - currentRect.width - buffer, y: existingRect.y + existingRect.height + buffer }
		];
		
		// Find first valid position
		for (let pos of positions) {
			if (pos.x >= 20 && pos.x <= maxSafeX && 
				pos.y >= 20 && pos.y + currentRect.height <= maxSafeY) {
				
				// Check if this position conflicts with other zones
				const testRect = { x: pos.x, y: pos.y, width: currentRect.width, height: currentRect.height };
				let conflicts = false;
				
				const allZones = gameBoard.querySelectorAll('.zone');
				for (let zone of allZones) {
					if (zone === this.element) continue;
					const zoneRect = this.getElementBounds(zone);
					if (this.zonesOverlap(testRect, zoneRect, 15)) {
						conflicts = true;
						break;
					}
				}
				
				if (!conflicts) {
					return pos;
				}
			}
		}
		
		return null; // No valid position found
	}
	
	findFreeSpace() {
		const gameBoard = document.getElementById('game-board');
		if (!gameBoard) return null;
		
		const boardRect = gameBoard.getBoundingClientRect();
		const maxSafeY = boardRect.height - 250;
		const maxSafeX = boardRect.width - this.width * 80 - 40;
		
		// Grid search for free space
		for (let y = 20; y <= maxSafeY; y += 50) {
			for (let x = 20; x <= maxSafeX; x += 50) {
				const testRect = { x: x, y: y, width: this.width * 80, height: this.height * 100 };
				let conflicts = false;
				
				const allZones = gameBoard.querySelectorAll('.zone');
				for (let zone of allZones) {
					if (zone === this.element) continue;
					const zoneRect = this.getElementBounds(zone);
					if (this.zonesOverlap(testRect, zoneRect, 15)) {
						conflicts = true;
						break;
					}
				}
				
				if (!conflicts) {
					return { x: x, y: y };
				}
			}
		}
		
		return null;
	}
	
	updateDisplay() {
		if (!this.element) return;
		
		// Clear existing cards
		const cards = this.element.querySelectorAll('.card');
		cards.forEach(card => card.remove());
		
		// Add current cards with overlap logic
		this.cards.forEach((card, index) => {
			const cardElement = card.createElement();
			cardElement.style.zIndex = index;
			
			// Apply overlap positioning if more than 3 cards
			if (this.cards.length > 3) {
				this.applyOverlapPositioning(cardElement, index);
			} else {
				// Reset positioning for 3 or fewer cards
				cardElement.style.position = 'relative';
				cardElement.style.left = '';
				cardElement.style.top = '';
				cardElement.style.transform = '';
			}
			
			this.element.appendChild(cardElement);
		});
	}
	
	applyOverlapPositioning(cardElement, index) {
		cardElement.style.position = 'absolute';
		
		// Calculate overlap based on zone dimensions and card count
		const maxOverlap = Math.min(15, 60 / this.cards.length); // Max 15px overlap, scales with card count
		
		// Determine layout direction based on zone dimensions
		const isWideZone = this.width >= this.height;
		
		if (isWideZone) {
			// Horizontal overlap for wide zones
			cardElement.style.left = (index * maxOverlap) + 'px';
			cardElement.style.top = '0px';
		} else {
			// Vertical overlap for tall zones
			cardElement.style.left = '0px';
			cardElement.style.top = (index * maxOverlap) + 'px';
		}
		
		// Slight fan effect for better visibility
		if (this.cards.length > 6) {
			const fanAngle = (index - this.cards.length / 2) * 2; // 2 degrees per card from center
			cardElement.style.transform = `rotate(${fanAngle}deg)`;
			cardElement.style.transformOrigin = 'center bottom';
		}
	}
}

class Player {
	constructor(id, name = null) {
		this.id = id;
		this.name = name || `Player ${id}`;
		this.score = 0;
		this.zones = new Map();
	}
	
	getId() {
		return this.id;
	}
	
	getName() {
		return this.name;
	}
	
	getScore() {
		return this.score;
	}
	
	setScore(score) {
		this.score = score;
		gameEngine.updateDisplay();
	}
	
	adjustScore(amount) {
		this.score += amount;
		gameEngine.updateDisplay();
	}
	
	addZone(zone) {
		this.zones.set(zone.name, zone);
	}
	
	getZone(zoneName) {
		return this.zones.get(zoneName);
	}
	
	getAllZones() {
		return Array.from(this.zones.values());
	}
}

class GameBoard {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.zones = [];
		this.element = document.getElementById('game-board');
	}
	
	getWidth() {
		return this.width;
	}
	
	getHeight() {
		return this.height;
	}
	
	addZone(zone) {
		this.zones.push(zone);
		if (this.element) {
			this.element.appendChild(zone.createElement());
		}
	}
	
	getZone(name, playerId = null) {
		return this.zones.find(zone => 
			zone.name === name && zone.playerId === playerId
		);
	}
	
	getAllZones() {
		return [...this.zones];
	}
	
	clear() {
		this.zones = [];
		if (this.element) {
			this.element.innerHTML = '';
		}
	}
}

class GameEngine {
	constructor() {
		this.players = [];
		this.board = null;
		this.deck = null;
		this.currentPlayerIndex = 0;
		this.gameState = 'waiting'; // 'waiting', 'playing', 'finished'
		this.turnCount = 0;
		this.gameRules = null;
		this.selectedCard = null;
		this.logElement = document.getElementById('game-log');
	}
	
	// Core Setup Functions
	createPlayer(name = null) {
		const id = this.players.length + 1;
		const player = new Player(id, name);
		this.players.push(player);
		this.updateDisplay();
		return id;
	}
	
	createBoard(width, height) {
		this.board = new GameBoard(width, height);
		return this.board;
	}
	
	createZone(name, playerId, x, y, width, height, options = {}) {
		if (!this.board) {
			this.log("Error: No board created. Call createBoard() first.");
			return false;
		}
		
		const zone = new Zone(name, playerId, x, y, width, height, options);
		this.board.addZone(zone);
		
		// Add to player's zones if playerId specified
		if (playerId !== null && playerId > 0) {
			const player = this.getPlayer(playerId);
			if (player) {
				player.addZone(zone);
			}
		}
		
		return zone;
	}
	
	// Card Operations
	moveCard(fromZoneName, toZoneName, playerId) {
		const fromZone = this.board.getZone(fromZoneName, playerId);
		const toZone = this.board.getZone(toZoneName, playerId);
		
		if (!fromZone || !toZone) {
			this.log(`Error: Could not find zones ${fromZoneName} or ${toZoneName}`);
			return false;
		}
		
		const card = fromZone.removeTopCard();
		if (!card) {
			this.log(`Error: No cards in ${fromZoneName}`);
			return false;
		}
		
		const success = toZone.addCard(card);
		if (success) {
			this.log(`Moved card from ${fromZoneName} to ${toZoneName}`);
		}
		return success;
	}
	
	flipCard(cardId) {
		// Find card in all zones
		for (let zone of this.board.getAllZones()) {
			const card = zone.getCards().find(c => c.getId() === cardId);
			if (card) {
				card.flip();
				this.log(`Flipped card ${cardId}`);
				return true;
			}
		}
		return false;
	}
	
	shuffleDeck(zoneName, playerId = null) {
		const zone = this.board.getZone(zoneName, playerId);
		if (zone) {
			zone.shuffle();
			this.log(`Shuffled ${zoneName}`);
			return true;
		}
		return false;
	}
	
	// Game Information
	getCardCount(zoneName, playerId = null) {
		const zone = this.board.getZone(zoneName, playerId);
		return zone ? zone.getCardCount() : 0;
	}
	
	getCardValue(cardId) {
		for (let zone of this.board.getAllZones()) {
			const card = zone.getCards().find(c => c.getId() === cardId);
			if (card) return card.getValue();
		}
		return null;
	}
	
	getTopCardId(zoneName, playerId = null) {
		const zone = this.board.getZone(zoneName, playerId);
		if (zone) {
			const topCard = zone.getTopCard();
			return topCard ? topCard.getId() : null;
		}
		return null;
	}
	
	compareCards(cardId1, cardId2) {
		const value1 = this.getCardValue(cardId1);
		const value2 = this.getCardValue(cardId2);
		
		if (value1 === null || value2 === null) return null;
		
		if (value1 > value2) return 1;
		if (value1 < value2) return -1;
		return 0;
	}
	
	// Game Flow
	startNewGame() {
		this.players = [];
		this.currentPlayerIndex = 0;
		this.turnCount = 0;
		this.gameState = 'waiting';
		this.selectedCard = null;
		this.gameType = null;
		
		if (this.board) {
			this.board.clear();
		}
		
		// Show Next Turn button by default (will be hidden for simultaneous games)
		const nextTurnBtn = document.getElementById('nextTurnBtn');
		if (nextTurnBtn) nextTurnBtn.style.display = 'inline-block';
		
		this.clearLog();
		this.log("New game started. Set up your game rules.");
		this.updateDisplay();
	}
	
	startTurn() {
		this.turnCount++;
		this.gameState = 'playing';
		this.log(`Turn ${this.turnCount} started. Current player: ${this.getCurrentPlayer().getName()}`);
		this.updateDisplay();
	}
	
	endTurn() {
		this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
		this.log(`Turn ended. Next player: ${this.getCurrentPlayer().getName()}`);
		this.updateDisplay();
	}
	
	nextTurn() {
		if (this.gameState === 'finished') {
			this.log("Game is finished. Start a new game to continue.");
			return;
		}
		
		if (this.checkWinCondition()) {
			this.endGame();
			return;
		}
		
		this.endTurn();
		this.startTurn();
	}
	
	checkWinCondition() {
		// Override this method for specific games
		return false;
	}
	
	endGame() {
		this.gameState = 'finished';
		this.log("Game finished!");
		this.updateDisplay();
	}
	
	// Player Management
	getPlayer(playerId) {
		return this.players.find(p => p.getId() === playerId);
	}
	
	getCurrentPlayer() {
		return this.players[this.currentPlayerIndex];
	}
	
	getAllPlayers() {
		return [...this.players];
	}
	
	// Scoring
	setScore(playerId, score) {
		const player = this.getPlayer(playerId);
		if (player) {
			player.setScore(score);
		}
	}
	
	adjustScore(playerId, amount) {
		const player = this.getPlayer(playerId);
		if (player) {
			player.adjustScore(amount);
		}
	}
	
	// Utility Functions
	log(message) {
		console.log(message);
		if (this.logElement) {
			const entry = document.createElement('div');
			entry.className = 'log-entry';
			entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
			this.logElement.appendChild(entry);
			this.logElement.scrollTop = this.logElement.scrollHeight;
		}
	}
	
	clearLog() {
		if (this.logElement) {
			this.logElement.innerHTML = '<div class="log-entry">Game log cleared.</div>';
		}
	}
	
	updateDisplay() {
		// Update game status
		const statusElement = document.getElementById('game-status');
		if (statusElement) {
			statusElement.textContent = `State: ${this.gameState} | Turn: ${this.turnCount}`;
		}
		
		// Update player info
		const playerInfoElement = document.getElementById('player-info');
		if (playerInfoElement) {
			let playerHtml = '';
			this.players.forEach(player => {
				const isCurrentPlayer = player === this.getCurrentPlayer();
				playerHtml += `<div style="${isCurrentPlayer ? 'font-weight: bold; color: #ffd700;' : ''}">
					${player.getName()}: ${player.getScore()} points
				</div>`;
			});
			playerInfoElement.innerHTML = playerHtml || 'No players';
		}
		
		// Update turn info
		const turnInfoElement = document.getElementById('turn-info');
		if (turnInfoElement) {
			if (this.players.length > 0 && this.gameState !== 'waiting') {
				turnInfoElement.textContent = `${this.getCurrentPlayer().getName()}'s turn`;
			} else {
				turnInfoElement.textContent = 'No game active';
			}
		}
	}
	
	// Event Handlers
	onCardClick(card) {
		if (this.selectedCard === card) {
			this.selectedCard = null;
			this.log("Card deselected");
		} else {
			this.selectedCard = card;
			this.log(`Selected ${card.getDisplayText()}`);
		}
	}
	
	// AI Helper Functions - These make it easy for AI to create games
	dealCardsToPlayers(cardsPerPlayer) {
		if (!this.deck) {
			this.deck = new Deck();
			this.deck.shuffle();
		}
		
		for (let i = 0; i < cardsPerPlayer; i++) {
			this.players.forEach(player => {
				const cards = this.deck.deal(1);
				if (cards.length > 0) {
					const handZone = player.getZone('hand');
					if (handZone) {
						handZone.addCard(cards[0]);
					}
				}
			});
		}
	}
	
	createStandardGameSetup(playerCount) {
		// Create players
		for (let i = 1; i <= playerCount; i++) {
			this.createPlayer();
		}
		
		// Create board
		this.createBoard(12, 10);
		
		// Create deck zone
		this.createZone('deck', null, 5, 4, 2, 2, {faceDown: true});
		
		// Create standard deck and place in deck zone
		this.deck = new Deck();
		this.deck.shuffle();
		const deckZone = this.board.getZone('deck');
		this.deck.getCards().forEach(card => {
			card.setFaceUp(false);
			deckZone.addCard(card);
		});
		
		this.log(`Created standard setup with ${playerCount} players`);
	}
	
	// Example Game Implementation - War
	loadWarGame() {
		this.startNewGame();
		this.log("Loading War game...");
		
		// Set game type for UI adjustments
		this.gameType = 'war';
		
		// Create 2 players
		const player1 = this.createPlayer("Player 1");
		const player2 = this.createPlayer("Player 2");
		
		// Create larger board
		this.createBoard(16, 12);
		
		// Create zones with better spacing (no deck zone needed for War)
		this.createZone('hand', player1, 1, 9, 4, 1, {faceDown: true});
		this.createZone('hand', player2, 1, 1, 4, 1, {faceDown: true});
		this.createZone('battlePile', player1, 6, 7, 2, 1, {faceUp: true});
		this.createZone('battlePile', player2, 6, 3, 2, 1, {faceUp: true});
		this.createZone('wonCards', player1, 11, 8, 3, 2, {faceUp: true});
		this.createZone('wonCards', player2, 11, 1, 3, 2, {faceUp: true});
		
		// Create and shuffle deck, then deal directly to players
		this.deck = new Deck();
		this.deck.shuffle();
		
		// Deal all 52 cards alternately to players (no deck zone)
		let dealToPlayer1 = true;
		while (!this.deck.isEmpty()) {
			const card = this.deck.deal(1)[0];
			card.setFaceUp(false);
			
			if (dealToPlayer1) {
				this.board.getZone('hand', player1).addCard(card);
			} else {
				this.board.getZone('hand', player2).addCard(card);
			}
			dealToPlayer1 = !dealToPlayer1;
		}
		
		this.gameState = 'playing';
		this.turnCount = 0; // Reset turn count for War
		
		// Hide Next Turn button for War (simultaneous turns)
		const nextTurnBtn = document.getElementById('nextTurnBtn');
		if (nextTurnBtn) nextTurnBtn.style.display = 'none';
		
		this.log("War game loaded! Each player has 26 cards. Click 'Play Round' to start.");
		this.updateDisplay();
	}
	
	playRound() {
		if (this.gameState !== 'playing') {
			this.log("No active game. Load War game first.");
			return;
		}
		
		// Increment turn counter at start of round (both players play simultaneously)
		if (this.gameType === 'war') {
			this.turnCount++;
		}
		
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		
		if (!player1 || !player2) {
			this.log("Error: Players not found");
			return;
		}
		
		const hand1 = player1.getZone('hand');
		const hand2 = player2.getZone('hand');
		const battle1 = player1.getZone('battlePile');
		const battle2 = player2.getZone('battlePile');
		
		// Check if both players need to reshuffle won cards
		this.checkAndReshuffleCards();
		
		// Check if game is over AFTER reshuffling
		if (hand1.getCardCount() === 0 && player1.getZone('wonCards').getCardCount() === 0) {
			this.log("Player 2 wins! Player 1 is completely out of cards.");
			this.endGame();
			return;
		}
		if (hand2.getCardCount() === 0 && player2.getZone('wonCards').getCardCount() === 0) {
			this.log("Player 1 wins! Player 2 is completely out of cards.");
			this.endGame();
			return;
		}
		
		// Play cards
		const card1 = hand1.removeTopCard();
		const card2 = hand2.removeTopCard();
		
		if (!card1 || !card2) {
			this.log("Error: Could not get cards from hands");
			return;
		}
		
		card1.setFaceUp(true);
		card2.setFaceUp(true);
		battle1.addCard(card1);
		battle2.addCard(card2);
		
		this.log(`Round ${this.turnCount}: Player 1 plays ${card1.getDisplayRank()}${card1.getSuitSymbol()}, Player 2 plays ${card2.getDisplayRank()}${card2.getSuitSymbol()}`);
		
		// Wait exactly 1 second before resolving
		setTimeout(() => {
			// Compare cards
			const comparison = this.compareCards(card1.getId(), card2.getId());
			
			if (comparison > 0) {
				// Player 1 wins
				this.log("Player 1 wins this round!");
				this.collectBattleCards(player1);
			} else if (comparison < 0) {
				// Player 2 wins
				this.log("Player 2 wins this round!");
				this.collectBattleCards(player2);
			} else {
				// War!
				this.log("WAR! Cards are equal!");
				this.playWar();
			}
		}, 1000); // Exactly 1 second delay
		
		this.updateDisplay();
	}
	
	collectBattleCards(winner) {
		const wonZone = winner.getZone('wonCards');
		const battle1 = this.board.getZone('battlePile', 1);
		const battle2 = this.board.getZone('battlePile', 2);
		
		// Collect all cards from both battle piles
		let collectedCards = 0;
		while (battle1.getCardCount() > 0) {
			const card = battle1.removeTopCard();
			card.setFaceUp(true); // Keep face up in won cards zone
			wonZone.addCard(card);
			collectedCards++;
		}
		while (battle2.getCardCount() > 0) {
			const card = battle2.removeTopCard();
			card.setFaceUp(true); // Keep face up in won cards zone
			wonZone.addCard(card);
			collectedCards++;
		}
		
		this.log(`${winner.getName()} collects ${collectedCards} cards`);
		this.updateDisplay();
	}
	
	checkAndReshuffleCards() {
		// Check both players and reshuffle if needed
		this.players.forEach(player => {
			const hand = player.getZone('hand');
			const wonZone = player.getZone('wonCards');
			
			if (hand.getCardCount() === 0 && wonZone.getCardCount() > 0) {
				this.log(`${player.getName()}'s hand is empty. Shuffling won cards back into hand.`);
				wonZone.shuffle();
				while (wonZone.getCardCount() > 0) {
					const card = wonZone.removeTopCard();
					card.setFaceUp(false); // Face down in hand
					hand.addCard(card);
				}
				this.log(`${player.getName()} now has ${hand.getCardCount()} cards in hand`);
			}
		});
	}
	
	playWar() {
		const player1 = this.getPlayer(1);
		const player2 = this.getPlayer(2);
		const hand1 = player1.getZone('hand');
		const hand2 = player2.getZone('hand');
		const battle1 = player1.getZone('battlePile');
		const battle2 = player2.getZone('battlePile');
		
		// Check if players need to reshuffle before war
		this.checkAndReshuffleCards();
		
		// Each player puts down 3 cards face down, then 1 face up
		for (let i = 0; i < 4; i++) {
			if (hand1.getCardCount() === 0 && player1.getZone('wonCards').getCardCount() === 0) {
				this.log("Player 1 runs out of cards during war! Player 2 wins!");
				this.endGame();
				return;
			}
			if (hand2.getCardCount() === 0 && player2.getZone('wonCards').getCardCount() === 0) {
				this.log("Player 2 runs out of cards during war! Player 1 wins!");
				this.endGame();
				return;
			}
			
			// Reshuffle again if hand becomes empty mid-war
			if (hand1.getCardCount() === 0) this.checkAndReshuffleCards();
			if (hand2.getCardCount() === 0) this.checkAndReshuffleCards();
			
			const card1 = hand1.removeTopCard();
			const card2 = hand2.removeTopCard();
			
			// Last card face up, others face down
			const faceUp = (i === 3);
			card1.setFaceUp(faceUp);
			card2.setFaceUp(faceUp);
			
			battle1.addCard(card1);
			battle2.addCard(card2);
		}
		
		// Wait 1 second for face-up cards to be visible
		setTimeout(() => {
			// Get the face-up cards for comparison
			const card1 = battle1.getTopCard();
			const card2 = battle2.getTopCard();
			
			this.log(`War continues: Player 1 plays ${card1.getDisplayRank()}${card1.getSuitSymbol()}, Player 2 plays ${card2.getDisplayRank()}${card2.getSuitSymbol()}`);
			
			const comparison = this.compareCards(card1.getId(), card2.getId());
			
			if (comparison > 0) {
				this.log("Player 1 wins the war!");
				this.collectBattleCards(player1);
			} else if (comparison < 0) {
				this.log("Player 2 wins the war!");
				this.collectBattleCards(player2);
			} else {
				this.log("Another war!");
				this.playWar(); // Recursive war
			}
		}, 1000); // 1 second delay for face-up cards
	}
	
	// Go Fish Game Implementation
	loadGoFishGame() {
		this.startNewGame();
		this.log("Loading Go Fish game...");
		
		// Set game type for UI adjustments
		this.gameType = 'gofish';
		
		// Create 4 players
		const player1 = this.createPlayer("Player 1");
		const player2 = this.createPlayer("Player 2");
		const player3 = this.createPlayer("Player 3");
		const player4 = this.createPlayer("Player 4");
		
		// Create board
		this.createBoard(14, 12);
		
		// Create deck zone in center
		this.createZone('deck', null, 6, 5, 2, 2, {faceDown: true});
		
		// Create hand zones for each player (positioned around the board)
		this.createZone('hand', player1, 1, 9, 4, 2, {faceUp: true}); // Bottom
		this.createZone('hand', player2, 9, 5, 2, 4, {faceUp: true}); // Right
		this.createZone('hand', player3, 1, 1, 4, 2, {faceUp: true}); // Top
		this.createZone('hand', player4, 1, 5, 2, 4, {faceUp: true}); // Left
		
		// Create books zones for collected sets
		this.createZone('books', player1, 1, 7, 4, 1, {faceUp: true});
		this.createZone('books', player2, 11, 5, 2, 4, {faceUp: true});
		this.createZone('books', player3, 1, 3, 4, 1, {faceUp: true});
		this.createZone('books', player4, 3, 5, 2, 4, {faceUp: true});
		
		// Create and shuffle deck
		this.deck = new Deck();
		this.deck.shuffle();
		const deckZone = this.board.getZone('deck');
		
		// Place all cards in deck zone first
		this.deck.getCards().forEach(card => {
			card.setFaceUp(false);
			deckZone.addCard(card);
		});
		
		// Deal 7 cards to each player
		for (let i = 0; i < 7; i++) {
			[player1, player2, player3, player4].forEach(playerId => {
				this.moveCard('deck', 'hand', playerId);
				const handZone = this.board.getZone('hand', playerId);
				const topCard = handZone.getTopCard();
				if (topCard) topCard.setFaceUp(true);
			});
		}
		
		// Check for initial books
		this.checkForBooks();
		
		this.gameState = 'playing';
		this.currentPlayerIndex = 0;
		this.turnCount = 0; // Reset turn count for Go Fish
		
		// Show Next Turn button for Go Fish (turn-based)
		const nextTurnBtn = document.getElementById('nextTurnBtn');
		if (nextTurnBtn) nextTurnBtn.style.display = 'inline-block';
		
		this.startTurn();
		this.log("Go Fish game loaded! Each player has 7 cards. Ask for cards by rank!");
		this.updateDisplay();
	}
	
	// Go Fish helper functions
	checkForBooks() {
		this.players.forEach(player => {
			const hand = player.getZone('hand');
			const books = player.getZone('books');
			const cards = hand.getCards();
			
			// Group cards by rank
			const rankCounts = {};
			cards.forEach(card => {
				const rank = card.getRank();
				if (!rankCounts[rank]) rankCounts[rank] = [];
				rankCounts[rank].push(card);
			});
			
			// Check for sets of 4
			Object.keys(rankCounts).forEach(rank => {
				if (rankCounts[rank].length === 4) {
					// Move all 4 cards to books
					rankCounts[rank].forEach(card => {
						hand.removeCard(card.getId());
						books.addCard(card);
					});
					
					player.adjustScore(1);
					this.log(`${player.getName()} collected a book of ${rank}s!`);
				}
			});
		});
	}
	
	askForCards(askingPlayer, targetPlayer, rank) {
		const askingHand = askingPlayer.getZone('hand');
		const targetHand = targetPlayer.getZone('hand');
		
		// Check if asking player has the rank they're asking for
		const askingCards = askingHand.getCards();
		const hasRank = askingCards.some(card => card.getRank() === rank);
		
		if (!hasRank) {
			this.log(`${askingPlayer.getName()} doesn't have any ${rank}s to ask for!`);
			return false;
		}
		
		// Find cards of the requested rank in target's hand
		const targetCards = targetHand.getCards();
		const matchingCards = targetCards.filter(card => card.getRank() === rank);
		
		if (matchingCards.length > 0) {
			// Transfer all matching cards
			matchingCards.forEach(card => {
				targetHand.removeCard(card.getId());
				askingHand.addCard(card);
			});
			
			this.log(`${targetPlayer.getName()} gives ${matchingCards.length} ${rank}(s) to ${askingPlayer.getName()}`);
			this.checkForBooks();
			return true; // Continue turn
		} else {
			this.log(`${targetPlayer.getName()}: "Go Fish!"`);
			
			// Draw from deck
			if (this.getCardCount('deck') > 0) {
				this.moveCard('deck', 'hand', askingPlayer.getId());
				const newCard = askingHand.getTopCard();
				if (newCard) {
					newCard.setFaceUp(true);
					this.log(`${askingPlayer.getName()} draws a card`);
				}
				this.checkForBooks();
			}
			
			return false; // End turn
		}
	}
	
	checkGoFishWinCondition() {
		// Game ends when all books are collected (13 books total)
		let totalBooks = 0;
		this.players.forEach(player => {
			totalBooks += player.getScore();
		});
		
		if (totalBooks === 13 || this.getCardCount('deck') === 0) {
			// Find winner (most books)
			let winner = this.players[0];
			let maxScore = winner.getScore();
			
			this.players.forEach(player => {
				if (player.getScore() > maxScore) {
					maxScore = player.getScore();
					winner = player;
				}
			});
			
			this.log(`Game Over! ${winner.getName()} wins with ${maxScore} books!`);
			this.endGame();
			return true;
		}
		
		return false;
	}
	
	// Override checkWinCondition for Go Fish
	checkWinCondition() {
		if (this.gameState === 'playing' && this.players.length === 4) {
			return this.checkGoFishWinCondition();
		}
		return false;
	}
}

// Initialize the game engine
const gameEngine = new GameEngine();

// Log that everything is ready
gameEngine.log("Card Game Engine initialized and ready!");

// Auto-update display every second
setInterval(() => {
	gameEngine.updateDisplay();
}, 1000);