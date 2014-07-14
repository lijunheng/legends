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
      users[username].dataTime = $rootScope.currentUser.dataTime;
      users[username].incongruencyEffect = $rootScope.currentUser.incongruencyEffect;
      users[username].dataAverage = $rootScope.currentUser.dataAverage;
      users.$save(username);
    },
    submitExperiment: function (experiment) {
      if (User.signedIn()) {
        var user = User.getCurrent().$child('experiments');
        user[experiment.name] = {
          name: experiment.name,
          data: experiment.data,
          last_updated: experiment.last_updated
        };
        user.$save(experiment.name);
      }
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
    },
    getAvg: function () {
      var keys = users.$getIndex();
      console.log(keys);
      var incongruencyTotal = 0;
      var length = 0;
      for (var i = 0; i < keys.length; i++) {
        if (users[keys[i]].incongruencyEffect) {
          console.log(keys[i] + 'incongruencyEffect: ' + users[keys[i]].incongruencyEffect);
          incongruencyTotal = incongruencyTotal + users[keys[i]].incongruencyEffect;
          length++;
        }
      }
      var avg = incongruencyTotal / length;
      return avg;
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