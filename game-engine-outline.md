## GAME ENGINE DESIGN
----------------------

CLASS: **Game Engine**

```c++
/*
PURPOSE: The purpose of the Game Engine class is to provide all of the necessary methods that a card game script can reuse to run and play the card game. It contains the following constructors, accessors, mutators, and comparison methods.
*/
```

CONSTRUCTORS:

**createPlayer()**
PURPOSE: The purpose of the createPlayer() function is to create a player ID that can be accessed via getPlayerId().

**createZone()**
PURPOSE: The purpose of the createZone() function is to create a Zone ID for cards to be placed in that can be accessed via getZoneId().

**createCardID()**
PURPOSE: The purpose of the createCardID() function is to create a card ID that can be accessed via getCardId(). The script would need to be responsible for any CSS styling or logic that the card would contain.

**createDeck()**
PURPOSE: The purpose of the createDeck() function is to create placeholder that can have cards added to it and would be known as a deck of cards ID that cane be accessed via getPlayerId().

**createGameStatus()**
PURPOSE: The purpose of the createGameStatus() is to create a tracker that constantly displays a valuable and constantly changing status of the game such as player health, player points, or the turn count.


ACCESSORS:

**getPlayerId()**
PURPOSE: The purpose of the getPlayerId() function is to access and use the player ID that was made by createPlayerId().

**getZoneId()**
PURPOSE: The purpose of the getZoneId() function is to access and use the zone ID that was made by createZoneId().

**getDeckSize()**
PURPOSE: The purpose of the getDeckSize() function is to access and use the deck size for checks such as checking of the deck has ran out of cards that was made by createDeck().

**getCardAmountFromZone()**
PURPOSE: The purpose of the getCardAmountFromZone() function is to access and use the zone card amount for checks such as checking if the zone has ran out of cards.

**getCardId()**
PURPOSE: The purpose of the getCardId() function is to access and use the card ID that was made by createCardId().

**getGameStatus()**
PURPOSE: The purpose of the getGameStatus() function is to access the data from the game status that, if it affects how the game is played, such as a card that has damage output that is reliant on a player's health or total points.


MUTATORS:

**moveCardToZone(card, zone, zone)**
PURPOSE: The purpose of the moveCardToZone() function is to take a specified card from it's current zone and move it to another zone.

**setDeckSize(deck, int)**
PURPOSE: The purpose of this method is to adjust the size of a specified deck to a certain amount.

**setZoneWinDecider(zone)**
PURPOSE: In every card game there is always a zone that is the last thing that is checked to determine the winner of the game (usually a won cards pile). Thus, the purpose of the method is to choose which Zone is that last check.
