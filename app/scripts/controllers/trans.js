'use strict';

app.controller('TransCtrl', function ($scope, $location, Request, Auth, User) {
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
