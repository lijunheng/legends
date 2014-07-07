'use strict';

app.factory('User', function ($rootScope, $firebase, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL + 'users');

  var users = $firebase(ref);

  var User = {
    create: function (authUser, username) {
      users[username] = {
        md5_hash: authUser.md5_hash,
        username: username,
        $priority: authUser.uid,
        height: 0,
        weight: 0,
        bmi: 0,
        bmiLevel: "empty"
      };

      console.log('step 4: saving username');
      users.$save(username).then(function () {
        console.log('step 5: setting current user');
        setCurrentUser(username);
        console.log('step 5 - current user: ' + username);
      });
    },
    update: function (username) {
      users[username].height = $rootScope.currentUser.height;
      users[username].weight = $rootScope.currentUser.weight;
      users[username].bmi = $rootScope.currentUser.bmi;
      users[username].bmiLevel = $rootScope.currentUser.bmiLevel;
      users[username].data = $rootScope.currentUser.data;
      users.$save(username);
    },
    findByUsername: function (username) {
      if (username) {
        return users.$child(username);
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    signedIn: function () {
      return $rootScope.currentUser !== undefined;
    }
  };

  function setCurrentUser (username) {
    $rootScope.currentUser = User.findByUsername(username);
    console.log('step 6: set user - ' + $rootScope.currentUser.username);
  }

  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
    query.$on('loaded', function () {
      console.log('step 7: loading user ' + query.$getIndex()[0]);
      setCurrentUser(query.$getIndex()[0]);
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    delete $rootScope.currentUser;
  });

  return User;
});