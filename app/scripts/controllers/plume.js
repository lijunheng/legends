'use strict';

app.controller('PlumeCtrl', function ($rootScope, $scope, $location, Request, Auth, User) {
	$scope.tab = 1;

	$scope.initUser = function() {
		$rootScope.currentUser.bmi = $rootScope.currentUser.height * $rootScope.currentUser.height;
		$rootScope.currentUser.bmi = $rootScope.currentUser.weight / $rootScope.currentUser.bmi * 703;
	};

	$scope.updateUser = function() {
		$rootScope.currentUser.bmi = $rootScope.currentUser.height * $rootScope.currentUser.height;
		$rootScope.currentUser.bmi = $rootScope.currentUser.weight / $rootScope.currentUser.bmi * 703;
		User.update($rootScope.currentUser.username);
	};

	$scope.selectTab = function(setTab) {
		$scope.tab = setTab;
	};
	$scope.isSelected = function(checkTab) {
		return $scope.tab === checkTab;
	};

	$scope.requests = Request.all;
	$scope.request = {start: '', end: '', time: ''};

	$scope.submitRequest = function () {
		Request.create($scope.request).then(function (requestId) {
			$scope.request = {start: '', end: '', time: ''};
			$location.path('/requests/' + requestId);
		});
	};
	$scope.deleteRequest = function (requestId) {
		Request.delete(requestId);
	};
	$scope.addRider = function (requestId) {
		console.log('1) initiate: add rider');
		Request.addRider(requestId);
	};
	$scope.removeRider = function (requestId, rider, riderId) {
		Request.deleteRider(requestId, rider, riderId);
	};
	$scope.logout = function () {
		Auth.logout();
	};
	$scope.setDriver = function () {
		$scope.request.driver = User.getCurrent().username;
	};
});
