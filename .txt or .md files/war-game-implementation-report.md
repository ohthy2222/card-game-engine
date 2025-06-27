# War Game Implementation Report
## Complete Function Call Analysis - From Start to Finish

### Overview
This report documents every function call and class used during a complete game of War using the card-game-engine.html framework, from initialization to one player winning.

---

## Game Flow Analysis

### Phase 1: Game Initialization (`loadWarGame()`)

#### **Step 1: Game Setup**
```javascript
gameEngine.startNewGame()
```
**Functions Called:**
- `GameEngine.startNewGame()` - Resets all game state
  - `this.players = []` - Clear player array
  - `this.currentPlayerIndex = 0` - Reset turn counter
  - `this.turnCount = 0` - Reset turn count
  - `this.gameState = 'waiting'` - Set initial state
  - `this.selectedCard = null` - Clear selections
  - `this.board.clear()` - Clear existing board
  - `this.clearLog()` - Clear game log
  - `this.updateDisplay()` - Refresh UI

#### **Step 2: Player Creation**
```javascript
const player1 = this.createPlayer("Player 1")
const player2 = this.createPlayer("Player 2")
```
**Functions Called (2x):**
- `GameEngine.createPlayer(name)` - Creates each player
  - `new Player(id, name)` - Instantiate Player class
  - `this.players.push(player)` - Add to players array
  - `this.updateDisplay()` - Update UI

**Classes Used:**
- **Player Class** - Constructor creates player with ID, name, score=0, zones=Map

#### **Step 3: Board Creation**
```javascript
this.createBoard(12, 10)
```
**Functions Called:**
- `GameEngine.createBoard(width, height)` - Creates game board
  - `new GameBoard(width, height)` - Instantiate GameBoard class
  - `this.board = gameBoard` - Assign to engine

**Classes Used:**
- **GameBoard Class** - Constructor sets dimensions and gets DOM element

#### **Step 4: Zone Creation (6 zones total)**
```javascript
this.createZone('deck', null, 5, 4, 2, 1, {faceDown: true})
this.createZone('hand', player1, 1, 8, 3, 1, {faceDown: true})
this.createZone('hand', player2, 1, 1, 3, 1, {faceDown: true})
this.createZone('battlePile', player1, 8, 6, 2, 1, {faceUp: true})
this.createZone('battlePile', player2, 8, 3, 2, 1, {faceUp: true})
this.createZone('wonCards', player1, 1, 6, 2, 1, {faceDown: true})
this.createZone('wonCards', player2, 1, 3, 2, 1, {faceDown: true})
```
**Functions Called (7x):**
- `GameEngine.createZone(name, playerId, x, y, width, height, options)` - Creates each zone
  - `new Zone(name, playerId, x, y, width, height, options)` - Instantiate Zone class
  - `this.board.addZone(zone)` - Add zone to board
    - `zone.createElement()` - Create DOM element
      - `zone.preventOverlapWithUI()` - Avoid UI overlap
        - `zone.preventZoneOverlap()` - Avoid zone overlap
  - `player.addZone(zone)` - Add zone to player (if player-owned)

**Classes Used:**
- **Zone Class** - Constructor sets properties, creates DOM elements with overlap prevention

#### **Step 5: Deck Creation and Shuffling**
```javascript
this.deck = new Deck()
this.deck.shuffle()
```
**Functions Called:**
- `new Deck()` - Create standard 52-card deck
  - `Deck.createStandardDeck()` - Generate all 52 cards
    - `new Card(id, suit, rank, value)` × 52 - Create each card
- `Deck.shuffle()` - Randomize card order

**Classes Used:**
- **Deck Class** - Creates and manages 52-card deck
- **Card Class** - 52 instances created with suit, rank, value properties

#### **Step 6: Card Dealing (52 cards total)**
```javascript
while (!this.deck.isEmpty()) {
    const card = this.deck.deal(1)[0]
    if (dealToPlayer1) {
        this.board.getZone('hand', player1).addCard(card)
    } else {
        this.board.getZone('hand', player2).addCard(card)
    }
    dealToPlayer1 = !dealToPlayer1
}
```
**Functions Called (52x):**
- `Deck.isEmpty()` - Check if cards remain
- `Deck.deal(1)` - Remove top card from deck
- `GameBoard.getZone(name, playerId)` - Find player's hand zone
- `Card.setFaceUp(false)` - Set card face down
- `Zone.addCard(card)` - Add card to hand
  - `Zone.updateDisplay()` - Refresh visual display
    - `Zone.applyOverlapPositioning()` - Handle card overlap if >3 cards

