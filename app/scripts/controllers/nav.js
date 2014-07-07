'use strict';
 
app.controller('NavCtrl', function ($rootScope, $scope, $location, Game, Auth, User) {
	$rootScope.logout = function () {
		Auth.logout();
	};
  });