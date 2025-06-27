## GAME ENGINE DESIGN
----------------------

CLASS: **GameEngine**

```c++
/*
PURPOSE: The purpose of the GameEngine class is to provide all of the necessary methods that a card game script can reuse to run and play the card game. It contains the following constructors, accessors, mutators, and comparison methods.
*/
```

CONSTRUCTORS:

**createPlayer()**
PURPOSE: The purpose of the createPlayer() function is to create a player object that can be accessed via getPlayerId().

**createZone(player, int, int, int, int, bool, bool)**
PURPOSE: The purpose of the createZone() function is to create a Zone ID for cards to be placed in that can be accessed via getZoneId(). It takes a player object so that it knows which player it's assigned to, 4 ints for the x and y coordinates of it's top left corner, and it's length and width. It also needs to know if it's "hidden" or not. And if it's "face up or face down." For these, bool seems like the best data type.

**createCard()**
PURPOSE: The purpose of the createCard() function is to create a card ID that can be accessed via getCardId(). The script would need to be responsible for any CSS styling or logic that the card would contain. Note: the cards are face up upon creation.

**createDeck(player, vector<card>)**
PURPOSE: The purpose of the createDeck() function is to create placeholder that takes an initial list/vector of cards and can have cards added and removed to it and would be known as a deck of card IDs that can be accessed via getDeckId().


ACCESSORS:

**player getPlayerId()**
PURPOSE: The purpose of the getPlayerId() function is to access and use the player ID that was made by createPlayer().

**zone getZoneId(player)**
PURPOSE: The purpose of the getZoneId() function is to access and use the zone ID that was made by createZone().

**deck getDeckId()**
PURPOSE: The purpose of the getDeckId() function is to access and use the deck ID that was made by createDeck().

**int getDeckSize()**
PURPOSE: The purpose of the getDeckSize() function is to access and use the deck size for checks such as checking of the deck has ran out of cards that was made by createDeck().

**int getCardAmountFromZone(zone)**
PURPOSE: The purpose of the getCardAmountFromZone() function is to access and use the zone card amount for checks such as checking if the zone has ran out of cards.

**card getCardId()**
PURPOSE: The purpose of the getCardId() function is to access and use the card ID that was made by createCard().


MUTATORS:

**moveCardToZone(card, zone, zone, bool)**
PURPOSE: The purpose of the moveCardToZone() function is to take a specified card from it's current zone and move it to another zone. The bool parameter should be true if the card is currently face up. That way, when it goes into the new zone, the new zone will know whether it should flip the card or not depending on if the new zone is a "face up" or "face down" zone.

**addCard(deck, card)**
PURPOSE: The purpose of this method is to add to the size of a specified deck by adding 1 card.

**removeCard(deck, card)**
PURPOSE: The purpose of this method is to subtract from the size of a specified deck by removing 1 card.

**shuffleDeck(deck)**
PURPOSE: The purpose of this method is to randomize the order of the cards in the deck that it's used on.


CLASS: **GameStatus**

```c++
/*
PURPOSE: The purpose of the GameStatus class is to provide important information that's usually changing throughout the game to the players by displaying it as text
*/
```

CONSTRUCTORS:

**createGameStatus(player)**
PURPOSE: The purpose of the createGameStatus() is to create a tracker that constantly displays a valuable and constantly changing status of the game such as player health, player points, or the player's prize cards. It requires a player to know which player to assign it to.


ACCESSORS:

**GameStatus getGameStatus(player)**
PURPOSE: The purpose of the getGameStatus() function is to access the data from the game status that, if it affects how the game is played, such as a card that has damage output that is reliant on a player's health or total points.

**player getGameWinner(scoreP1, scoreP2)**
PURPOSE: The purpose of the gameWinner() is to compare both score data member's value that's been assigned to each player and use that information to determine the winner.


MUTATORS:

**setGameStatus(GameStatus, int)**
PURPOSE: The purpose of the setGameStatus() is to adjust the value of a GameStatus object that has been created by createGameStatus() to a specific integer.

**setWinDecider(GameStatus)**
PURPOSE: In every card game there is always value that is the last thing that is checked to determine the winner of the game (usually the score, health, or prize cards that a player has). Thus, the purpose of the method is to choose which value is that last check.

This would definitely be a GameStatus object created by createGameStatus. In most cases, we'll want to name this GameStatus object to be "score."


These private data members may be necessary, but at the current moment, they're not.
```c++
// **int scoreP1**
// **int scoreP2**
// PURPOSE: The purpose of these private data members is to keep track of a specific integer value that determines the winner of the game, usually only once the game is over. One variable for each player. In the case of War, it would be the output of getCardAmountFromZone(). Specifically, when it's used on the wonCards zone of each player.
```
