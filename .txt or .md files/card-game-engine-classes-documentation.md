# Card Game Engine - Classes Documentation
## Complete Reference for All Classes, Properties, and Methods

### Overview
This document provides a comprehensive reference for all classes in the card-game-engine.html file, including their properties and methods. This covers the complete API available for creating card games.

---

## Core Classes

### 1. **Card Class**
Represents individual playing cards with suit, rank, value, and display state.

#### **Properties:**
- `id` (integer) - Unique identifier for the card
- `suit` (string) - Card suit: 'hearts', 'diamonds', 'clubs', 'spades'
- `rank` (string) - Card rank: 'A', '2', '3'...'10', 'J', 'Q', 'K'
- `value` (integer) - Numeric value for comparisons (1-13)
- `faceUp` (boolean) - Whether card is face up or face down
- `element` (DOM element) - Visual representation of the card

#### **Methods:**
- `getId()` - Returns the card's unique ID
- `getValue()` - Returns the card's numeric value
- `getSuit()` - Returns the card's suit
- `getRank()` - Returns the card's rank
- `flip()` - Toggles card between face up/down
- `isFaceUp()` - Returns current face state
- `setFaceUp(faceUp)` - Sets card face state
- `getDisplayText()` - Returns card text for logging
- `getDisplayRank()` - Returns formatted rank for display
- `getSuitSymbol()` - Returns Unicode suit symbol (♥♦♣♠)
- `isRed()` - Returns true if hearts or diamonds
- `createElement()` - Creates DOM element for card
- `updateDisplay()` - Updates visual appearance
- `onClick()` - Handles card click events

---

### 2. **Deck Class**
Manages a standard 52-card deck with shuffling and dealing capabilities.

#### **Properties:**
- `cards` (array) - Array of Card objects

#### **Methods:**
- `constructor()` - Creates standard 52-card deck
- `createStandardDeck()` - Generates all 52 cards with suits/ranks/values
- `shuffle()` - Randomizes card order using Fisher-Yates algorithm
- `deal(count = 1)` - Removes and returns specified number of cards
- `addCard(card)` - Adds a card to the deck
- `getCards()` - Returns copy of all cards in deck
- `isEmpty()` - Returns true if no cards remain
- `getCount()` - Returns number of cards in deck

---

### 3. **Zone Class**
Represents card areas (hands, decks, battle piles, etc.) with positioning and display management.

#### **Properties:**
- `name` (string) - Zone identifier (e.g., "hand", "deck", "battlePile")
- `playerId` (integer) - ID of owning player (null for shared zones)
- `x` (integer) - X coordinate position on board
- `y` (integer) - Y coordinate position on board
- `width` (integer) - Zone width in grid units
- `height` (integer) - Zone height in grid units
- `options` (object) - Configuration options
- `cards` (array) - Cards currently in this zone
- `element` (DOM element) - Visual representation
- `maxCards` (integer) - Maximum cards allowed (default: Infinity)
- `faceDown` (boolean) - Force cards face down
- `faceUp` (boolean) - Force cards face up

#### **Methods:**
- `addCard(card)` - Adds card to zone with face state enforcement
- `removeCard(cardId)` - Removes specific card by ID
- `removeTopCard()` - Removes and returns top card
- `getTopCard()` - Returns top card without removing
- `getCardCount()` - Returns number of cards in zone
- `getCards()` - Returns copy of all cards
- `shuffle()` - Randomizes card order in zone
- `clear()` - Removes all cards from zone
- `createElement()` - Creates DOM element with positioning
- `updateDisplay()` - Refreshes visual display with overlap handling
- `preventOverlapWithUI()` - Avoids collision with game log/controls
- `preventZoneOverlap()` - Avoids collision with other zones
- `applyOverlapPositioning(cardElement, index)` - Handles card overlap for 3+ cards
- `getZoneBounds()` - Returns zone position/dimensions
- `getElementBounds(element)` - Gets bounds of any DOM element
- `zonesOverlap(rect1, rect2, buffer)` - Collision detection
- `calculateNonOverlappingPosition()` - Finds valid position avoiding overlaps
- `findFreeSpace()` - Grid search for available space

---

### 4. **Player Class**
Represents individual players with scoring and zone ownership.

#### **Properties:**
- `id` (integer) - Unique player identifier
- `name` (string) - Player display name
- `score` (integer) - Current score/points
- `zones` (Map) - Map of zone names to Zone objects

#### **Methods:**
- `getId()` - Returns player ID
- `getName()` - Returns player name
- `getScore()` - Returns current score
- `setScore(score)` - Sets score to specific value
- `adjustScore(amount)` - Adds/subtracts points from score
- `addZone(zone)` - Associates a zone with this player
- `getZone(zoneName)` - Returns specific zone by name
- `getAllZones()` - Returns array of all player's zones

---

### 5. **GameBoard Class**
Manages the spatial layout and organization of all game zones.

