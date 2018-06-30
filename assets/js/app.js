 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyClEsPXC-Lh2U_UtBf2l73jdf1wQ85xpdI",
  authDomain: "trainschedule-9d5b7.firebaseapp.com",
  databaseURL: "https://trainschedule-9d5b7.firebaseio.com",
  projectId: "trainschedule-9d5b7",
  storageBucket: "trainschedule-9d5b7.appspot.com",
  messagingSenderId: "478154157096"
};
  firebase.initializeApp(config);

  var database = firebase.database();

//create variables
  var trainName= "";
  var destination= ""
  var firstTrain="";
  var frequency = "";
  var nextTrain = null;
  var firstTimeConverted =null;
  var tMinutesTillTrain = null;
  
//onclick for form
$("#submit").on("click", function(){
//prevent default behavior
event.preventDefault();  

//get input from user & store in variables
trainName = $("#trainName").val().trim();
destination =  $("#destination").val().trim();
firstTrain =  $("#firstTrain").val().trim();
frequency =  $("#frequency").val().trim();

console.log("Train Name: " +trainName);
console.log("Destination: " +destination);
console.log("First Train: " +firstTrain);
console.log("Train Frequency: " +frequency);

// Creates variables to connect to firebase
var trainInfo = {
    trainName: trainName,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };
//push trainInfo to database
database.ref().push(trainInfo);

// $("#trainName").val("");
// $("#desination").val("");
// $("#firstTrain").empty();
// $("#frequency").empty();

clearForm()

});

function clearForm() {
    document.getElementById("trainForm").reset();
};

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
  
    // Store everything into a variable.
    trainName = childSnapshot.val().trainName;
    destination = childSnapshot.val().destination;
    firstTrain = childSnapshot.val().firstTrain;
    frequency = childSnapshot.val().frequency; 
  
    // Employee Info
    console.log(trainName);
    console.log(destination);
    console.log(firstTrain);
    console.log(frequency);
    // First Time (pushed back 1 year to make sure it comes before current time)
    firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);

    // Minute Until Train
    tMinutesTillTrain = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));
   
      // Create the new row
    var newRow = $("<tr>").append(
      $("<td>").text(trainName),
      $("<td>").text(destination),
      $("<td>").text(frequency),
      $("<td>").text(nextTrain),
      $("<td>").text(tMinutesTillTrain)
     
    );
  
    // Append the new row to the table
    $("#mainSchedule > tbody").append(newRow);
    
  });
  
  function displayTime () {
    var currentTime = moment().format('MMM Do YYYY, h:mm:ss a');
    $("#currentTime").text(currentTime);

  }
  setInterval(displayTime, 1000);


