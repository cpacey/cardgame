var _ = require('underscore')

var noop = function( players, player ) {
	return false
}

var moveUp = function( players, player ) {
	players.movePlayerUp( player )
	player.text = "I Played " + this.name + "!"
}

var moveDown = function( players, player ) {
	players.movePlayerDown( player )
	player.text = "I Played " + this.name + "!"
}

var attack = function(players, player) {
	player.text = "I Played " + this.name + "!"
}

var list = exports.list = [
	{ id: 0, name: "Attack", apply: noop, canApply: noop },
	{ id: 1, name: "Move up", apply: moveUp, canApply: noop },
	{ id: 2, name: "Move back", apply: moveDown, canApply: noop },
	{ id: 3, name: "Heal", apply: noop, canApply: noop },
	{ id: 4, name: "Defend", apply: noop, canApply: noop },
	{ id: 5, name: "Rock", apply: attack },
	{ id: 6, name: "Paper", apply: attack },
	{ id: 7, name: "Scissors", apply: attack },
	{ id: 8, name: "Pass", apply: attack }
]

exports.findById = function(id) {
	return _.findWhere( list, { id: id } )
}
