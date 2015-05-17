var Card = function() {
    this.value = '';
    this.symbol = '';
    this.color = '';
};

var Message = function() {
    this.info = '';
    this.styleclass = '';
};


var Turn = function() {
    this.dealer = [];
    this.currentPlayer = [];
};


var hand = function() {
    this.id = 0;
    this.name = '';
    this.active = false;
    this.cards = [];
    this.scoreval = 0;
    this.infoMessage = '';
    this.hitstatus = 0;
    this.standstatus = 0;
    this.winstatus = 0;
    this.bustedstatus = 0;
    this.processed = 0;
    this.status = "";

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
    this.virtualscore = this.score();

    return {
        id: this.id,
        name: this.name,
        cards: this.cards,
        scoreval: this.scoreval,
        score: this.score,
        virtualscore: this.virtualscore,
        hitstatus: this.hitstatus,
        standstatus: this.standstatus,
        bustedstatus: this.bustedstatus,
        winstatus: this.winstatus,
        processed: this.processed,
        status: this.status,
        active: this.active
    };
};


var getDateTime = function() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    today = mm + '/' + dd + '/' + yyyy;
    return today;
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

    playersAllprocessed: function() {
        var self = this;
        var countOfPlayersProcessed = 0;
        for (var i = 0; i < self.players.length; i++) {
            countOfPlayersProcessed += self.players[i].processed;
        }
        if (countOfPlayersProcessed == self.players.length) {
            return true;
        } else {
            return false;
        }
    },
    dealer: new hand(),
    players: [],
    messages: [],
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
        self.dealer.infoMessage = "Game Started!";
        self.dealer.bustedstatus = 0;
        var noofplayers = 2;
        var players = self.players;
        for (var i = 0; i < noofplayers; i++) {
            var newplayer = new hand();
            newplayer.id = i;
            newplayer.name = "Player " + i;
            newplayer.processed = 0;
            newplayer.cards.push(self.dealFromDeck());
            newplayer.cards.push(self.dealFromDeck());
            if (i == 0) {
                newplayer.active = true;
            }
            players.push(newplayer);
        }
        dealerCards.push(self.dealFromDeck());
        dealerCards.push(self.dealFromDeck());



        //do u wanna hit or stand?
        $(document).on('click', '.btn-primary', function() {
            var playerId = parseInt($(this).attr("entityid"));
            var buttonType = $(this).attr("id");
            var player = self.players[playerId];

            if (self.gameDecision(player) === 0) return 0;
            if (!self.playersAllprocessed()) {
                if (buttonType === "hit" + playerId) {
                    if (player.winstatus > 0) {
                        self.logger("Player " + playerId + " : you are won!");
                        return 0;
                    }
                    if (player.standstatus > 0) {
                        self.logger("Player " + playerId + " : your game done!");
                        return 0;
                    }

                    player.hitstatus += 1;
                    message.styleclass = "text-info";
                    self.logger("Player " + playerId + " : choosed hit! please continue to click hit or stand");
                    player.cards.push(self.dealFromDeck());
                    if (self.gameDecision(player) === 0) return 0;
                }
                if (buttonType === "stand" + playerId) {
                    player.standstatus += 1;
                    player.processed = 1;
                    player.active = false;
                    if (player.id + 1 < self.players.length) {
                        self.players[player.id + 1].active = true;
                    }
                    self.logger("Player " + playerId + " : choosed stand!");
                    if (self.gameDecision(player) === 0) return 0;
                }

            }
            if (self.gameDecision(player) === 0) return 0;
        });
        return this;
    },

    checkDealerTurn: function() {
        var self = this;
        var dealer = self.dealer;
        var dealerCards = self.dealer.cards;
        if (self.playersAllprocessed()) {
            if (dealer.processed === 0)
                self.logger("Dealer Turn Started!!");
            if (dealer.bustedstatus === 0) {

                while (dealer.score() < 21) {
                    dealerCards.push(self.dealFromDeck());
                    if (self.gameDecision() === 0) return 0;
                }
            


            }
        }
    },
    checkwin: function(player1) {
        var self = this;
        var dealer = this.dealer;
        var player = player1;
        var dealerscore = parseInt(self.dealer.score());
        var playersscore = (typeof(player) == "object") ? parseInt(player.score()) : 0;

        if (dealerscore === 21) {
            dealer.winstatus = 1;
            dealer.processed = 1;
            dealer.status = "won";
            self.logger("Dealer won!");
            self.paintgame();
            self.checkDealerTurn();
            self.paintgame();

            return 0;
        }
        if (dealerscore > 21) {
            dealer.bustedstatus = 1;
            dealer.processed = 1;
            dealer.status = "Busted";
            self.logger("Dealer Busted!");
            self.paintgame();
            self.checkDealerTurn();
            self.paintgame();
            return 0;
        }
        if (playersscore > 21) {
            self.logger("Player " + player1.id + " Busted!");
            player.bustedstatus = 1;
            player.processed = 1;
            player.active = false;
            player.status = "busted";
            if (player.id + 1 < self.players.length) {
                self.players[player.id + 1].active = true;
            }
            self.paintgame();
            self.checkDealerTurn();
            self.paintgame();
            return 0;
        }
        if (playersscore === 21) {
            self.logger("Player " + player1.id + " Congrats you won!");
            player.winstatus = 1;
            player.processed = 1;
            player.active = false;
            player.status = "won";
            if (player.id + 1 < self.players.length) {
                self.players[player.id + 1].active = true;
            }
            self.paintgame();
            self.checkDealerTurn();
            self.paintgame();
            return 0;
        }

        self.checkDealerTurn();
        self.paintgame();
    },

    logger: function(mess) {
        var self = this;
        if (typeof(mess) === "string") {
            var message = new Message();
            message.info = new Date().toJSON() + "   :" + mess;
            self.messages.push(message);
        }
    },
    gameDecision: function(player) {
        var self = this;
        if (self.checkwin(player) === 0) return 0;
        self.paintgame();

    },
    start: function() {
        var self = this;
        self.logger("Welcome to Black Jack Game :)!!! ");
        self.gameDecision();
    },
    paintgame: function() {
        var self = this;
        var gameview = GameView.paint();
        for (var i = 0; i < game.players.length; i++) {
            var p = game.players[i];
            if (p.active) {
                activatePLayerUI(p.id);
            }
        }

        if (self.playersAllprocessed()) {
            disableAllButtons();
        }

    }

};

var GameView = {
    paint: function() {
        var tpl = $('#template').html();
        var ctpl = Handlebars.compile(tpl);
        $('#mainContainer').html(ctpl(game));

    }
};

function activatePLayerUI(id) {
    for (var i = 0; i < game.players.length; i++) {
        var p = game.players[i];
        $("#hit" + p.id).prop("disabled", true);
        $("#stand" + p.id).prop("disabled", true);
    }
    $("#hit" + id).prop("disabled", false);
    $("#stand" + id).prop("disabled", false);
};

function enableSpecificPlayerIDButtons(id) {
    $("#hit" + id).prop("disabled", false);
    $("#stand" + id).prop("disabled", false);
};

function disableAllButtons() {
    $('[id^=hit]').prop("disabled", true);
    $('[id^=stand]').prop("disabled", true);
};

var game = Game.init();
$(document).ready(function() {
    game.start();

});