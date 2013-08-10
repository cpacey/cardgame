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

function charactersController($scope) {
	var cards = []

	socket.on('cards', function(data) {
		console.log( 'cards' )
		cards = data
	})

	socket.on('characters', function(data) {
		console.log( 'characters' )
		$scope.characters = _.sortBy( data, function(character) {
			return character.position
		})
		$scope.$apply()
	})

	socket.on( 'character-state', function(data) {
		console.log( 'character-state' )
		var character = _.find( $scope.characters, function(character) { return character.id == data.id } )
		for( var item in data ) {
			character[item] = data[item]
		}
		$scope.$apply()
	})
	
	socket.on( 'players' , function(data) {
		console.log( 'players' )
		if($scope.player.id == null) {
			$scope.player.id = data.list[data.list.length-1]
		}
		$scope.$apply()
	})
	
	$scope.characters = []
	$scope.player = {id:null}

	$scope.select = function(character, cardId) {
		if (character.playerId == $scope.player.id) {
			socket.emit('select-card', { characterId: character.id, cardId: cardId } )
		}
	}
	
	$scope.control = function(character) {
		if(character.playerId == null) {
			socket.emit('select-character', { characterId: character.id, playerId: $scope.player.id })
		}
	}
	
	$scope.cardState = function(character, cardId) {
		return character.playerId != $scope.player.id ? 'unselectable' : cardId == character.selectedCard ? 'selected' : 'selectable'
	}
	
	$scope.controlState = function(character) {
		return character.playerId == null ? 'selectable' : 'unselectable'
	}
	
	$scope.cardById = function(cardId) {
		return _.findWhere( cards, { id: cardId } )
	}
	
	$scope.urlFor = function(character) {
		return character.team + ".html"
	}
	
	$scope.playerConnect = function() {
		socket.emit('player-connect')
	}
	
	$scope.$routeChangeStart = function (event, next, current) {
		socket.emit('player-disconnect', {playerId: $scope.player.id} )
	}
}
