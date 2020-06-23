// get today's date in desired format
var today = moment().format("dddd, MMMM Do YYYY");

// assign today's date to display in the currentDay 
var currentDate = document.getElementById("currentDay");
var plannedTasks = JSON.parse(localStorage.getItem('plans')) || [];
currentDate.innerHTML = today;

// Get the current hour
var currentHour = moment().hour();
//console.log(currentHour);
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
  }
}

function savePlans(){
    localStorage.setItem("plans", JSON.stringify(plannedTasks));
}

// Either editing or creating new plan
$('div').on('click', '.description', function(event){
  event.preventDefault;
  var text = $(this).text().trim();
  
  var descript = $(this);
  var hour = $(this).parent().attr("id");
  
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

  var thisHour = $(this).parent().attr("id");
  var text = $(this).prev('textarea').val();
  var descripDev = $(this).prev('textarea');
  
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
  plans = JSON.parse(localStorage.getItem("plans"));

  if(!plans){
    plans = [
      {
        hour: "",
        plan: ""
      }
    ];
    
  }
}
loadPlans();
renderPlans();