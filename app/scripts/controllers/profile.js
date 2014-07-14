'use strict';

app.controller('ProfileCtrl', function ($rootScope, $scope, $routeParams, $location, Auth, User) {
	$scope.user = User.findByUsername($routeParams.username);
});