
function CaloriesCalculator(pDay, pFood, pCalories) {
    this.day= pDay;
    this.food = pFood;
    this.calories = pCalories;
    this.homemade = false;
  }
  var ClientNotes = [];  // our local copy of the cloud data


document.addEventListener("DOMContentLoaded", function (event) {

    document.getElementById("submit").addEventListener("click", function () {
        var tDay = document.getElementById("day").value;
        var tFood = document.getElementById("food").value;
        var tCalories = document.getElementById("calories").value;
        var oneCaloriesCalculator = new CaloriesCalculator(tDay, tFood, tCalories);

        $.ajax({
            url: '/NewDay' ,
            method: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(oneCaloriesCalculator),
            success: function (result) {
                console.log("added new note")
            }

        });
    });

    document.getElementById("get").addEventListener("click", function () {
        updateList()
    });
  


    document.getElementById("delete").addEventListener("click", function () {
        
        var whichDay = document.getElementById('deleteDay').value;
        var idToDelete = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].day === whichDay) {
                idToDelete = ClientNotes[i]._id;
           }
        }
        
        if(idToDelete != "")
        {
                     $.ajax({  
                    url: 'DeleteDay/'+ idToDelete,
                    type: 'DELETE',  
                    contentType: 'application/json',  
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
        }
        else {
            console.log("no matching Subject");
        } 
    });



    document.getElementById("msubmit").addEventListener("click", function () {
        var tDay = document.getElementById("mday").value;
        var tFood = document.getElementById("mfood").value;
        var tCalories = document.getElementById("mcalories").value;
        var oneCaloriesCalculator = new CaloriesCalculator(tDay, tFood, tCalories);
        oneCaloriesCalculator.homemade =  document.getElementById("mhomemade").value;
        
            $.ajax({
                url: 'UpdateDay/'+idToFind,
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify(oneCaloriesCalculator),
                    success: function (response) {  
                        console.log(response);  
                    },  
                    error: function () {  
                        console.log('Error in Operation');  
                    }  
                });  
            
       
    });


    
    var idToFind = ""; // using the same value from the find operation for the modify
    // find one to modify
    document.getElementById("find").addEventListener("click", function () {
        var tDay = document.getElementById("modDay").value;
         idToFind = "";
        for(i=0; i< ClientNotes.length; i++){
            if(ClientNotes[i].day === tDay) {
                idToFind = ClientNotes[i]._id;
           }
        }
        console.log(idToFind);
 
        $.get("/FindDay/"+ idToFind, function(data, status){ 
            console.log(data[0].day);
            document.getElementById("mday").value = data[0].day;
            document.getElementById("mfood").value= data[0].food;
            document.getElementById("mcalories").value = data[0].calories;
            document.getElementById("mhomemade").value = data[0].homemade;
           

        });
    });

    // get the server data into the local array
    updateList();

});


function updateList() {
var ul = document.getElementById('listUl');
ul.innerHTML = "";  // clears existing list so we don't duplicate old ones

//var ul = document.createElement('ul')

$.get("/CaloriesCalculators", function(data, status){  // AJAX get
    ClientNotes = data;  // put the returned server json data into our local array

    // sort array by one property
    ClientNotes.sort(compare);  // see compare method below
    console.log(data);
    //listDiv.appendChild(ul);
    ClientNotes.forEach(ProcessOneCaloriesCalculator); // build one li for each item in array
    function ProcessOneCaloriesCalculator(item, index) {
        var li = document.createElement('li');
        ul.appendChild(li);

        li.innerHTML=li.innerHTML + index + ": " + " Day: " + item.day + "  " + item.food + ":  " + item.calories + " Homemade? "+ item.homemade;
    }
});
}

function compare(a,b) {
    if (a.homemade == false && b.homemade== true) {
        return -1;
    }
    if (a.homemade == false && b.homemade== true) {
        return 1;
    }
    return 0;
}
