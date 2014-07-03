/* global app:true */
'use strict';

var app = angular.module('legendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'xeditable'
  ]);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/plume',
    controller: 'PlumeCtrl'
  })
  .when('/plume', {
    templateUrl: 'partials/plume',
    controller: 'PlumeCtrl'
  })
  .when('/login', {
    templateUrl: 'partials/login',
    controller: 'AuthCtrl'
  })
  .when('/register', {
    templateUrl: 'partials/register',
    controller: 'AuthCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
});
app.constant('FIREBASE_URL', 'https://legends.firebaseio.com/');