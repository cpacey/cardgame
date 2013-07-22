var _ = require('underscore')

var Player = require('./player')

var rockyWeights = [0,0,0,0,0,1,0,0]

var Nonplayers = function () {
	this.list = [
		new Player( 'Rocky', 0 )
	]
	
	this.findById = function( id ) {
		return _.find( this.list, function(nonplayer) { return nonplayer.id == id } )
	}

	this.unselectCards = function() {
		_.each( this.list, function(nonplayer) { nonplayer.selectedCard = null } )
	}
	
	this.selectCards = function() {
		_.each( this.list, function(nonplayer) {
			var r = Math.random()
			var p = 0
			_.each(rockyWeights, function(cardWeight, i) {
				if (p <= r) {
					nonplayer.selectedCard = nonplayer.cardIds[i]
				}
				p = p + cardWeight
			})
			if(p == 0) {
				nonplayer.selectedCard = null
			}
		})
	}
}

module.exports = new Nonplayers()
