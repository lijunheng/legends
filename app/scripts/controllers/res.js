'use strict';

app.controller('ResCtrl', function ($rootScope, $scope, $location, Game, Auth, User) {
	$scope.tab = 1;

	$scope.selectTab = function(setTab) {
		$scope.tab = setTab;
	};
	$scope.isSelected = function(checkTab) {
		return $scope.tab === checkTab;
	};

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
