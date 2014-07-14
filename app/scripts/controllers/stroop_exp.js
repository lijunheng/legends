'use strict';

app.controller('StroopExpCtrl', function ($rootScope, $scope, $location, Auth, User) {
	$scope.experiment = {name: '', data: '', last_updated: ''};

	$scope.submitExperiment = function () {
		$scope.experiment.name = "Stroop";
		$scope.experiment.data = data.join(";");
		$scope.experiment.last_updated = new Date();
		User.submitExperiment($scope.experiment);
		$location.path('/stroop');
	};

	var trialNum = 1; // Number of trials in each run.
		var trialId = 0; // The current trial in the run; start at 0.
		var runNum = 1; // How many runs are in each block. There are three blocks in total (only two are affected by runNum as the first is the practice block)
		var runId = 1; // The current run in the block; start at 1.
		var blockId = 3; // The current block; start at 1. The first block only has #practiceLength trials, and is the practice block.
		var practiceLength = 2; // How long you want to collect data to find the baseline reaction time

		function reposition(param) { // every time an element changes size, you must reposition it
			var Element = document.getElementById(""+param);
			Element.style.marginLeft = "-"+$("#"+param).width()/2+"px";
			Element.style.marginTop = "-"+$("#"+param).height()/2+"px";
		}
		
		var FixationCross = document.getElementById('indicator'); 
		var WordInd = document.getElementById('wordIndicator'); // Stimulus text
		var FeedBack = document.getElementById('feedback'); // Feedback text
		var Shape = document.getElementById('colorIndicator'); // Background color
		var Cue = document.getElementById('cue'); // Star indicates high reward, circle indicates low reward
		var StartExpButton = document.getElementById('startExpButton');
		var StartRunButton = document.getElementById('startRunButton');
		var EndExpButton = document.getElementById('endExpButton');
		var d1, d2, ans, reactionTime = null;

		reposition("indicator");
		reposition("colorIndicator");
		reposition("cue");
		reposition("startExpButton");
		reposition("startRunButton");
		reposition("endExpButton");

		var ColorInd = Shape.getContext("2d");
		var hasResponse = -1; // saves whether or not the user has responded, 0 = no response, 1 = response or time out, 3 = during reward presentation to continue  
		var timeOutHandle = 0; // time left until when response can no longer be accepted
		var cueTime = 400; // time for which the cue is displayed
		var fixationTime = 1000; // time of fixation between cue and stimulus (800-1200)
		var stimulusDisplayTime = 300; // time for which stimulus is displayed
		var stimulusReactTime = 1250; // time for the user to react to the stimulus (1000-1500)
		var feedbackTime = 400; // time for which feedback is displayed
		var ITI = 1000; // time between feedback and next trial (800-1200)
		var rewardPresentationTime = 2000; // time for which the total reward so far is presented
		var accuracy = "neutral";
		var cue = -1;
		var text = ""; // stores data temporarily to be added into data variable
		var trialReward = -1; // trialReward is calculated as (baselineRT + 200 - reactionTime) * (rewardFactor/if trial is high reward/)
		var rewardFactor = 10; // If this number is ten, then the high reward trials give ten times as many points as the low reward trials
		var color1 = "#0066FF"; // default 0066FF for blue
		var color2 = "#FF66CC"; // default FF66CC for pink
		var totalReward = 0; // total reward gained so far
		var sectionReward = 0; // reward earned in that section
		
		// 0: "BLUE", 1: "PINK", is the actual text of the stimulus
		var word = -1;
		// 0: BLUE, 1: PINK, is the color of the background (block 1) or text (block 2)
		var stimColor = -1;
		//0 is no reward; 1 is reward
		var reward = -1;

		var baselineRT = 500; // average of reaction times for first 30 trials (practice block)
		var practiceRTs = new Array();
		
		var data = new Array();
		
		$("#indicator").hide();
		$("#cue").hide();
		$("#wordIndicator").hide();
		$("#startExpButton").show();
		$("#startRatingsButton").hide();
		$("#runRatingsButton").hide();
		$("#startRunButton").hide();
		$("#endExpButton").hide();
		$("#Response").hide();
		$("#faceRTs").hide();
		$("#nofaceRTs").hide();
		$("#Ratings").hide();
		$("#ratingInstructions").hide();
		$("#reminderBox").hide();
		$("#colorIndicator").hide();
		$("#feedback").hide();
		$("#submitButton").hide();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ button event handlers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~		

		// Click on the startExpButton to begin the expeirment.
		$("#startExpButton").click(function(){
			$("#Initialization").hide();
			$("#startExpButton").hide();
			countdown(5);
		});
		
		// Initially count down from 5 to 0
		function countdown(time) {
			if (time > -1) {
				$("#indicator").html('Get ready: ' + time);
				reposition("indicator");
				$("#indicator").show();
				setTimeout(function(){countdown(time - 1)}, 10);
			} else {
				$("#indicator").text('+');
				reposition("indicator");
				$("#indicator").show();
				setTimeout(prepareCue,ITI);
			}
		}
		
		// Prepare the cue and randomly choose a word, color, and whether there is reward
		function prepareCue(){
			$("#indicator").text('+');
			reposition("indicator");
			trialId++;
		    if ((blockId != 1 && trialId > trialNum) || (blockId == 1 && trialId > practiceLength)) { // if the practice run has reached its length, or if any other runs have completed, then pause experiment and present button to continue or to end the experiment
		    	console.log(data.join(";"));
		    	$("#indicator").hide();
				trialId = 0; // reset the trial number back to zero for next run
				runId++; // increment the run
				if (blockId == 1) { // if the practice run is completed,
					runId = 1; // reset the run number
					blockId++; // and move on to the next block
					var sum = 0; // average first block to get baselineRT
					if (practiceRTs.length < practiceLength * 0.75) { // if participant completed fewer than 3/4s of the practice trials
						blockId = blockId - 1;
						runId = runId - 1;
						practiceRTs = new Array();
						$("#startRunButton").html("You did not complete enough trials to continue. Please click this button to redo this block.");
						reposition("startRunButton");
						$("#startRunButton").show();
					} else {
						for (var i = 0; i < practiceRTs.length; i++) {
							sum += parseInt(practiceRTs[i]);
						}
						if (baselineRT > 300) { 
							baselineRT = sum/practiceRTs.length;
						}
						console.log("Baseline RT: " + baselineRT);
						$("#startRunButton").html("End of run. Click this button to continue to the next run. <br>");
						reposition("startRunButton");
						$("#startRunButton").show();
					}
				}
				else if (runId > runNum && blockId == 2) { // if the runs in the second block are finished,
					runId = 1; // reset the run number
					blockId++; // and move on to the next block
					$("#startRunButton").html("You have completed the non-integrated Stroop task. Click this button to continue to the integrated Stroop task.");
					reposition("startRunButton");
					$("#startRunButton").show(); 
				} else if (runId > runNum && blockId == 3) { // if the runs in the third and final block are finished,
					console.log(data.join(";"));
					$("#endExpButton").show(); // present end experiment button
				} else { 
					$("#startRunButton").html("End of run. Click this button to start the next run."); // if an individual run is completed within a block (while the block is not completed),
					reposition("startRunButton");
					$("#startRunButton").show(); // present button to continue to next run in the block
				}
			} else { // otherwise show the stimuli
				fixationTime = Math.floor(Math.random() * 201) + 800; // jitter
				stimulusReactTime = Math.floor(Math.random() * 501) + 1000;
				ITI = Math.floor(Math.random() * 401) + 800;
				word = Math.floor(Math.random()*2); // "BLUE" or "PINK" text is chosen at random
				stimColor = Math.floor(Math.random()*2); // blue or pink color is chosen at random
				reward = Math.floor(Math.random()*2); // whether there is reward is chosen at random
				text = blockId + "-" + runId + "-" + trialId + "-";
				if (reward == 0) { // 0 reward indicates low reward, so present a circle as a cue
					document.getElementById("cue").setAttribute('ng-src', '/images/circle.png'); // prepare Circle image
					text = blockId + "-" + runId + "-" + trialId + "-N";
				} else { // 1 reward indicates high reward, so present a star as a cue
					document.getElementById("cue").setAttribute('ng-src', '/images/star.png'); // prepare Star image
					text = blockId + "-" + runId + "-" + trialId + "-Y";
				}
				showCue();
			}
		}

		// do another countdown after the run starts
		$("#startRunButton").click(function(){
			$("#startRunButton").hide();
			countdown(5);
		});
		
		// show the cue
		function showCue() {
			$("#cue").show();
			setTimeout(showFix, cueTime);
		}

		// show the fixation cross between presentation of the cue and presentation of the stimulus
		function showFix() {
			$("#cue").hide();
			$("#indicator").show();
			setTimeout(showStimulusDisplay, fixationTime);
		}
		
		// show the stimulus target
		function showStimulusDisplay() {
			hasResponse = 0; // setting hasResponse to 0 will allow the user keypress function to run
			if (word == 0) {
				$("#wordIndicator").text("BLUE");
				reposition("wordIndicator");
				text = text + "-B";
			} else {
				$("#wordIndicator").text("PINK");
				reposition("wordIndicator");
				text = text + "-P";
			}
			if (stimColor == 0) {
				switch(blockId) // block 1 and 2 are non-integrated, so the background rectangle is filled in with color. block 3 is integrated, so the font color of the text is changed
				{
					case 1: 
					ColorInd.fillStyle = color1;
					break;
					case 2:
					ColorInd.fillStyle = color1;
					break;
					case 3:
					WordInd.style.color = color1;
					break;
				}
				text = text + "-B";
			} else {
				switch(blockId)
				{
					case 1: 
					ColorInd.fillStyle = color2;
					break;
					case 2:
					ColorInd.fillStyle = color2;
					break;
					case 3:
					WordInd.style.color = color2;
					break;
				}
				text = text + "-P";
			}
			ColorInd.fillRect(0,0,225,80);
			$("#wordIndicator").show();
			if (blockId != 3) { // if on first block (non-integrated), display background color
				$("#colorIndicator").show();
			}
			d1 = new Date(); // record time of stimulus presentation
			setTimeout(showStimulusReact, stimulusDisplayTime);
		}

		function showStimulusReact() {
			$("#wordIndicator").hide();
			$("#colorIndicator").hide();
			timeOutHandle = setTimeout(showFeedback, stimulusReactTime);
		}
		
		function showFeedback() {
			if (hasResponse == 0) {
				if (blockId == 1) {
					$('#feedback').text("Incorrect")
				} else {
					$("#feedback").text("+0");
				}
				text = text + "-N";
			}
			reposition("feedback");
			$("#feedback").show();
			console.log(text);
			// text format: [blockId]-[runId]-[trialId]-[reward?]-[text color]-[stimulus color]-[response]-[correct?]-[reaction time]
			data.push(text); 
			setTimeout(showFix2, feedbackTime);
		}
		
		function showFix2() {
			$("#feedback").hide();
			$("#indicator").text('+');
			reposition("indicator");
			setTimeout(prepareCue, ITI);
		}
		
		function presentReward() {
			$("#feedback").hide();
			$("#indicator").html("You earned " + sectionReward + " points ($" + (sectionReward/180000).toFixed(2) + ") in this section. <br\> You have earned $" + (totalReward/180000).toFixed(2) + " points in total. <br\> Press any button to continue.");
			reposition("indicator");
			hasResponse = 3;
		} 
		
		$("#endExpButton").click(function(){
		});

		function isCorrect(response){ 
			if (stimColor == 0 && response == 'b') {
				accuracy = "Y";
				$("#feedback").text("Correct");
			}
			else if (stimColor == 1 && response == 'p') {
				accuracy = "Y";
				$("#feedback").text("Correct");
			}
			else {
				accuracy = "N";
				$("#feedback").text("Incorrect");
				trialReward = 0;
			}
		}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ keypress handler ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$("body").keypress(function(event){
	if (hasResponse == 3) {
		sectionReward = 0;
		showFix2();
		hasResponse = 1;
	}
	if (hasResponse == 0) {
		ans = String.fromCharCode(event.which);
		ans = ans.toLowerCase();
		hasResponse = 1;
		d2 = new Date();
		reactionTime = d2.getTime() - d1.getTime();
		trialReward = Math.round(baselineRT+200-reactionTime);
		if (reward == 1) {
			trialReward = trialReward * 10;
		}
				if (trialReward < 0) { // there is a small chance of getting negative reward if your response is slower than your baseline + 200 ms, so when that happens, just set the trial reward to 0
					trialReward = 0;
				}
				isCorrect(ans);
				if (accuracy == "Y" && blockId != 1) {
					$("#feedback").text("+" + trialReward);
				}
				else if (accuracy == "N" && blockId != 1) {
					$("#feedback").text("+0");
				}
				text = text + "-" + ans.toUpperCase() + "-" + accuracy + "-" + reactionTime + "-" + trialReward;
				if (blockId == 1) {
					practiceRTs.push(reactionTime)
				}
				if (blockId != 1) {
					totalReward = totalReward + trialReward;
					sectionReward = sectionReward + trialReward;
				}
			}
		});
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ other functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function initExp() {

		    var flag = true;//preload(fileNames);

		    $("#indicator").text("Please do not copy & paste this link to your web browser. In order to do this task properly, close this page and restart by clicking the link on MTurk.");
		    reposition("indicator");

		    if (typeof window.opener != 'undefined') {
		    	var aId = gup('assignmentId', window.opener.document.referrer);					    
		    	if (aId == "ASSIGNMENT_ID_NOT_AVAILABLE" || aId == "") {
		    		flag = false;
		    	} else {
		    		flag = true;
		    	}
		    } else {
		    	flag = false;
		    }


		    if (flag) {
			    //$("#indicator").text("This task consists of 4 runs in total.");
			    //$("#NoFeedbackButton").show();
				//countdown(5);
			} else {
				$("#indicator").text("Please do not copy & paste this link to your web browser. In order to do this task properly, close this page and restart by clicking the link on MTurk.");
				reposition("indicator");
			}
		}  
		
		///Function To stop backspace presses 8, and spaces 32 
		$(function(){
		    /*
		     * this swallows backspace keys on any non-input element.
		     * stops backspace -> back
		     */
		     var rx = /INPUT|SELECT|TEXTAREA/i;

		     $(document).bind("keydown keypress", function(e){
			     if( e.which == 32 ||e.which == 8 ){ // 8 == backspace
			     	if(!rx.test(e.target.tagName) || e.target.disabled || e.target.readOnly ){
			     		e.preventDefault();
			     	}
			     }
			 });
		 });
