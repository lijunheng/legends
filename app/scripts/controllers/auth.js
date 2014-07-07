'use strict';

app.controller('AuthCtrl', function ($rootScope, $scope, $location, Auth, User) {

  $scope.user = {username: '', email: '', password: ''};
  
  if (Auth.signedIn()) {
    $location.path('/');
  }
  
  $scope.$on('$firebaseSimpleLogin:login', function () {
    $location.path('/');
  });
  
  $scope.login = function () {
    login();
  };

  function login() {
    console.log('step 4: in login');
    Auth.login($scope.user).then(function () {
      console.log('step 6: go home');
      $location.path('/');
    }, function (error) {
      $scope.error = error.toString();
    });
  }
  
  $rootScope.register = function () {
    console.log('step 1: before register');
    Auth.register($scope.user).then(function (authUser) {
      console.log('step 3: creating user');
      User.create(authUser, $scope.user.username);
      console.log('step 3: logging in');
      login();
    }, function (error) {
      $scope.error = error.toString();
    });
  };

  $scope.logout = function () {
    Auth.logout();
  };
});