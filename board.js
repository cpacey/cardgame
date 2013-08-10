var _ = require('underscore')
var assert = require('assert')
var character = require('./character')

var Board = function() {
	this.characters = [
		new character.Character( 'Rocky', 7, "antagonists", [ { cardId: 5, weight: 1 } ] ),
		new character.Character( 'Scisario', 6, "antagonists", [ { cardId: 7, weight: 1 } ] ),
		new character.Character( 'Pape', 5, "antagonists", [ { cardId: 6, weight: 1 } ] ),
		new character.Character( 'Joker', 4, "antagonists", [ { cardId: 5, weight: .33 }, { cardId: 6, weight: .33 }, { cardId: 7, weight: .33 }, {cardId: 8, weight: .01} ] ),
		new character.Character( 'Carl', 3, "protagonists", [ { cardId: 5, weight: 0.2}, { cardId: 6, weight: 0.2}, { cardId: 7, weight: 0.2}, { cardId: 1, weight: 0.2}, { cardId: 2, weight: 0.2}] ),
		new character.Character( 'Noel', 2, "protagonists", [ { cardId: 5, weight: 0.2}, { cardId: 6, weight: 0.2}, { cardId: 7, weight: 0.2}, { cardId: 1, weight: 0.2}, { cardId: 2, weight: 0.2}] ),
		new character.Character( 'Sean', 1, "protagonists", [ { cardId: 5, weight: 0.2}, { cardId: 6, weight: 0.2}, { cardId: 7, weight: 0.2}, { cardId: 1, weight: 0.2}, { cardId: 2, weight: 0.2}] ),
		new character.Character( 'Mike', 0, "protagonists", [ { cardId: 5, weight: 0.2}, { cardId: 6, weight: 0.2}, { cardId: 7, weight: 0.2}, { cardId: 1, weight: 0.2}, { cardId: 2, weight: 0.2}] )
	]
	
	this.findById = function( id ) {
		return _.find( this.characters, function(character) { return character.id == id } )
	}

	this.unselectCards = function() {
		_.each( this.characters, function(character) { character.selectedCard = null } )
	}

	this.moveCharacter = function(character, distance) {
		if ( this.canMove(character, distance) ) {
			this.swapCharactersByPosition( character.position, character.position + distance )
		}
	}
	
	this.swapCharactersByPosition = function( position1, position2 ) {
		var evictedCharacter = this.findCharacterByPosition( position2 )
		this.findCharacterByPosition( position1 ).position = position2
		evictedCharacter.position = position1
	}
	
	this.findCharacterByPosition = function( position ) {
		var character = _.find( this.characters, function(character) {
			return character.position == position
		})
		assert( character )
		return character
	}
	
	this.canMove = function( character, distance ) {
		return character.position + distance < this.characters.length - 1 && character.position + distance >= 0
	}
	
	this.getCharacterPosition = function( character ) {
		return character.position
	}

	this.applyEffectByPosition = function( effect, position ) {
		if(position >= 0 && position < this.characters.length ) {
			effect(this.findCharacterByPosition(position))
		}
	}
}

module.exports = new Board()
