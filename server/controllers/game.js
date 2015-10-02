var uuid = require('node-uuid');
var _ = require('underscore');

var activeGames = [];

module.exports = {
	create: function () {
		var id = uuid.v4();
		var obj = {'gameId':id};
		activeGames.push(obj);
		return obj;
	},

	destroy: function () {

	},

	join: function(player, gameId) {
		var game = _.find(activeGames, function (game) { return game.gameId === gameId });
		if (game) {
			game.players = game.players || [];

			// if the player is already joined, just return the game
			if (_.contains(_.pluck(game.players, 'id'), player)) {
				return game;
			}

			game.players.push({id: player});
			
			return game;
		} else {
			return null;
		}
	},

	start: function() {

	},

	list: function() {
		return activeGames;
	}
}