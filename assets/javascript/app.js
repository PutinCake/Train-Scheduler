$(document).ready(function() {


    //====================initialize firebase============================
    var config = {
      apiKey: "AIzaSyBZH2ePiNTlMWRcFx_XyV_CRx7pJU9VLIc",
      authDomain: "train-scheduler-mo.firebaseapp.com",
      databaseURL: "https://train-scheduler-mo.firebaseio.com",
      projectId: "train-scheduler-mo",
      storageBucket: "train-scheduler-mo.appspot.com",
      messagingSenderId: "214843182085"
    };

    firebase.initializeApp(config);

      var database = firebase.database();

      //====================button for adding train================
      $("#add-train-btn").on("click", function(event) {
        
        event.preventDefault();

        var nameTrain = $("#train-name-input").val().trim();
        var nameDestination = $("#destination-name-input").val().trim();
        var nameFirstTime = moment($("#first-time-input").val().trim(),"HH:mm").format("HH.mm");
        var nameFrequency = $("#frequency-input").val().trim();

        // Train Info=======================================================
        // console.log(nameTrain);
        // console.log(nameDestination);
        // console.log(nameFirstTime);
        // console.log(nameFrequency);
    // to create local temporary object to hold train data
        var newTrain = {
          name: nameTrain,
          place: nameDestination,
          fristTrain: nameFirstTime,
          frequency: nameFrequency
        }
    
    // uploads train data to the database
    database.ref().push(newTrain);
    console.log(newTrain.name);

    // clears all the text-boxes
    $("#train-name-input").val("");
    $("#destination-name-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");

    return false;
    });

    //  Created a firebase event listner for adding trains to database and a row in the html when the user adds an entry
    database.ref().on("child_added", function(childSnapshot) {
      console.log(childSnapshot.val());

    //======store the childSnapshot values into a variables=================================================================
    var nameTrain = childSnapshot.val().name;
    var nameDestination = childSnapshot.val().place;
    var nameFirstTime = childSnapshot.val().fristTrain;
    var nameFrequency = childSnapshot.val().frequency;
    //==============converted time needs to comes before current time=============
    var firstTimeConverted = moment(nameFirstTime, "HH:mm");
    console.log(firstTimeConverted);
    var currentTime = moment().format("HH:mm");
    console.log("CURRENT TIME: " + currentTime);
    //===========store difference between converted time and current time========
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");

    console.log(nameFirstTime);
    console.log("Difference in Time: " + timeDiff);

    //find the time left and store it in a variable
    var timeRemainder = timeDiff % nameFrequency;
    console.log(timeRemainder);
    //======calculate minutes till train=========================
    var minToTrain = nameFrequency - timeRemainder;
    //==============next train==========================================
    var nxTrain = moment().add(minToTrain, "minutes").format("HH:mm");
    // Add each train's data into the table
    $("#trainTable > tbody").append("<tr><td>" + nameTrain + "</td><td>" + nameDestination + "</td><td>" +
    nameFrequency + "</td><td>" + nxTrain + "</td><td>" + minToTrain + "</td><td>" + "<input type='submit' value='remove train' class='remove-train btn btn-primary btn-sm'>" + "</td></tr>");
    }, function(errorObject){
      //console.log("Errors handled: " + errorObject.code)
    });

    $("body").on("click", ".remove-train", function(){
      $(this).closest ('tr').remove();
    });


}); 
