var socket = io.connect('')

function turnTimerController($scope) {
	socket.on( 'turn-pulse', function(data) {
		$scope.turnTimeRemaining = data.remaining
		$scope.$apply()
	})
}

function playersController($scope) {
	socket.on('players', function(data) {
		$scope.players = _.map( data, function(player) {
			player.cards = _.map( player.cards, function(card) {
				card.state = function() {
					return card.selected ? 'selected' : 'selectable'
				}
				return card
			})
			return player
		})
		$scope.$apply()
	});
	
	socket.on( 'card-state', function(data) {
		var player = _.find( $scope.players, function(player) { return player.id == data.player.id } )
		var card = _.find( player.cards, function(card) { return card.id == data.card.id } )
		card.selected = data.card.selected
		$scope.$apply()
	})
	
	$scope.players = []
	
	$scope.addPlayer = function() {
		socket.emit('add-player', $scope.newPlayerName)
	}
	
	$scope.select = function(player, card) {
		var message = { player: player, playerId: player.id, cardId: card.id, card: card }
		socket.emit('select-card', message )
		
	}
}
