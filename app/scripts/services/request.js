'use strict';

app.factory('Request', function ($firebase, FIREBASE_URL, User) {
	var ref = new Firebase(FIREBASE_URL + 'requests');

	var requests = $firebase(ref);

	var Request = {
		all: requests,
		create: function (request) {
			if (User.signedIn()) {
				var user = User.getCurrent();

				request.owner = user.username;

				return requests.$add(request).then(function (ref) {
					var requestId = ref.name();

					user.$child('requests').$child(requestId).$set(requestId);

					return requestId;
				});
			}
		},
		find: function (requestId) {
			return requests.$child(requestId);
		},
		addRider: function(requestId) {
			if (User.signedIn()) {
				console.log('2) getting user');
				var user = User.getCurrent();
				console.log('3) getting username');
				var rider = {};
				rider.username = user.username;
				rider.requestId = requestId;
				console.log('4) adding rider');
				requests.$child(requestId).$child('riders').$add(rider).then(function (ref) {
					user.$child('riders').$child(ref.name()).$set({id: ref.name(), requestId: requestId});
				});
			}
		},
		deleteRider: function (requestId, rider, riderId) {
			if (User.signedIn()) {
				var user = User.findByUsername(rider.username);
				console.log('step 5: deleting rider');
				requests.$child(requestId).$child('riders').$remove(riderId).then(function () {
					user.$child('riders').$remove(riderId);
				});
			}
		},
		delete: function (requestId) {
			if (User.signedIn()) {
				var request = Request.find(requestId);

				request.$on('loaded', function () {
					var user = User.findByUsername(request.owner);

					requests.$remove(requestId).then(function () {
						user.$child('requests').$remove(requestId);
					});
				});
			}
		}
	};
	return Request;
});