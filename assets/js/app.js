 // Initialize Firebase
 var config = {
    apiKey: "YOUR_KEY_HERE",
    authDomain: "formdata-e4174.firebaseapp.com",
    databaseURL: "https://formdata-e4174.firebaseio.com",
    projectId: "formdata-e4174",
    storageBucket: "formdata-e4174.appspot.com",
    messagingSenderId: "665972625346"
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
  



//Google time
var currentDateTime= "";
var t = "";
var  displayTime = function() {
    //http://www.javascriptkit.com/dhtmltutors/local-time-google-time-zone-api.shtml
    var location= "39.946343,-75.162644"; //my current location
    var targetDate= new Date(); // current date/time of pc
    var timestamp = targetDate.getTime()/1000 + targetDate.getTimezoneOffset() * 60;//current UTC date/time in seconds since midnight 1/1/1970
    var apikey = "YOUR_KEY_HERE"; //my key
    var queryURL = "https://maps.googleapis.com/maps/api/timezone/json?location=" + location + '&timestamp=' + timestamp + '&key=' + apikey

    // Creating an AJAX call for the current time
    $.ajax({
        url: queryURL,
        method: "GET"
      }).then(function(response) {
        console.log(response);
        
        var offsets = response.dstOffset * 1000 + response.rawOffset * 1000 // get DST and time zone offsets in milliseconds
            var localdate = new Date(timestamp * 1000 + offsets) // Date object containing current time of Tokyo (timestamp + dstOffset + rawOffset)
            currentDateTime= (localdate.toLocaleString());
            console.log(localdate.toLocaleString()) // Display current Philadelphia date and time
            $("#currentTime").text(currentDateTime);
           
            return currentDateTime;
      });
      
};

displayTime();

//setInterval(displayTime, 1000);

//$("#currentTime").text(setInterval(displayTime, 1000));
//$("#currentTime").text(t);


/*


https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=40.045122,75.059438&radius=15&types=food&key=AIzaSyD6i_Q0LsVxNcq45QqH_Vb-yJMyksGGPk0

https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&fields=photos,formatted_address,name,rating,opening_hours,geometry&key=AIzaSyD6i_Q0LsVxNcq45QqH_Vb-yJMyksGGPk0 

*/