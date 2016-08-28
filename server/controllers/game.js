'use strict';

var uuid = require('node-uuid');
var _ = require('underscore');

class Game {
	constructor() {
		this.activeGames = [];
	}

	create(playerId) {
		var id = uuid.v4();
		var obj = {'gameId':id, 'playerId': playerId};
		this.activeGames.push(obj);
		return obj;
	}

	destroy() {

	}

	join(playerId, gameId) {
		var game = _.find(this.activeGames, function (game) { return game.gameId === gameId });
		if (game) {
			game.players = game.players || [];

			// if the player is already joined, just return the game
			if (_.contains(_.pluck(game.players, 'id'), playerId)) {
				return game;
			}

			game.players.push({id: playerId});

			return game;
		} else {
			return null;
		}
	}

	start() {

	}

	list() {
		return this.activeGames;
	}
}

module.exports = Game;
