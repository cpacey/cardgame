var express = require('express')
var httpModule = require('http')
var ioModule = require('socket.io')
var _ = require('underscore')

var app = express();

var http = httpModule.createServer(app)
var io = ioModule.listen(http, { log: false })

var cards = require('./cards')

var players = require('./players')

var controllers = {list: []}

var onConnect = function(socket) {
	socket.on( 'select-card', onSelectCard )
	socket.on( 'control-player', onControlPlayer )

	socket.emit( 'cards', cards.list )

	socket.emit( 'players', players.list )
	socket.emit( 'turn-pulse', turnTimer )

	controllers.list.push(socket.id)
	socket.emit( 'controllers', controllers )	
}

var onDisconnect = function(socket) {
	_.each( players.list, function(player) {
		player.releaseBotControl(socket.id)
		sockets.broadcast('player-state', player)		
	})
	controllers.list.splice(controllers.list.indexOf(socket.id), 1)
}

var sockets = require('./sockets')( io, onConnect, onDisconnect )

var onSelectCard = function(data) {
	var player = players.findById( data.playerId )

	player.selectCard( data.cardId )

	sockets.broadcast( 'player-state', player )
}

var onControlPlayer = function(data) {
	_.each( players.list, function(player) {
		if (player.id == data.playerId) {
			player.takeBotControl(data.controllerId)
		} else {
			player.releaseBotControl(data.controllerId)
		}
		sockets.broadcast( 'player-state', player )
	})
}

var oneSecond = function(turnTimer) {
	sockets.broadcast( 'turn-pulse', turnTimer )
}

var endTurn = function() {
	_.each( players.list, function(player) {
		var card = cards.findById(player.getSelectedCard())
		if (card) {
			card.apply(players, player)
		}
	})
	players.unselectCards()
	sockets.broadcast( 'players', players.list )
}

var turnTimer = require('./turnTimer')( oneSecond, endTurn )

app.use( express.bodyParser() )
app.use( express.static('pages') )

var port = process.env.PORT || process.env.VCAP_APP_PORT || 8000

http.listen(port)

console.log('Server running on port ' + port)
