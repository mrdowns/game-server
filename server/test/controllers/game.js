'use strict';

var mockery = require('mockery'),
	chai = require('chai'),
	expect = chai.expect,
	Game = require('../../controllers/game.js');

/**

POST create
instantiate a new game with a unique ID as a GUID
game is not started yet
add this game to the list of games

GET join
retrieve a room's game state
check for max players or game already started
add this player to the list of the game if neither of the above
if max players, start game

POST start
starts the specified game

GET list
retrive list of all games including their status (open, in progress)

**/

describe('game', function () {
	var guid,
		counter = 0;

	before(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false
		});

		guid = {
			v4: function () {
				counter += 1;
				return 'xxx-yyy' + counter;
			}
		};

		mockery.registerMock('node-uuid', guid);
	});

	describe('create', function () {
		var game;

		beforeEach(function () {
			var controller = new Game();

			game = controller.create('player1');
		});

		it('should assign a unique ID', function () {
			expect(game).to.have.property('gameId').equal('xxx-yyy1');
		});

		it('should assign the player', function () {
			expect(game).to.have.property('playerId').equal('player1');
		});
	});

	describe('list', function () {
		var list;

		beforeEach(function () {
			var controller = new Game();

			controller.create('player1');
			controller.create('player2');
			controller.create('player3');

			list = controller.list();
		});

		it('should return all active games', function () {
			console.log(list);
			expect(list[0]).to.have.property('gameId').equal('xxx-yyy1');
			expect(list[1]).to.have.property('gameId').equal('xxx-yyy2');
			expect(list[2]).to.have.property('gameId').equal('xxx-yyy3');
		});

		it('should have all active players', function () {
			expect(list[0]).to.have.property('playerId').equal('player1');
			expect(list[1]).to.have.property('playerId').equal('player2');
			expect(list[2]).to.have.property('playerId').equal('player3');
		});
	});

	describe('join', function () {
		var games = {};

		before(function () {
			var controller = new Game();

			controller.create();
			controller.create();
			controller.create();

			var list = controller.list();

			games['g1'] = controller.join('player1', list[0].gameId);

			games['g2'] = controller.join('player1', list[1].gameId);
			games['g3'] = controller.join('player2', list[1].gameId);

			games['g4'] = controller.join('player3', list[2].gameId);
			games['g5'] = controller.join('player4', list[2].gameId);
			games['g6'] = controller.join('player4', list[2].gameId);

			// should do nothing
			games['g7'] = controller.join('player5', 'nongameid');
		});

		it('should add player to game', function () {
			expect(games['g1']).to.have.property('players').with.length(1);
			expect(games['g1'].players[0]).to.have.property('id').equal('player1');
		});

		it('should add two players to one game', function () {
			expect(games['g2']).to.have.property('players').with.length(2);
			expect(games['g2'].players[0]).to.have.property('id').equal('player1');
			expect(games['g2'].players[1]).to.have.property('id').equal('player2');
		});

		it('should add players to the same game', function () {
			expect(games['g2'].id).to.equal(games['g3'].id);
		});

		it('should not add same player twice', function () {
			expect(games['g4']).to.have.property('players').with.length(2);
			expect(games['g4'].players[0]).to.have.property('id').equal('player3');
			expect(games['g4'].players[1]).to.have.property('id').equal('player4');
		});

		it('shouldnt do anything with an invalid id', function () {
			expect(games['g7']).to.be.null;
		});
	});

	afterEach(function () {
		counter = 0;
	});

	after(function () {
		mockery.disable();
	});
});
