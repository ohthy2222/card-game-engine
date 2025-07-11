/* Game Engine File that any card game script can use for it's methods to run a card game */

class GameEngine
{
    constructor()
    {
        // Create empty arrays to store objects
        this.players = [];
        this.zones = [];
        this.cards = [];
        this.decks = [];

        // Increase the counter every time a new object is made to ensure the ids are unique
        this.cardIdCounter = 0;
        this.zoneIdCounter = 0;
        this.playerIdCounter = 0;
    }

    // CONSTRUCTORS

    createPlayer()
    {
        const player = { id: this.playerIdCounter++ };
        this.players.push(player);
        return player;
    }

    createZone(player, x, y, length, width, hidden, faceUp)
    {
        const zone = {
            id: this.zoneIdCounter++,
            owner: player,
            x, y, length, width,
            hidden,
            faceUp,
            cards: []
        };
        this.zones.push(zone);
        return zone;
    }

    createCard()
    {
        const card = { id: this.cardIdCounter++ };
        this.cards.push(card);
        return card;
    }

    createDeck(player, cardArray)
    {
        const deck = {
            id: `deck-${player.id}`,
            owner: player,
            cards: [...cardArray]
        };
        this.decks.push(deck);
        return deck;
    }

    // ACCESSORS

    getPlayerId(player)
    {
        return player.id;
    }

    getZoneId(player)
    {
        return this.zones.find(z => z.owner === player)?.id;
    }

    getDeckId(player)
    {
        return this.decks.find(d => d.owner === player)?.id;
    }

    getDeckSize(deck)
    {
        return deck.cards.length;
    }

    getCardAmountFromZone(zone)
    {
        return zone.cards.length;
    }

    getCardId(card)
    {
        return card.id;
    }

    // MUTATORS

    moveCardToZone(card, fromZone, toZone, isFaceUp)
    {
        if (fromZone) {
            fromZone.cards = fromZone.cards.filter(c => c.id !== card.id);
        }
        if (toZone) {
            toZone.cards.push({ ...card, faceUp: isFaceUp });
        }
    }

    addCard(deck, card)
    {
        deck.cards.push(card);
    }

    removeCard(deck, card)
    {
        deck.cards = deck.cards.filter(c => c.id !== card.id);
    }

    shuffleDeck(deck)
    {
        for (let i = deck.cards.length - 1; i > 0; --i)
        {
            const j = Math.floor(Math.random() * (i + 1));
            [deck.cards[i], deck.cards[j]] = [deck.cards[j], deck.cards[i]];
        }
    }

    // OTHER METHODS

    compareCards(cardA, cardB)
    {
        return cardA.value > cardB.value ? 1 : cardA.value < cardB.value ? -1 : 0;
    }
};

class GameStatus
{
    constructor()
    {
        this.statuses = new Map(); // key: player.id, value: integer
        this.winDecider = null;
    }

    // CONSTRUCTORS

    createGameStatus(player)
    {
        this.statuses.set(player.id, 0);
    }

    // ACCESSORS

    getGameStatus(player)
    {
        return this.statuses.get(player.id);
    }

    getGameWinner(scoreP1, scoreP2)
    {
        if (scoreP1 > scoreP2)
        {
                return "Player 1";
        }
        else if (scoreP2 > scoreP1)
        {
            return "Player 2";
        }
        else
        {
            return "Tie";
        }
    }

    // MUTATORS

    setGameStatus(player, value)
    {
        this.statuses.set(player.id, value);
    }

    setWinDecider(player)
    {
        this.winDecider = player.id;
    }

};
