'use strict';

app.factory('Game', function ($firebase, FIREBASE_URL, User) {
	var ref = new Firebase(FIREBASE_URL + 'game');

	var games = $firebase(ref);

	var Game = {
		all: games,
		create: function (game) {
			if (User.signedIn()) {
				var user = User.getCurrent();

				game.owner = user.username;

				return games.$add(game).then(function (ref) {
					var gameId = ref.name();

					user.$child('games').$child(gameId).$set(gameId);

					return gameId;
				});
			}
		},
		find: function (gameId) {
			return games.$child(gameId);
		},
		addPlayer: function(gameId) {
			if (User.signedIn()) {
				console.log('2) getting user');
				var user = User.getCurrent();
				console.log('3) getting username');
				var player = {};
				player.username = user.username;
				player.gameId = gameId;
				console.log('4) adding player');
				games.$child(gameId).$child('players').$add(player).then(function (ref) {
					user.$child('players').$child(ref.name()).$set({id: ref.name(), gameId: gameId});
				});
			}
		},
		deletePlayer: function (gameId, player, playerId) {
			if (User.signedIn()) {
				var user = User.findByUsername(player.username);
				console.log('step 5: deleting player');
				games.$child(gameId).$child('players').$remove(playerId).then(function () {
					user.$child('players').$remove(playerId);
				});
			}
		},
		delete: function (gameId) {
			if (User.signedIn()) {
				var game = Game.find(gameId);

				game.$on('loaded', function () {
					var user = User.findByUsername(game.owner);

					games.$remove(gameId).then(function () {
						user.$child('games').$remove(gameId);
					});
				});
			}
		}
	};
	return Game;
});