// Function to check whether there is level data in the url
function checkURLData() {
    
    // Fetch the level data parameter
    var data = new URL(window.location.href).searchParams.get('ld');
    
    // Check if there is data
    if (data != null) {
        
        // Load the level from the level data
        loadLevel(data.split("x"));
        
    }
    
    // Otherwise load an empty level
    else {
        openLevel("levelOne.txt");
    }
    
}

//Create a function to load in from file
function openLevel(levelName) {
    
    // Store the current level
    currentLevel = levelName;
    
    //First create a http request and fetch the file
    var client = new XMLHttpRequest();
    client.open('GET', "levels/"+levelName, true);
    client.send();
    
    //When the file is received parse the text
    client.onreadystatechange = function() {
        
        //If the client is ready
        if (client.readyState == 4) {
            
            //If fetching was successful
            if(client.status == 200) {
                
                //Open the level and strip whitespace
                var levelText = client.responseText.replace(/\s/g,'');
                loadLevel(levelText.split("x"));
				
            } else {
                //Log failure
                alert("Failed to load level from server.")
            }
        }
    }
}

// Function to load level data
function loadLevel(data) {
	
	// Filter the array
	data = data.filter(Boolean);
	
	// Load the level data
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			
			// Get the data
			var d = data[i][j];
			
			// Check if the data is for a wall
			if (d == "1") {
				
				// Add a wall
				walls.push([j,i]);
				
			}
			
			// Check if data is for the goal
			else if (d == "2") {
				
				// Set the goal location
				goalX = j;
				goalY = i;

			}
			
			// Check if it is the spawn location of the player
			else if (d == "3") {
				
				// Set the player location
				playerX = j;
				playerY = i;
				
			}
			
		}
		
	}
	
}