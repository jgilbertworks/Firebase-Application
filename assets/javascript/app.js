$( document ).ready(function() {
    console.log( "ready!" );

//Firebase configuration
  let firebaseConfig = {
    apiKey: 'AIzaSyBmoP82gIi40jQ50tY3CcYkKuuwkLg1kvA',
    authDomain: 'jembae-36df5.firebaseapp.com',
    databaseURL: 'https://jembae-36df5.firebaseio.com',
    projectId: 'jembae-36df5',
    storageBucket: '',
    messagingSenderId: '653344544793',
    appId: '1:653344544793:web:fabfdafb6093c134'
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// created a shortcut for firebase.database()
let database = firebase.database();

// Global Variable
let trainName = "";
let destination = "";
let nextArrival = "";
let frequency = "";

// Onclick event
$("#submit-btn").on("click",function(event){

  // no refresh
  event.preventDefault();
  
  // Grab user input
  trainName = $("#name-input").val().trim();
  destination = $("#destination-input").val().trim();
  nextArrival = $("#time-input").val().trim();
  frequency = $("#frequency-input").val().trim();
  
// If statement to prevent error for inputrs less than 1  
if (trainName.length < 1 || destination.length < 1 || nextArrival.length !== 5 || frequency.length < 1)

{
 $(".error").empty();
 $(".error").append("Enter Valid Field");
  return;
}
  else {
      
      // Push variable into firebase
      nextArrival = moment($("#time-input").val().trim(),"HH:mm").subtract(1,"years").format("X");
      database.ref().push({
      trainName,
      destination,
      nextArrival,
      frequency
  })

  // Empty form fields
  $("#name-input").val("");
  $("#destination-input").val("");
  $("#time-input").val("");
  $("#frequency-input").val("");
  $(".error").empty();
}

})

// add variables after refresh
database.ref().on("child_added",function(snapshot){

  let trainName = snapshot.val().trainName
  let destination = snapshot.val().destination    
  let frequency = snapshot.val().frequency
  let nextArrival = snapshot.val().nextArrival

  let remainder = moment().diff(moment(nextArrival,"X"), "minutes") % frequency;  
  let minutes = frequency - remainder;
  
  let arrival = moment().add(minutes, "minutes").format("hh:mm A");


let nextTrain = $("<tr>");
  nextTrain.html(`<td>${trainName}</td><td>${destination}</td><td>${frequency}</td><td>${arrival}</td><td>${minutes}</td>`);

  $("#table-holder").append(nextTrain);

})

});
