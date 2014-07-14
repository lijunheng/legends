'use strict';

app.controller('PlumeCtrl', function ($rootScope, $scope, $location, Request, Auth, User) {
	$scope.determineBMILevel = function() {
		var bmi = $rootScope.currentUser.bmi;
		if (bmi < 15) {
			$rootScope.currentUser.bmiLevel = "very severely underweight";
		} else if (bmi >= 15 && bmi < 16) {
			$rootScope.currentUser.bmiLevel = "severely underweight";
		} else if (bmi >= 16 && bmi < 18.5) {
			$rootScope.currentUser.bmiLevel = "underweight";
		} else if (bmi >= 18.5 && bmi < 25) {
			$rootScope.currentUser.bmiLevel = "normal (healthy weight)";
		} else if (bmi >= 25 && bmi < 30) {
			$rootScope.currentUser.bmiLevel = "overweight";
		} else if (bmi >= 30 && bmi < 35) {
			$rootScope.currentUser.bmiLevel = "obese class I (moderately obese)";
		} else if (bmi >= 35 && bmi < 40) {
			$rootScope.currentUser.bmiLevel = "obese class II (severely obese)";
		} else if (bmi >= 40) {
			$rootScope.currentUser.bmiLevel = "obese class III (very severely obese)";
		}
		if ($rootScope.currentUser.weight == 0 || $rootScope.currentUser.height == 0) {
			$rootScope.currentUser.bmiLevel = "undefined";
		}
	};

	$scope.initUser = function() {
		$rootScope.currentUser.bmi = $rootScope.currentUser.height * $rootScope.currentUser.height;
		$rootScope.currentUser.bmi = $rootScope.currentUser.weight / $rootScope.currentUser.bmi * 703;
		$scope.determineBMILevel();
	};

	$scope.updateUser = function() {
		$rootScope.currentUser.bmi = $rootScope.currentUser.height * $rootScope.currentUser.height;
		$rootScope.currentUser.bmi = $rootScope.currentUser.weight / $rootScope.currentUser.bmi * 703;
		$scope.determineBMILevel();
		User.update($rootScope.currentUser.username);
	};
});
