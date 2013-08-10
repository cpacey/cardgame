var _ = require('underscore')

var noop = function( board, character ) {
	return false
}

var move = function(distance) {
	return function(board, character) {
		board.moveCharacter( character, distance )
		character.text = "I moved " + (distance > 0 ? "forward " + Math.abs(distance) : (distance < 0 ? "back " + Math.abs(distance) : "nowhere")) + "!"
	}
}

var blockableAttack = function(blockCardId) {
	return function(board, character) {
		var selfCardId = this.id
		var rpsEffect = function(targetCharacter) {
			if(targetCharacter.selectedCard != selfCardId && targetCharacter.selectedCard != blockCardId) {
				targetCharacter.statistics.health = targetCharacter.statistics.health - 10
			}
		}
		board.applyEffectByPosition(rpsEffect, character.position + 1)
		board.applyEffectByPosition(rpsEffect, character.position - 1)
		character.text = "I attacked with " + this.name + "!"
	}
}

var list = exports.list = [
	{ id: 0, name: "Attack", priority: 0, apply: noop, canApply: noop },
	{ id: 1, name: "Move forward", priority: 1, apply: move(1), canApply: noop },
	{ id: 2, name: "Move back", priority: 1, apply: move(-1), canApply: noop },
	{ id: 3, name: "Heal", priority: 0, apply: noop, canApply: noop },
	{ id: 4, name: "Defend", priority: 0, apply: noop, canApply: noop },
	{ id: 5, name: "Rock", priority: 2, apply: blockableAttack(6) },
	{ id: 6, name: "Paper", priority: 2, apply: blockableAttack(7) },
	{ id: 7, name: "Scissors", priority: 2, apply: blockableAttack(5) },
	{ id: 8, name: "Pass", priority: 0, apply: move(0) }
]

exports.findById = function(id) {
	return _.findWhere( list, { id: id } )
}
