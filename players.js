var _ = require('underscore')
var assert = require('assert')
var Player = require('./player')

var Players = function() {
	this.list = [
		new Player( 'Carl', 3 ),
		new Player( 'Noel', 2 ),
		new Player( 'Sean', 1 ),
		new Player( 'Mike', 0 )
	]
	
	this.findById = function( id ) {
		return _.find( this.list, function(player) { return player.id == id } )
	}

	this.unselectCards = function() {
		_.each( this.list, function(player) { player.selectedCard = null } )
	}

	this.movePlayerUp = function(player) {
		if ( this.canMoveUp(player) ) {
			this.swapPlayersByPosition( player.position, player.position + 1 )
		}
	}
	
	this.movePlayerDown = function(player) {
		if ( this.canMoveDown(player) ) {
			this.swapPlayersByPosition( player.position, player.position - 1 )
		}
	}
	
	this.swapPlayersByPosition = function( position1, position2 ) {
		var player1 = this.findPlayerByPosition( position1 )
		var player2 = this.findPlayerByPosition( position2 )
		
		player1.position = position2
		player2.position = position1
	}
	
	this.findPlayerByPosition = function( position ) {
		var player = _.find( this.list, function(player) {
			return player.position == position
		})
		assert( player )
		return player
	}
	
	this.canMoveUp = function( player ) {
		return player.position < this.list.length - 1
	}
	
	this.canMoveDown = function( player ) {
		return player.position > 0
	}
	
	this.getPlayerPosition = function( player ) {
		return player.position
	}
}

module.exports = new Players()