---

## Phase 2: Playing Rounds (`playRound()`)

### **Normal Round Sequence**

#### **Step 1: Game State Validation**
```javascript
if (this.gameState !== 'playing') return
```
**Functions Called:**
- Check game state

#### **Step 2: Player and Zone Retrieval**
```javascript
const player1 = this.getPlayer(1)
const player2 = this.getPlayer(2)
const hand1 = player1.getZone('hand')
const hand2 = player2.getZone('hand')
const battle1 = player1.getZone('battlePile')
const battle2 = player2.getZone('battlePile')
```
**Functions Called:**
- `GameEngine.getPlayer(playerId)` × 2 - Get player objects
- `Player.getZone(zoneName)` × 4 - Get hand and battle zones

#### **Step 3: Win Condition Check**
```javascript
if (hand1.getCardCount() === 0) {
    this.log("Player 2 wins!")
    this.endGame()
    return
}
if (hand2.getCardCount() === 0) {
    this.log("Player 1 wins!")
    this.endGame()
    return
}
```
**Functions Called:**
- `Zone.getCardCount()` × 2 - Check hand sizes
- `GameEngine.log(message)` - Log winner (if game over)
- `GameEngine.endGame()` - End game (if game over)

#### **Step 4: Card Playing**
```javascript
const card1 = hand1.removeTopCard()
const card2 = hand2.removeTopCard()
card1.setFaceUp(true)
card2.setFaceUp(true)
battle1.addCard(card1)
battle2.addCard(card2)
```
**Functions Called:**
- `Zone.removeTopCard()` × 2 - Take cards from hands
- `Card.setFaceUp(true)` × 2 - Flip cards face up
- `Zone.addCard(card)` × 2 - Place cards in battle piles
- `Card.getDisplayText()` × 2 - Get card text for logging
- `GameEngine.log(message)` - Log cards played

#### **Step 5: Card Comparison**
```javascript
const comparison = this.compareCards(card1.getId(), card2.getId())
```
**Functions Called:**
- `Card.getId()` × 2 - Get card IDs
- `GameEngine.compareCards(cardId1, cardId2)` - Compare card values
  - `GameEngine.getCardValue(cardId)` × 2 - Get card values
    - `Card.getValue()` × 2 - Return numeric values

#### **Step 6: Winner Determination**
```javascript
if (comparison > 0) {
    this.log("Player 1 wins this round!")
    this.collectBattleCards(player1)
} else if (comparison < 0) {
    this.log("Player 2 wins this round!")
    this.collectBattleCards(player2)
} else {
    this.log("WAR! Cards are equal!")
    this.playWar()
}
```
**Functions Called:**
- `GameEngine.log(message)` - Log round result
- `GameEngine.collectBattleCards(winner)` - OR
- `GameEngine.playWar()` - If tie

---

## Phase 3: Collecting Cards (`collectBattleCards()`)

#### **Functions Called:**
```javascript
const wonZone = winner.getZone('wonCards')
const battle1 = this.board.getZone('battlePile', 1)
const battle2 = this.board.getZone('battlePile', 2)

while (battle1.getCardCount() > 0) {
    const card = battle1.removeTopCard()
    card.setFaceUp(false)
    wonZone.addCard(card)
    collectedCards++
}
// Repeat for battle2

// Shuffle won cards back if hand empty
const hand = winner.getZone('hand')
if (hand.getCardCount() === 0 && wonZone.getCardCount() > 0) {
    wonZone.shuffle()
    while (wonZone.getCardCount() > 0) {
        const card = wonZone.removeTopCard()
        hand.addCard(card)
    }
}
```
**Functions Called:**
- `Player.getZone('wonCards')` - Get winner's won pile
- `GameBoard.getZone('battlePile', playerId)` × 2 - Get both battle piles
- `Zone.getCardCount()` - Check pile sizes (multiple times)
- `Zone.removeTopCard()` - Remove cards from battle piles (multiple times)
- `Card.setFaceUp(false)` - Flip cards face down (multiple times)
- `Zone.addCard(card)` - Add to won pile (multiple times)
- `Zone.shuffle()` - Shuffle won cards (if reshuffling to hand)
- `Player.getName()` - Get player name for logging
- `GameEngine.log(message)` - Log collection results

