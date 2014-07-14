'use strict';

app.factory('Experiment', function ($firebase, FIREBASE_URL, User) {
	var ref = new Firebase(FIREBASE_URL + 'experiment');

	var experiments = $firebase(ref);

	var Experiment = {
		all: experiments,
		create: function (experiment) {
			if (User.signedIn()) {

				var user = User.getCurrent().$child('experiments');
				user[experiment.name] = {
					name: experiment.name,
					data: experiment.data,
					last_updated: experiment.last_updated
				};

				user.$save(experiment.name);

				experiment.owner = user.username;

				return experiments.$add(experiment).then(function (ref) {
					ref.$id = experiment.name;
					var experimentId = ref.name();
					user.$child('experiments').$child(experimentId).$set(experimentId);

					return experimentId;
				});
			}
		},
		find: function (experimentId) {
			return experiments.$child(experimentId);
		},
		delete: function (experimentId) {
			if (User.signedIn()) {
				var experiment = Experiment.find(experimentId);

				experiment.$on('loaded', function () {
					var user = User.findByUsername(experiment.owner);

					experiments.$remove(experimentId).then(function () {
						user.$child('experiments').$remove(experimentId);
					});
				});
			}
		}
	};
	return Experiment;
});