
/*note, in order for sound to play, the user must interact with the web page
   somehow. So for instance, if the user clicks on the body, then we
   can call playSounfOfLastColor or any other method where interval
   it may be imbedded. Otherwise, it won't work*/

//the 4 valid colors
var colors = ["red", "blue", "green", "yellow"];
//stores the colors that have been displayed by the game so far
var gamePattern = [];
//stores the colors that the user has clicked on at a given level
var userClickPattern = [];
//to keep track of the level
var level = 0;
//keeps track of the last color that was added to the gamePattern
var lastAddedColor="";



//starts the game upon the user pressing down a key
$(document).on("keydown", function(){
   //triggers the first level
   nextLevel();
   //adds click events to the 4 buttons: flash, sound, update userClickPattern.
   addButtonFunctionality();
   //ads click events that are concerned with going up levels
   userButtonPressAction();
   $(document).off();
   });

/*At each level, the user has to click on the colors that match the
   game pattern in its exact order. If the user clicks a color that is
   out of sequence with the gamePattern, the user loses. The user will be
   allowed to keep pressing buttons so long as the buttons he has pressed
   form an ordered subset of the gamePattern and so long as the amount of
   buttons he has pressed  is less than how many colors/buttons are in the
   gamePattern
*/
function userButtonPressAction() {
   $(".btn").click(function() {
      if(!isClickPatternOrderedSubsetOfGamePattern()) {
         gameOver();
         return;
      }
      if(userClickPattern.length < gamePattern.length)
         return;

      /*if user gets to this point, then the clickPattern must equal the
        gamePattern. So, the user will go on to the next level*/
      userClickPattern = [];
      setTimeout(nextLevel, 1000);

      });
}

//checking if the user's click pattern is an ordered subset of gamePattern
function isClickPatternOrderedSubsetOfGamePattern() {
   for(var x = 0 ; x < userClickPattern.length; x++) {
      if( userClickPattern[x] != gamePattern[x])
         return false;
   }
   return true;
}

/*sequence of events that occur when the user loses by clicking an incorrect
 color button*/
function gameOver() {
   //resetting level
   level = 0;

   //sound clip that plays when the user enters a wrong answer
   var gameOverSound = new Audio("sounds/wrong.mp3");
   gameOverSound.play();

   //turns the body's background red for 500ms
   $("body").addClass("game-over");
   setTimeout(function(){$("body").removeClass("game-over");}, 500);

   document.querySelector("h1").innerHTML = "Game Over. Press Any Key To Continue.";

   //essentially, restarts the game.
   $(document).on("keydown", function(){
      if(level == 0) {
         gamePattern = [];
         userClickPattern = [];
         nextLevel();
      }
      $(document).off();
   });
}

//actions that occur when the user goes up a level.
function nextLevel() {
   level++;
   $("h1").html("Level " + level);
   lastAddedColor = addToGamePattern();
   flashLastAddedColor(lastAddedColor);
   playSoundOfColor(lastAddedColor);
}

//adds a new color to the gamePattern array and returns it.
function addToGamePattern() {
   //generates a number in the range [0,3]
   var randNum = Math.round((Math.random() * 3) );
   gamePattern.push( colors[randNum] );
   return colors[randNum];
}


//flashes the button that was just added to the gamePattern array
function flashLastAddedColor(lastAddedColor) {
   $("." + lastAddedColor).animate({opacity: 0.5}, 200);
   $("." + lastAddedColor).animate({opacity: 1}, 200);
}

//flashes the button clicked by the user.
function flashClickedButton(theColor) {
   $("." + theColor).addClass("pressed");
   setTimeout( function() {$("." + theColor).removeClass("pressed")}, 250 );

}

//plays the sound clip corresponding to the passed in color.
function playSoundOfColor(theColor) {
   var sound = new Audio("sounds/" + theColor + ".mp3");
   sound.play();
}


/*
  This function ensures that upon click of one of the 4 buttons, a sound is
  played and that the color of clicked button is saved in the userClickPattern
  array.

  self note: when I first tried to do this function, playSoundOfColor would
  always only play the last color in the array. This had to do with a scope
  issue. The function within the .click function would only take the last element
  that "theColor" was set to, meaning that it executed at the very end of the
  for loop and not when it was encountered. So, one solution was to add a closure
  , which ensures that we get the state of the variable we want to pass in as
  it should be at every iteration. In this method, we have to use a wrapper
  function where we pass in the desired variable, and then within that function,
  return a function with the logic that we want, also adding the name of the
  variable in parentheses right after the closing curly brace of the outermost
  function.
  The second solution was to use "this" to get the id of the button that
  we are trying to add an event to - the id contains the desired the color.
  A third solution is commented out at the bottom of this file.
*/
function addButtonFunctionality() {

   for(var x = 0; x < colors.length; x++ ) {
      var theColor = colors[x];

      $("#" + theColor).click( function(theColor) {
         return function() {
            userClickPattern.push(theColor);
            playSoundOfColor(theColor);
            flashClickedButton(theColor)};
      } (theColor)             );

      //$("#" + colors[x]).click( function() {playSoundOfColor( $(this).attr("id")); } );

      //this will not work as desired.
      //$("#" + colors[x]).click( function() {playSoundOfColor( theColor; } );
   }
}


//making the 4 buttons responsive to clicks
// function addButtonFunctionality() {
//    /*recall that this will select all elements with ".btn" class and apply the click
//       event accordingly*/
//    $(".btn").click(function() {
//
//      var userClickedButtonColor = $(this).attr("id");
//      userClickPattern.push(userClickedButtonColor);
//      playSoundOfColor(userClickedButtonColor);
//
//    });
// }

// function userColorDecision() {
//    $("document").click(function(event) {
//       var clickedID = $(event.target).attr('id');
//
//       while(!colors.includes(clickedID)) {
//          alert("error!");
//          clickedID = $(event.target).attr('id');
//       }
//
//       alert("success");
//
//    });
//
// }
