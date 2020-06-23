var counter = 0;
var curCount = 0;
// get today's date in desired format
var today = moment().format("dddd, MMMM Do YYYY");
console.log(typeof(today));
// assign today's date to display in the currentDay 
var currentDate = document.getElementById("currentDay");
var plannedTasks = JSON.parse(localStorage.getItem('plans')) || [];
currentDate.innerHTML = today;
//console.log(today);
// Get the current hour
var currentHour = moment().hour();
console.log(currentHour);
// array of timeblocks for the work day
var timeBlocks = [ 9, 10, 11, 12, 13, 14, 15, 16, 17];
//loop through to assign classes to timeblocks based on current hour and the block's hour
for(var i =  0; i< timeBlocks.length; i++){
  var block = document.getElementById(timeBlocks[i]).childNodes;
  block = block[3];
  if(timeBlocks[i] < currentHour){           
    $(block).addClass('past');
  }
  else if (timeBlocks[i] > currentHour){
    $(block).addClass('future'); // = "future";
  }
  else{
    $(block).addClass('present'); // = "present";
  }
}

// Display any saved plans in the appropriate hour block
function renderPlans(){
  for (var i = 0; i<plannedTasks.length; i++){
      
    //var planItem = $("<div>");
      //console.log(typeof(plannedTasks[i].date));
    if(plannedTasks[i].date != today){
      //console.log(typeof(plannedTasks[i].date));
      plannedTasks.splice(i,1);
      savePlans();
      renderPlans();
    }
    var text = plannedTasks[i].plan;
    //planItem.text = plannedTasks[i].plan;
    var block = document.getElementById(plannedTasks[i].hour).childNodes;
    block = block[3];
    $(block).text(text);
    counter++;
  }
}

$(".description").on("blur", function(){
  // get the textarea's current value/text
  console.log($(this).val());
  var text = $(this).val().trim();
  console.log("blur text area furntion activated");
  console.log($(this));
  console.log($(this).closest(".description"));
  console.log($(this).closest(".description").attr("id"));
  // get the parent id attribute
  var hour = $(this).closest(".description").attr("id");

  // get the plan's position in the list of other elements
  //var index = $(this).closest

  //plannedTasks[hour].text = text;
  //savePlans();
  // recreate p element
  //var planP = $("<p>").addClass("m-1").text(text);
});

function savePlans(){
    localStorage.setItem("plans", JSON.stringify(plannedTasks));
}

// Either editing or creating new plan
$(".description").on("click", function(event){
  event.preventDefault;
  console.log("Trying to click on description")
  var text = $(this).text().trim();
  
  console.log($(this));
  var descript = $(this);
  var hour = $(this).parent().attr("id");
  //var par = document.createElement("p");
  //$(this).append(par);
  var textInput = $("<textarea>").addClass("md-textarea col-10 ").val(text);
  if(hour > currentHour){
    $(textInput).addClass("future");
  }
  else if( hour < currentHour){
    $(textInput).addClass("past");
  }
  else{
    $(textInput).addClass("present");
  }
  $(descript).replaceWith(textInput);
  textInput.trigger("focus");
});

// saving updates or initializing new plans
$(".saveBtn").on('click', function(event){
  event.preventDefault;
  console.log("clicked save buttpon!")
  //console.log($(this).parent().attr("id"));
  var thisHour = $(this).parent().attr("id");
  var text = $(this).prev('textarea').val();
  var descripDev = $(this).prev('textarea');
  //descripDev = descripDev.childNodes;
 // textarea = descripDev[0];
  //var text = $(descripDev[0]).val();
  console.log(text)
  var parInput = $("<div>").addClass("col-10 description text-left p-1");
  if(thisHour > currentHour){
    $(parInput).addClass("future");
  }
  else if( thisHour < currentHour){
    $(parInput).addClass("past");
  }
  else{
    $(parInput).addClass("present");
  }
  $(parInput).text(text); 
  //parInput.innerHTML = text;
  console.log(parInput);
  $(descripDev).replaceWith(parInput);
  var newPlan = {
    hour: thisHour,
    plan: text,
    date: today
  };
  console.log(newPlan);
  var existCheck = false;
    for(var i =0; i<plannedTasks.length; i++){
        if(plannedTasks[i].hour === thisHour){
            console.log("we've got a match");
            plannedTasks[i].plan = text;
            existCheck = true;
        }
    }
    if(!existCheck){
        plannedTasks.push(newPlan);
    }
  savePlans();
});

var loadPlans = function(){
  plans = JSOPN.parse(localStorage.getItem("plans"));

  if(!plans){
    plans = [
      {
        hour: "",
        plan: ""
      }
    ];
    
  }
}
renderPlans();