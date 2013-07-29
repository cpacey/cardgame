var cards = require( './cards' )
var _ = require('underscore')

var CONTROLLER_ID_BOT = null

var nextId = 0
var getNextId = function() {
	return nextId++
}

var Player = function( name, position, team, cardWeights ) {
	this.id = getNextId()
	this.name = name
	this.cardIds = [0, 1, 2, 3, 4, 5, 6, 7, 8]
	this.position = position
	this.team = team
	this.cardWeights = cardWeights
	this.controllerId = CONTROLLER_ID_BOT

	this.selectCard = function( cardId ) {
		this.selectedCard = cardId
	}

	this.autoSelectCard = function() {
		var randomNumber = Math.random()
		var totalProbability = 0

		if (this.controllerId != CONTROLLER_ID_BOT) {
			this.selectedCard = 8 // Pass
		} else {
			var option = _.find(cardWeights, function(option) {
				totalProbability += option.weight
				return totalProbability >= randomNumber
			})

			this.selectedCard = option ? option.cardId : null
		}
	}	
	
	this.getSelectedCard = function() {
		if(!this.selectedCard) {
			this.autoSelectCard()
		}
		return this.selectedCard
	}

	this.resetCardSelection = function() {
		this.selectedCard = null
	}
		
	this.takeBotControl = function(controllerId) {
		if(this.controllerId == CONTROLLER_ID_BOT) {
			this.controllerId = controllerId
		}
	}

	this.releaseBotControl = function(controllerId) {
		if(this.controllerId == controllerId) {
			this.controllerId = CONTROLLER_ID_BOT
		}
	}
	
	this.botEnabled = function() {
		return this.controllerId == CONTROLLER_ID_BOT
	}
}

module.exports.Player = Player