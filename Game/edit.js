// Store the width and height of the canvas
var width, height;

// Grid variables
var gridSize = 16;
var backgroundColour;

// Player variables
var player, playerX = 0, playerY = 0, playerW, playerH;

// Store the selection mode
var mode;

// Variable to hold the location of the goal
var goalX = 15;
var goalY = 15;

// Variable to hold the walls
var walls;

// Setup function run first
function setup() {
	
	// Set the width and height
	width = 550;
	height = 650;
	
	// Set up dimensions of the player and the grids
	playerW = width / gridSize;
	playerH = height / gridSize;
	
	// Create the canvas
	var cnv = createCanvas(width, height);
	cnv.parent("cnv");
	
	// Get the main character image
	player = loadImage("knack.png");
	
	// Set the background colour
	backgroundColour = "#FFF";
	
	// Create an empty list of walls
	walls = [];
	
	// Load the level
	openLevel("empty.txt");
	
	// Set default mode
	mode = "player";
	
}

// Update function
function draw() {
	
	// Draw the grid
	drawGrid();
	
	// Draw the player image
	image(player, playerX * playerW, playerY * playerH, playerW, playerH);
	
	// Draw the goal
	fill("#1E90FF");
	rect(goalX * playerW, goalY * playerH, playerW, playerH);
	
	// Draw the walls
	drawWalls();

}

// Function to draw the walls
function drawWalls() {
	
	// For each wall, draw it
	for (var i = 0; i < walls.length; i++) {
		
		// Draw the wall
		fill("#000");
		rect(walls[i][0] * playerW, walls[i][1] * playerH, playerW, playerH);
		
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
                
                //Open the level
                var levelText = client.responseText;
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
				walls.push([j-2,i]);
				
			}
			
			// Check if data is for the goal
			else if (d == "2") {
				
				// Set the goal location
				goalX = j - 2;
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

// Create a function to draw the grid
function drawGrid() {
	
	// Outline
	rect(0,0,width,height);
	
	// For each grid square
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			// Set the background colour
			fill(backgroundColour);
			// Draw the grid square
			rect(i * playerW, j * playerH, playerW, playerH);
		}
		
	}
}

// Selection mode
function selectMode(m) {
	
	// Set the selection mode
	mode = m;
	document.getElementById("mode").innerHTML = ("Current mode: " + mode).toUpperCase();
	
}

// Handle mouse clicks
function mouseReleased() {
    
    // Check that the mouse click is in the grid
    if (!((mouseX >= 0 && mouseX <= width) && (mouseY >= 0 && mouseY <= height))) {

        // Return
        return;

    }

    // Get the x and y
    var x = Math.floor(mouseX / playerW);
    var y = Math.floor(mouseY / playerH);

    // Check the mouse button
    if (mouseButton === LEFT) {
	
		// Check the mode
		switch(mode) {
			
			// Player location
			case "player":
				
				// Check if there is a wall there
				for (var i = walls.length - 1; i >= 0; i--) {
					
					// If there is a wall delete it and break
					if (walls[i][0] == x && walls[i][1] == y) {
						walls.splice(i, 1);
						break;
					}
					
				}
				
				// Set the goal location
				playerX = x;
				playerY = y;
				return
			
			// Wall
			case "wall":
				
				// Check if there is a wall there
				for (var i = walls.length - 1; i >= 0; i--) {
					
					// If there is a wall delete it and return
					if (walls[i][0] == x && walls[i][1] == y) {
						walls.splice(i, 1);
						return;
					}
					
				}
				
				// Create a new wall
				walls.push([x,y]);
				return
			
			// Player location
			case "goal":
				
				// Check if there is a wall there
				for (var i = walls.length - 1; i >= 0; i--) {
					
					// If there is a wall delete it and break
					if (walls[i][0] == x && walls[i][1] == y) {
						walls.splice(i, 1);
						break;
					}
					
				}
				
				// Set the goal location
				goalX = x;
				goalY = y;
				return
			
		}
		
	}
	
}

// Function to test the level
function testLevel() {
    
    // Get the data for the window
    var data = ["0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000x", "0000000000000000"];
    
    // Add the walls to the string (super hacky but works)
    for (var i = 0; i < walls.length; i++) {
        data[walls[i][1]] = data[walls[i][1]].substring(0,[walls[i][0]]) + "1" + data[walls[i][1]].substring(walls[i][0]+1,data[walls[i][0]].length+1);
    }
    
    // Set the goal location
    data[goalY] = data[goalY].substring(0,goalX) + "2" + data[goalY].substring(goalX+1,data[goalY].length+1);
    
    // Set the player location
    data[playerY] = data[playerY].substring(0,playerX) + "3" + data[playerY].substring(playerX+1,data[playerY].length+1);
    
    // Open the new window
    var win = window.open("index.html?ld=" + data.join(""), "_blank");
    win.focus();
    
}