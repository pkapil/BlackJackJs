var Card = function() {
    this.value = '';
    this.symbol = '';
    this.color = '';

};

var hand = function() {
    this.name = '';
    this.cards = [];
    this.scoreval = 0;
    this.virtualscore = 0;

    this.score = function() {
        var a = 0;
        this.cards.forEach(function(entry, index, Arr) {
            var special = ['J', 'Q', 'A', 'K'];
            switch (entry.value) {
                case 'J':
                case 'Q':
                case 'K':
                    a += 10;
                    break;
                case 'A':
                    a += 11;
                    break;
                default:
                    a += parseInt(entry.value);
            }
        });
        this.scoreval = a;
        return a;
    };

    return {
        name: this.name,
        cards: this.cards,
        scoreval: this.scoreval,
        score: this.score,
        virtualscore: this.virtualscore
    };
};


var Deck = {
    init: function() {
        var valArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'A', 'J', 'Q', 'K'];
        var symArr = ['spade', 'heart', 'club', 'diamond'];
        var colArr = ['black', 'red'];

        var deckAll = [];
        colArr.forEach(function(color) {
            symArr.forEach(function(symbol) {
                valArr.forEach(function(value) {
                    var card = new Card();
                    card.value = value;
                    card.symbol = symbol;
                    card.color = color;
                    deckAll.push(card);
                });
            });
        });

        this.deck = this.shuffleArray(deckAll);
        return this;
    },
    deck: [],
    shuffleArray: function(Arr) {
        if (Arr === 'undefined') Arr = this.deck;
        var l = Arr.length;

        function swap(Arr, a, b) {
            var x = Arr[a];
            Arr[a] = Arr[b];
            Arr[b] = x;
        }
        for (var i = l - 1; i >= 0; i--) {
            swap(Arr, Math.floor(Math.random() * (l + 1)), Math.floor(Math.random() * (l + 1)));
        }
        return Arr;
    },
    dealFromDeck: function() {
        return this.deck.pop();
    }
};

var Game = {
    dealer: new hand(),
    players: [],
    deck: function() {
        return (typeof(Deck) != "undefined") ? Deck.init() : Deck;
    },
    dealFromDeck: function() {
        return this.deck().dealFromDeck();
    },
    init: function() {
        var self = this;
        self.dealer.name = "Dealer";
        var dealerCards = self.dealer.cards;
        var noofplayers = 2;
        var players = self.players;
        for (var i = 0; i < noofplayers; i++) {
            var newplayer = new hand();
            newplayer.name = "Player" + i;
            newplayer.cards.push(self.dealFromDeck());
            newplayer.cards.push(self.dealFromDeck());
            players.push(newplayer);
        }
        dealerCards.push(self.dealFromDeck());
        dealerCards.push(self.dealFromDeck());

        /*

        var player = self.player;
        var dealer = self.dealer1.cards;
        var dealer1 = self.dealer1;
        var message = self.message;
        dealer1.cards.push(self.dealFromDeck());
        dealer1.cards.push(self.dealFromDeck());
        player.push(self.dealFromDeck());
        player.push(self.dealFromDeck());
        dealer.push(self.dealFromDeck());
        dealer.push(self.dealFromDeck());
        dealer.score = self.score;
        message.mess = JSON.stringify(message);*/
        return this;
    },

    checkwin: function() {
        /*        var self = this;
        var message = self.message;
        var dealerscore = parseInt(this.dealerscore());
        var playersscore = parseInt(this.playersscore());

        message.info = (playersscore == dealerscore) ? "Its a push Please RESTART" : message.info;

        message.info = (dealerscore > 21) ? "Dealer Busted!" : message.info;
        message.info = (playersscore > 21) ? "Player Busted!" : message.info;
        message.styleclass = message.info.indexOf("Busted") > -1 ? "text-error" : message.styleclass;

        message.info = (dealerscore == 21) ? "Dealer won!" : message.info;
        message.info = (playersscore == 21) ? "Player won!" : message.info;
        message.styleclass = message.info.indexOf("won") > -1 ? "text-success" : message.styleclass;


        self.paintgame();
        if (message.info.indexOf("won") > -1 || message.info.indexOf("Busted") > -1) {
            message.info = message.info + " Please RESTART";
            self.paintgame();
            return;
        }*/

    },

    message: {
        info: '',
        styleclass: ''
    },

    gameDecision: function() {
        var self = this;
        self.paintgame();
        self.checkwin();

    },

    start: function() {
        var self = this;
        var message = self.message;

        message.info = "Welcome to Black Jack Game :)!!! ";
        message.styleclass = "text-info";

        //do u wanna hit or stand?
        $(document).on('click', '#hit', function() {
            message.styleclass = "text-info";
            self.message.info = "You choosed hit!..if you want to hit again go ahead then choose stand later";
            self.player.push(self.dealFromDeck());
            self.gameDecision();
        });
        $(document).on('click', '#stand', function() {
            message.info = "you choose stand ";
            while (parseInt(self.dealerscore()) < 21) {
                if (parseInt(self.dealerscore()) < parseInt(self.playersscore())) {
                    self.dealer.push(self.dealFromDeck());
                } else {
                    self.gameDecision();
                    return;
                }
            }
            self.gameDecision();
        });
        self.gameDecision();
    },
    score: function() {
        /*        var a = 0;
        arguments[0].forEach(function(entry, index, Arr) {
            var special = ['J', 'Q', 'A', 'K'];
            switch (entry.value) {
                case 'J':
                case 'Q':
                case 'K':
                    a += 10;
                    break;
                case 'A':
                    a += 11;
                    break;
                default:
                    a += parseInt(entry.value);
            }
        });
        arguments[0].scoreval = a;
        return a;*/
    },

    paintgame: function() {
        var gameview = GameView.paint();
    }

};

var GameView = {
    paint: function() {
        var tpl = $('#template').html();
        var ctpl = Handlebars.compile(tpl);
        $('#mainContainer').html(ctpl(game));
    }
};

Handlebars.registerHelper('ifCond', function(v1, v2, options) {
    if (v1 > v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});


var game = Game.init();
game.start();