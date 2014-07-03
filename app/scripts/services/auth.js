'use strict';

app.factory('Auth',
  function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope, User) {
    var ref = new Firebase(FIREBASE_URL);

    var auth = $firebaseSimpleLogin(ref);

    var Auth = {
      register: function (user) {
        console.log('step 2: registering');
        return auth.$createUser(user.email, user.password);
      },
      signedIn: function () {
        return auth.user !== null;
      },
      login: function (user) {
        console.log('step 5: auth login');
        return auth.$login('password', user);
      },
      logout: function () {
        auth.$logout();
      }
    };

    $rootScope.signedIn = function () {
      return Auth.signedIn();
    };

    return Auth;
  });