var express = require('express')
var httpModule = require('http')
var ioModule = require('socket.io')
var _ = require('underscore')

var app = express();

var http = httpModule.createServer(app)
var io = ioModule.listen(http, { log: false })

var cards = [
	{ id: 0, name: "Attack" },
	{ id: 1, name: "Move up" },
	{ id: 2, name: "Move back" },
	{ id: 3, name: "Heal" },
	{ id: 4, name: "Defend" }
]

cards = _.map( cards, function(card) {
	card.selected = false
	return card
})

var players = [
				{ id: 0, name: "Carl", row: 0, cards: [ cards[0], cards[1] ], state: { selectedCard: null } },
				{ id: 1, name: "Noel", row: 1, cards: [ cards[1], cards[2] ], state: { selectedCard: null } },
				{ id: 2, name: "Sean", row: 0, cards: [ cards[2], cards[3] ], state: { selectedCard: null } },
				{ id: 3, name: "Mike", row: 0, cards: [ cards[3], cards[4] ], state: { selectedCard: null } },
			]
var playerById = function( id ) {
	return _.find( players, function(player) { return player.id == id } )
}

var sockets = []

var emit = function( event, data ) {
	_.each(
		sockets,
		function(socket) {
			socket.emit( event, data )
		}
	)
}

var sendCardState = function( player, card ) {
	emit( 'card-state', { player: player, card: card } )
}

var onSelectCard = function(data) {
	var player = playerById( data.playerId )
	player.state.selectedCard = data.cardId
	emit( 'player-state', player )
	_.each(
		player.cards,
		function(thisCard) {
			thisCard.selected = (thisCard.id == data.cardId)
			sendCardState( player, thisCard )
		}
	)
}

var unselectCards = function(player) {
	player.state.selectedCard = null
	_.each(
		player.cards,
		function(card) {
			card.selected = false
		}
	)
}

var onDisconnect = function(socket) {
	sockets = _.without( sockets, socket )
}

var onConnect = function(socket) {
	sockets.push( socket )
	socket.on( 'disconnect', _.bind( onDisconnect, socket ) )

	socket.emit( 'players', players )
	socket.on( 'select-card', onSelectCard )
}

io.sockets.on( 'connection', onConnect );

app.use( express.bodyParser() )
app.use( express.static('pages') )

var port = process.env.PORT || process.env.VCAP_APP_PORT || 8000

http.listen(port)

var turnState = { remaining: 15 }

var oneSecond = function() {
	turnState.remaining -= 1
	if ( turnState.remaining <= 0 ) {
		turnState.remaining = 15
		_.each( players, unselectCards )
		emit( 'players', players )
	}
	emit( 'turn-pulse', turnState )
}

setInterval( oneSecond, 1000 )

console.log('Server running on port ' + port)
