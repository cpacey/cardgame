var express = require('express')
var httpModule = require('http')
var ioModule = require('socket.io')
var _ = require('underscore')

var app = express();

var http = httpModule.createServer(app)
var io = ioModule.listen(http, { log: false })

var cards = require('./cards')

var board = require('./board')

var players = {list: []}

var onConnect = function(socket) {
	socket.on( 'select-card', onSelectCard )
	socket.on( 'select-character', onSelectCharacter )

	socket.emit( 'cards', cards.list )

	socket.emit( 'characters', board.characters )
	socket.emit( 'turn-pulse', turnTimer )

	players.list.push(socket.id)
	socket.emit( 'players', players )	
}

var onDisconnect = function(socket) {
	_.each( board.characters, function(character) {
		character.releaseBotControl(socket.id)
		sockets.broadcast('character-state', character)		
	})
	players.list.splice(players.list.indexOf(socket.id), 1)
}

var sockets = require('./sockets')( io, onConnect, onDisconnect )

var onSelectCard = function(data) {
	var character = board.findById( data.characterId )

	character.selectCard( data.cardId )

	sockets.broadcast( 'character-state', character )
}

var onSelectCharacter = function(data) {
	_.each( board.characters, function(character) {
		if (character.id == data.characterId) {
			character.takeBotControl(data.playerId)
		} else {
			character.releaseBotControl(data.playerId)
		}
		sockets.broadcast( 'character-state', character )
	})
}

var oneSecond = function(turnTimer) {
	sockets.broadcast( 'turn-pulse', turnTimer )
}

var endTurn = function() {
	_.each(_.sortBy( board.characters, function(character) { return cards.findById(character.getSelectedCard()).priority }), 
		function(character) {
			cards.findById(character.getSelectedCard()).apply(board, character)
		}
	)
	board.unselectCards()
	sockets.broadcast( 'characters', board.characters )
}

var turnTimer = require('./turnTimer')( oneSecond, endTurn )

app.use( express.bodyParser() )
app.use( express.static('pages') )

var port = process.env.PORT || process.env.VCAP_APP_PORT || 8000

http.listen(port)

console.log('Server running on port ' + port)
