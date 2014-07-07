/* global app:true */
'use strict';

var app = angular.module('legendApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'xeditable',
  ]);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
app.config(function ($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'partials/resistance',
    controller: 'ResistanceCtrl'
  })
  .when('/login', {
    templateUrl: 'partials/login',
    controller: 'AuthCtrl'
  })
  .when('/register', {
    templateUrl: 'partials/register',
    controller: 'AuthCtrl'
  })
  .when('/diversity', {
    templateUrl: 'partials/div',
    controller: 'DivCtrl'
  })
  .when('/stroop', {
    templateUrl: 'partials/stroop',
    controller: 'StroopCtrl'
  })
  .when('/stroop/experiment', {
    templateUrl: 'partials/stroopExperiment',
    controller: 'StroopExpCtrl'
  })
  .when('/psych', {
    templateUrl: 'partials/psych',
    controller: 'PsychCtrl'
  })
  .when('/plume', {
    templateUrl: 'partials/plume',
    controller: 'PlumeCtrl'
  })
  .otherwise({
    redirectTo: '/'
  });
  $locationProvider.html5Mode(true);
});
app.constant('FIREBASE_URL', 'https://legends.firebaseio.com/');
app.directive('datetimepicker', function(){
  return {
    restrict: 'A',
    link: function ($scope, $elem, attrs) {
      $elem.datetimepicker();
    }
  };
});