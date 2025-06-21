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
Bo: Is a player object just an ID?

**createZone()**
PURPOSE: The purpose of the createZone() function is to create a Zone ID for cards to be placed in that can be accessed via getZoneId().
Bo: Zones also have locations in 2d space, attributes like "hidden", "face up/face down", etc The engine needs to know how to render them. 

**createCardID()**
PURPOSE: The purpose of the createCardID() function is to create a card ID that can be accessed via getCardId(). The script would need to be responsible for any CSS styling or logic that the card would contain.
Bo: Who is responsible for the styling of the card? This is a good question. The script contains the rules of the game, it shouldn't contain much, if any, information about how the cards look. We will leave that to the engine. The user will set card styles elsewhere in the app (maybe via a webapp) but not in the script. So, for now, we will give the engine some default values for styling and let it handle it.

**createDeck()**
PURPOSE: The purpose of the createDeck() function is to create placeholder that can have cards added to it and would be known as a deck of cards ID that cane be accessed via getPlayerId().
Bo: This method should probably take a player ID and a list of card IDs. 

**createGameStatus()**
PURPOSE: The purpose of the createGameStatus() is to create a tracker that constantly displays a valuable and constantly changing status of the game such as player health, player points, or the turn count.
Bo: This isn't clear to me. Is gameStatus a class?

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
Bo: Should take an optional parameter "flip" to flip the card as it moves, and an optional "face" parameter to specify which face should be face up. Otherwise, the card's face doesn't change.

**setDeckSize(deck, int)**
PURPOSE: The purpose of this method is to adjust the size of a specified deck to a certain amount.
Bo: This is an odd method. I think we should have an "addCard" and "removeCard" method instead. 

**setZoneWinDecider(zone)**
PURPOSE: In every card game there is always a zone that is the last thing that is checked to determine the winner of the game (usually a won cards pile). Thus, the purpose of the method is to choose which Zone is that last check.
Bo: I don't think it's a zone that needs to be checked, but the value of a variable, like "score". For example, I could win at "War" even if my "won cards" pile was smaller IF I had won enough in the previous rounds (previous shuffles of the deck).

NEXT: Create a step-by-step walk through of the first couple of turns of a game of War, and show me how these functions will be used to play the game.