#### **Properties:**
- `width` (integer) - Board width in grid units
- `height` (integer) - Board height in grid units
- `zones` (array) - All zones on the board
- `element` (DOM element) - Game board container

#### **Methods:**
- `getWidth()` - Returns board width
- `getHeight()` - Returns board height
- `addZone(zone)` - Adds zone to board and DOM
- `getZone(name, playerId)` - Finds zone by name and owner
- `getAllZones()` - Returns array of all zones
- `clear()` - Removes all zones from board

---

### 6. **GameEngine Class**
Central controller managing all game logic, flow, and state.

#### **Properties:**
- `players` (array) - All players in the game
- `board` (GameBoard) - The game board instance
- `deck` (Deck) - Current deck instance
- `currentPlayerIndex` (integer) - Index of current player
- `gameState` (string) - Current state: 'waiting', 'playing', 'finished'
- `turnCount` (integer) - Number of turns/rounds played
- `gameRules` (object) - Game-specific rules
- `selectedCard` (Card) - Currently selected card
- `gameType` (string) - Type of game: 'war', 'gofish', etc.
- `logElement` (DOM element) - Game log container

#### **Core Setup Methods:**
- `createPlayer(name)` - Creates new player and adds to game
- `createBoard(width, height)` - Creates game board with dimensions
- `createZone(name, playerId, x, y, width, height, options)` - Creates positioned zone
- `createStandardGameSetup(playerCount)` - Standard deck + player setup

#### **Card Operation Methods:**
- `moveCard(fromZoneName, toZoneName, playerId)` - Moves top card between zones
- `flipCard(cardId)` - Flips specific card face up/down
- `shuffleDeck(zoneName, playerId)` - Shuffles cards in specified zone
- `dealCardsToPlayers(cardsPerPlayer)` - Distributes cards to all players

#### **Game Information Methods:**
- `getCardCount(zoneName, playerId)` - Returns card count in zone
- `getCardValue(cardId)` - Returns numeric value of specific card
- `getTopCardId(zoneName, playerId)` - Returns ID of top card in zone
- `compareCards(cardId1, cardId2)` - Compares two cards (-1, 0, 1)

#### **Game Flow Methods:**
- `startNewGame()` - Resets all game state
- `startTurn()` - Begins new turn
- `endTurn()` - Ends current turn, advances to next player
- `nextTurn()` - Combination of endTurn + startTurn with win check
- `checkWinCondition()` - Checks if game should end (override per game)
- `endGame()` - Sets game state to finished

#### **Player Management Methods:**
- `getPlayer(playerId)` - Returns player object by ID
- `getCurrentPlayer()` - Returns currently active player
- `getAllPlayers()` - Returns array of all players

#### **Scoring Methods:**
- `setScore(playerId, score)` - Sets player's score
- `adjustScore(playerId, amount)` - Modifies player's score

#### **Utility Methods:**
- `log(message)` - Adds message to game log
- `clearLog()` - Clears game log
- `updateDisplay()` - Refreshes all UI elements
- `onCardClick(card)` - Handles card selection

#### **War Game Specific Methods:**
- `loadWarGame()` - Sets up War game with 2 players
- `playRound()` - Executes one round of War
- `collectBattleCards(winner)` - Transfers battle cards to winner
- `checkAndReshuffleCards()` - Reshuffles won cards when hands empty
- `playWar()` - Handles War scenario (tied cards)

#### **Go Fish Game Specific Methods:**
- `loadGoFishGame()` - Sets up Go Fish with 4 players
- `checkForBooks()` - Finds and collects sets of 4 matching ranks
- `askForCards(askingPlayer, targetPlayer, rank)` - Handles card requests
- `checkGoFishWinCondition()` - Checks for Go Fish victory (13 books)

---

## Usage Patterns

### **Creating a New Game:**
```javascript
gameEngine.startNewGame()
gameEngine.createPlayer("Player 1")
gameEngine.createBoard(12, 10)
gameEngine.createZone("hand", 1, 2, 8, 3, 1, {faceDown: true})
```

### **Card Management:**
```javascript
gameEngine.moveCard("deck", "hand", playerId)
gameEngine.shuffleDeck("deck")
gameEngine.flipCard(cardId)
```

### **Game Flow:**
```javascript
gameEngine.startTurn()
// Game logic here
gameEngine.endTurn()
if (gameEngine.checkWinCondition()) {
    gameEngine.endGame()
}
```

### **Zone Operations:**
```javascript
const hand = player.getZone("hand")
hand.addCard(card)
const topCard = hand.removeTopCard()
hand.shuffle()
```

---

## Class Relationships

1. **GameEngine** → Controls everything, central hub
2. **GameBoard** → Manages Zone placement and organization
3. **Zone** → Contains and manages Card objects
4. **Player** → Owns specific Zones and tracks score
5. **Deck** → Creates and manages Card collections
6. **Card** → Individual game pieces with state

This architecture provides a flexible foundation for implementing various card games while maintaining clean separation of concerns and reusable components.
