'use strict';

app.controller('ResistanceCtrl', function ($rootScope, $scope, $location, Game, Auth, User) {
	jQuery('#datetimepicker').datetimepicker();

	$scope.games = Game.all;
	$scope.game = {location: '', datetime: ''};

	$scope.submitGame = function () {
		Game.create($scope.game).then(function (gameId) {
			$scope.game = {location: '', datetime: ''};
		});
	};
	$scope.deleteGame = function (gameId) {
		Game.delete(gameId);
	};
	$scope.addPlayer = function (gameId) {
		console.log('1) initiate: add player');
		Game.addPlayer(gameId);
	};
	$scope.removePlayer = function (gameId, player, playerId) {
		Game.deletePlayer(gameId, player, playerId);
	};
	$scope.logout = function () {
		Auth.logout();
	};
});
