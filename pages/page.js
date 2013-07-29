var socket = io.connect('')

function turnTimerController($scope) {
	socket.on( 'turn-pulse', function(data) {
		$scope.turnTimeRemaining = data.remaining
		$scope.$apply()
	})

	$scope.backgroundClass = function() {
		return $scope.turnTimeRemaining <= 5 ? 'near' : 'far'
	}
}

function playersController($scope) {
	var cards = []

	socket.on('cards', function(data) {
		console.log( 'cards' )
		cards = data
	})

	socket.on('players', function(data) {
		console.log( 'players' )
		$scope.players = _.sortBy( data, function(player) {
			return player.position
		})
		$scope.$apply()
	})

	socket.on( 'player-state', function(data) {
		console.log( 'player-state' )
		var player = _.find( $scope.players, function(player) { return player.id == data.id } )
		for( var item in data ) {
			player[item] = data[item]
		}
		$scope.$apply()
	})
	
	socket.on( 'controllers' , function(data) {
		console.log( 'controllers' )
		if($scope.controller.id == null) {
			$scope.controller.id = data.list[data.list.length-1]
		}
		$scope.$apply()
	})
	
	$scope.players = []
	$scope.controller = {id:null}

	$scope.select = function(player, cardId) {
		if (player.controllerId == $scope.controller.id) {
			socket.emit('select-card', { playerId: player.id, cardId: cardId } )
		}
	}
	
	$scope.control = function(player) {
		if(player.controllerId == null) {
			socket.emit('control-player', { playerId: player.id, controllerId: $scope.controller.id })
		}
	}
	
	$scope.cardState = function(player, cardId) {
		return player.controllerId != $scope.controller.id ? 'unselectable' : cardId == player.selectedCard ? 'selected' : 'selectable'
	}
	
	$scope.controlState = function(player) {
		return player.controllerId == null ? 'selectable' : 'unselectable'
	}
	
	$scope.cardById = function(cardId) {
		return _.findWhere( cards, { id: cardId } )
	}
	
	$scope.urlFor = function(player) {
		return player.team + ".html"
	}
	
	$scope.controllerConnect = function() {
		socket.emit('controller-connect')
	}
	
	$scope.$routeChangeStart = function (event, next, current) {
		socket.emit('controller-disconnect', {controllerId: $scope.controller.id} )
	}
}
