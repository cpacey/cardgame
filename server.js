var express = require('express')
var httpModule = require('http')
var ioModule = require('socket.io')
var _ = require('underscore')

var app = express();

var http = httpModule.createServer(app)
var io = ioModule.listen(http, { log: false })

var cards = require('./cards')

var players = require('./players')
var nonplayers = require('./nonplayers')

var onConnect = function(socket) {
	socket.on( 'select-card', onSelectCard )

	socket.emit( 'cards', cards.list )

	socket.emit( 'nonplayers', nonplayers.list )

	socket.emit( 'players', players.list )
	socket.emit( 'turn-pulse', turnTimer )
}

var sockets = require('./sockets')( io, onConnect )

var onSelectCard = function(data) {
	var player = players.findById( data.playerId )

	player.selectedCard = data.cardId

	sockets.broadcast( 'player-state', player )
}

var oneSecond = function(turnTimer) {
	sockets.broadcast( 'turn-pulse', turnTimer )
}

var endTurn = function() {

	nonplayers.selectCards()
	_.each(nonplayers.list, function(nonplayer) {
		sockets.broadcast( 'nonplayer-state', nonplayer )
		var card = cards.findById(nonplayer.selectedCard)
		if (card) {
			card.apply(nonplayers, nonplayer)
		}		
	})
	nonplayers.unselectCards()

	_.each( players.list, function(player) {
		var card = cards.findById(player.selectedCard)
		if (card) {
			card.apply(players, player)
		}
	})
	players.unselectCards()
	sockets.broadcast( 'nonplayers', nonplayers.list )
	sockets.broadcast( 'players', players.list )
}

var turnTimer = require('./turnTimer')( oneSecond, endTurn )

app.use( express.bodyParser() )
app.use( express.static('pages') )

var port = process.env.PORT || process.env.VCAP_APP_PORT || 8000

http.listen(port)

console.log('Server running on port ' + port)
