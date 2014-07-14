'use strict';

app.controller('StroopCtrl', function ($rootScope, $scope, $location, Game, Auth, User) {
	$scope.analyzeDataClicked = false;
	$scope.compareDataClicked = false;

	$scope.compareData = function () {
		$scope.incongruencyAvg = User.getAvg();
		$scope.compareDataClicked = true;
		console.log(User.getAvg());
	};

	$scope.analyzeData = function () {
		$scope.analyzeDataClicked = true;
		console.log($rootScope.currentUser);
		var data = $rootScope.currentUser.experiments.Stroop.data;
		var dataArray = data.split(";");
		var block = new Array();
		var run = new Array();
		var trial = new Array();
		var reward = new Array();
		var text = new Array();
		var color = new Array();
		var response = new Array();
		var correct = new Array();
		var reactionTime = new Array();
		var congruency = new Array();
		for (var i = 0; i < dataArray.length; i++) {
			var values = dataArray[i].split("-");
			if (values[0] == 1) {
				block.push("practice");
			} else if (values[0] == 2) {
				block.push("non-integrated");
			} else if (values[0] == 3) {
				block.push("integrated");
			}
			run.push(values[1]);
			trial.push(values[2]);
			if (values[3] == "Y") {
				reward.push("high reward");
			} else if (values[3] == "N") {
				reward.push("low reward");
			}
			if (values[4] == "B") {
				text.push("blue");
			} else if (values[4] == "P") {
				text.push("pink");
			}
			if (values[5] == "B") {
				color.push("blue");
			} else if (values[5] == "P") {
				color.push("pink");
			}
			response.push(values[6]);
			if (values[6] != "N") {
				if (values[7] == "Y") {
					correct.push("correct");
				} else if (values[7] == "N") {
					correct.push("incorrect");
				}
			}
			reactionTime.push(values[8]);
			if (values[4] == values[5]) {
				congruency.push("congruent");
			} else if (values[4] != values[5]) {
				congruency.push("incongruent");
			}
		}

		var dataStruct = new Array();
		dataStruct.push(block);
		dataStruct.push(run);
		dataStruct.push(trial);
		dataStruct.push(reward);
		dataStruct.push(text);
		dataStruct.push(color);
		dataStruct.push(response);
		dataStruct.push(correct);
		dataStruct.push(reactionTime);
		dataStruct.push(congruency);

		var headers = new Array();
		headers.push('block');
		headers.push('run');
		headers.push('trial');
		headers.push('reward');
		headers.push('text');
		headers.push('color');
		headers.push('response');
		headers.push('correct');
		headers.push('reactionTime (ms)');
		headers.push('congruency');

		tableCreate();
		var sumTotal = 0;
		var congruentOnes = findIndices(congruency, 'congruent');
		var sumCongruent = 0;
		var length = 0;
		for (var i = 0; i < congruentOnes.length; i++) {
			if (reactionTime[congruentOnes[i]]) {
				sumTotal = sumTotal + parseInt(reactionTime[congruentOnes[i]]);
				sumCongruent = sumCongruent + parseInt(reactionTime[congruentOnes[i]]);
				length++;
			}
		}
		$scope.congruentAvg = sumCongruent / length;
		var incongruentOnes = findIndices(congruency, 'incongruent');
		var sumIncongruent = 0;
		var inconLength = 0;
		for (var i = 0; i < incongruentOnes.length; i++) {
			if (reactionTime[incongruentOnes[i]]) {
				sumTotal = sumTotal + parseInt(reactionTime[incongruentOnes[i]]);
				sumIncongruent = sumIncongruent + parseInt(reactionTime[incongruentOnes[i]]);
				inconLength++;
			}
		}
		$scope.incongruentAvg = sumIncongruent / inconLength;
		$scope.incongruencyEffect = $scope.incongruentAvg - $scope.congruentAvg;
		$rootScope.currentUser.incongruencyEffect = Math.round($scope.incongruencyEffect);
		$scope.dataAverage = sumTotal / (length + inconLength);
		$rootScope.currentUser.dataAverage = Math.round($scope.dataAverage);
		User.update($rootScope.currentUser.username);

		function findIndices(array, object) {
			var indices = new Array();
			for (var i = 0; i < array.length; i++) {
				if (object == array[i]) {
					indices.push(i);
				}
			}
			return indices;
		}

		function tableCreate() {
			var body = document.getElementById('dataAnalysis');
			var tbl = document.createElement('table');
			tbl.style.width = '100%';
			tbl.setAttribute('border', '1');
			var tbdy = document.createElement('tbody');
			var tr=document.createElement('tr');
			for(var i = 0; i < headers.length; i++){
				var td=document.createElement('td');
				td.appendChild(document.createTextNode(headers[i]));
				tr.appendChild(td);
			}
			tbdy.appendChild(tr);
			for(var i = 0; i < dataStruct[0].length; i++){
				var tr=document.createElement('tr');
				for(var j = 0; j < headers.length; j++){
					var td=document.createElement('td');
					td.appendChild(document.createTextNode(dataStruct[j][i]));
					tr.appendChild(td);
				}
				tbdy.appendChild(tr);
			}
			tbl.appendChild(tbdy);
			body.appendChild(tbl);
		}
	};
});