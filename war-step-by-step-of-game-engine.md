## WAR IMPLEMENTATION OF GAME ENGINE: STEP - BY - STEP WALK THRU

**As soon as game is loaded, before first turn**
Functions called:
`createPlayer()` 2 times for both players
`createZone()` 6 times for two hands, battle zones, and won card zones. For the hand the face-up will be false, but for the other zones it will be true. Hidden will be true as well, because the players probably wouldn't want to see the square boxes.
`createCardId()` 52 times for each card in the deck
`createGameStatus()` 2 times for each player.

`createWinDecider()` will be used to create GameStatus object for the score.
`setWinDecider()` will be used on the score GameStatus object to make it the decider of the game winner.

`moveCardToZone()` will need to be used once for each card from the 52 card deck (in a random order) and it will alternate between moving the cards to player 1's hand and player 2's hand. The zone that the cards are being moved from will probably have to be NULL. The bool value will be "true" because the cards are face up upon creation.

Note: there is no need to use createDeck() for War, because neither player really has a deck, they instead both just have hands with a large amount of cards.

**Turn 1**
`moveCardToZone()` is called twice for each player taking a card from their hand and putting it into their respective battle piles.
Some sort of `card comparison` function will have to be used, but this kind of function varies a lot between different card games, so it will most likely need to be made by the script.

After the `card comparison` function is ran, a war may happen. It will need to return a player.
`getZoneId()` will be called immediately after the battle if a war does not happen, and will use the player object that was returned from the card comparsion to get the correct zone for the cards to be moved to.
    If a war happens, then `moveCardToZone()` needs to be called 4 times for each player in the same way it was just called earlier this turn.
    The `card comparison` function will be called again, this time on the most recent card from each player.
    If there is another war, the previous two steps will be repeated until there isn't a war.
    `getCardAmountFromZone()` is called once a higher card has been determined. It's ouput will determine the amount of times the next function will be called.
    `getZoneId()` will also be called.

`moveCardToZone()` is the next function that's called, whether or not there is a war, and will be used on each player's battle pile and will move all of the cards to the wonCards zone of the player who won the battle.

**Turn 2**
`setGameStatus()` will need to be ran at the start of every turn to adjust the score of each player based on their total cards, in case the game ends at the end of the turn.
    Every time this function is ran, it will have to run `getCardAmountFromZone()` twice on both each player's hand and wonCards zones, and add those 2 ints together to set the score.

`getCardAmountFromZone()` will also need to be checked for the hand zone at the start of every turn following Turn 1, because it's always possible for the hand to be empty if enough wars were stringed along in a row.
    If it returns 0, then `getCardAmountFromZone()` will need to be called again for the wonCards zone, and the int it returns will determine the exact amount of times that `moveCardToZone()` should be called.
    But before moving any cards, `getCardAmountFromZone()` will be called again for the wonCards zone.
    If that returns 0 as well, then the game has ENDED.

    If the game has not ended, `moveCardToZone()` is called to move all cards from the wonCards zone to the hand zone with a bool value of "true" to indicate that the cards are already face up



`moveCardToZone()` is called again like last turn to start the battle
`card comparison` function will be called again to determine the winner of the battle
If there is a war, the same procedure occurs