---

## Phase 4: War Scenario (`playWar()`)

#### **Functions Called:**
```javascript
const player1 = this.getPlayer(1)
const player2 = this.getPlayer(2)
const hand1 = player1.getZone('hand')
const hand2 = player2.getZone('hand')
const battle1 = player1.getZone('battlePile')
const battle2 = player2.getZone('battlePile')

// 4 cards each (3 face down, 1 face up)
for (let i = 0; i < 4; i++) {
    if (hand1.getCardCount() === 0) {
        this.log("Player 1 runs out! Player 2 wins!")
        this.endGame()
        return
    }
    // Same check for player 2
    
    const card1 = hand1.removeTopCard()
    const card2 = hand2.removeTopCard()
    const faceUp = (i === 3)
    card1.setFaceUp(faceUp)
    card2.setFaceUp(faceUp)
    battle1.addCard(card1)
    battle2.addCard(card2)
}

// Compare final cards and resolve
const card1 = battle1.getTopCard()
const card2 = battle2.getTopCard()
const comparison = this.compareCards(card1.getId(), card2.getId())
// Handle result (collect or recursive war)
```

**Functions Called:**
- `GameEngine.getPlayer(playerId)` × 2
- `Player.getZone(zoneName)` × 4
- `Zone.getCardCount()` × 8+ (checking for empty hands)
- `Zone.removeTopCard()` × 8 (4 cards each player)
- `Card.setFaceUp(boolean)` × 8 (first 3 false, last 1 true)
- `Zone.addCard(card)` × 8
- `Zone.getTopCard()` × 2 (get final cards for comparison)
- `Card.getId()` × 2
- `GameEngine.compareCards(cardId1, cardId2)`
- `GameEngine.collectBattleCards(winner)` OR recursive `GameEngine.playWar()`

---

## Phase 5: Game End (`endGame()`)

#### **Functions Called:**
```javascript
this.gameState = 'finished'
this.log("Game finished!")
this.updateDisplay()
```
**Functions Called:**
- Set game state to 'finished'
- `GameEngine.log(message)` - Log game end
- `GameEngine.updateDisplay()` - Final UI update

---

## Complete Class Usage Summary

### **Classes Used Throughout Complete Game:**

1. **GameEngine** - Central controller, most heavily used
2. **Player** - 2 instances created, used for zone management and identification
3. **GameBoard** - 1 instance, manages spatial layout of zones
4. **Zone** - 7 instances total:
   - 1 deck zone
   - 2 hand zones (player1, player2)
   - 2 battlePile zones (player1, player2)  
   - 2 wonCards zones (player1, player2)
5. **Deck** - 1 instance, creates and shuffles 52 cards
6. **Card** - 52 instances, each with unique suit/rank/value

### **Most Frequently Called Functions:**
1. `Zone.getCardCount()` - Called every round for win checks and card management
2. `Zone.removeTopCard()` - Called every card play (normal rounds + wars)
3. `Zone.addCard(card)` - Called every card movement
4. `Card.setFaceUp(boolean)` - Called for every card visibility change
5. `GameEngine.log(message)` - Called for every game event
6. `Zone.updateDisplay()` - Called after every card movement for visual updates

### **Total Function Calls for Complete Game:**
**Initialization Phase:** ~100+ function calls (setup, dealing)
**Per Normal Round:** ~25-30 function calls
**Per War Round:** ~50-60 function calls  
**Per Collection:** ~20-40 function calls (varies by cards collected)

**For typical 100-round War game:** 3,000-4,000+ total function calls

---

## Conclusion

The War game implementation demonstrates the engine's robust card management system. The modular design handles complex scenarios like wars (with recursive calls), automatic card reshuffling, win condition checking, and dynamic visual updates. The Zone class's overlap prevention and Card class's state management provide a solid foundation for the game's card movement mechanics.

**Total Classes: 6**  
**Total Unique Functions: 35+**  
**Game Complexity: Medium** (recursive wars, state management, automatic reshuffling)
