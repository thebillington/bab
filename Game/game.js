// Store the width and height of the canvas
var width, height;

// Grid variables
var gridSize = 16;
var backgroundColour;

// Player variables
var player, playerX, playerY, playerW, playerH;

// Store the operating mode
var operatingMode;

// Store a list of valid assembly instructions
var validAssembly = ["MLT", "MRT", "MUP", "MDN", "STP", "BLP", "ELP"];

// Store the binary to assembly and denary
var binToA = {"0000":"MLT", "0001":"MRT", "0010":"MUP", "0011":"MDN", "0100":"STP", "0101":"BLP", "0110":"ELP"}
var binToD = {"0000":0, "0001":1, "0010":2, "0011":3, "0100":4, "0101":5, "0110":6, "0111":7, "1000":8, "1001":9, "1010":10, "1011":11, "1100":12, "1101":13, "1110":14, "1111":15}

// Store valid hex
var validHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];

// Store the hex to assembly and denary
var hexToA = {"0":"MLT", "1":"MRT", "2":"MUP", "3":"MDN", "4":"STP", "5":"BLP", "6":"ELP"}
var hexToD = {"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15}

// Store the executable version of the code
var executable;

// Get the console window
var cnsl;

// Create a stack to hold the loops
var lStackPointer;
var lStack;

// Hold the timer
var timer;

// Create a variable to do a semantic check on loops
var openLoops;

// Variable to hold the location of the goal
var goalX;
var goalY;

// Variable to hold the walls
var walls;

// Create the timer variable
var delay = 1000;

// Setup function run first
function setup() {
	
	// Set the width and height
	width = 550;
	height = 650;
	
	// Set up dimensions of the player and the grids
	reset();
	playerW = width / gridSize;
	playerH = height / gridSize;
	
	// Create the canvas
	var cnv = createCanvas(width, height);
	cnv.parent("cnv");
	
	// Get the main character image
	player = loadImage("knack.png");
	
	// Set the default operating mode
	operatingMode = "binary";
	executable = "";
	
	// Get the console
	cnsl = document.getElementById("console");
	
	// Set the background colour
	backgroundColour = "#FFF";
	
	// Create an empty list of walls
	walls = [];
	
	// Load the level
	openLevel("levelOne.txt");
	
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

// Function to reset
function reset() {
	
	// Reset the x and y locations
	playerX = 0;
	playerY = 0;
	
	// Setup the loop stack
	lStackPointer = -1;
	lStack = [];
	
	// Cancel the next event timer
	clearTimeout(timer);
	
	// Reset the background colour
	backgroundColour = "#FFF";
	
}

// Function to set the speed
function speed() {
	
	// Set the execution speed
	delay = parseInt(document.getElementById("speed").value);
	
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

// Function to write to console
function cout(data) {
	
	// Write the data to the console
	cnsl.value += new Date().toUTCString().split(" ")[4] +"\n" + data + "\n\n";
	
	// Scroll the text box
	cnsl.scrollTop = cnsl.scrollHeight;
	
}

// Function to check that code is valid
function assemble() {
	
	// Get the code to execute
	c = document.getElementById("code").value.split("\n");
	
	// Create the assembled code
	assembled = [];
	output = "";
	
	// Set the number of open loops to zero
	openLoops = 0;
	
	// Check the operating mode
	if (operatingMode == "binary") {
	
		// Look at each line of code
		for (var i = 0; i < c.length; i++) {
			
			// Get the current item to check and replace spaces
			var instruction = c[i].replace(" ", "");
			
			// Check if the instruction is empty
			if (instruction == "") {
				continue;
			}
			
			// Check the length is correct
			if (instruction.length != 8) {
				cout("ERROR ON LINE " + (i + 1) + ": Operations must be composed of 8 bits!");
				document.getElementById("code").style.backgroundColor = "#FF6961";
				document.getElementById("assembled").value = output;
				return false;
			}
			
			// Check that it is composed of binary digits
			for (var j = 0; j < 8; j++) {
				if (instruction[j] != "0" && instruction[j] != "1") {
					cout("ERROR ON LINE " + (i + 1) + ": " + c[i] + " is not a valid 8 bit number!");
					document.getElementById("code").style.backgroundColor = "#FF6961";
					document.getElementById("assembled").value = output;
					return false;
				}
			}
			
			// Code is valid, insert into the assembled code
			assembled.push([binToA[instruction.substring(0,4)], binToD[instruction.substring(4,instruction.length)]]);
			output += binToA[instruction.substring(0,4)];
			if (binToA[instruction.substring(0,4)] == "ELP" || binToA[instruction.substring(0,4)] == "STP") {
				output += "\n";
			}
			else {
				output  += " " + binToD[instruction.substring(4,instruction.length)] + "\n";
			}
			
			// Check if the instruction is to open a loop
			if (binToA[instruction.substring(0,4)] == "BLP") {
				openLoops++;
			}
			
			// Check if the instruction is to close a loop
			if (binToA[instruction.substring(0,4)] == "ELP") {
				openLoops--;
			}
		}
		
	}
	if (operatingMode == "hex") {
	
		// Look at each line of code
		for (var i = 0; i < c.length; i++) {
			
			// Get the current item to check and replace spaces
			var instruction = c[i].replace(" ", "");
			
			// Check if the instruction is empty
			if (instruction == "") {
				continue;
			}
			
			// Check the length is correct
			if (instruction.length != 2) {
				cout("ERROR ON LINE " + (i + 1) + ": Operations must be composed of 2 hex digits!");
				document.getElementById("code").style.backgroundColor = "#FF6961";
				document.getElementById("assembled").value = output;
				return false;
			}
			
			// Check that it is composed of valid hex digits
			for (var j = 0; j < 2; j++) {
				if (validHex.indexOf(instruction[j]) == -1) {
					cout("ERROR ON LINE " + (i + 1) + ": " + instruction + " is not a valid hex number!");
					document.getElementById("code").style.backgroundColor = "#FF6961";
					document.getElementById("assembled").value = output;
					return false;
				}
			}
			
			// Code is valid, insert into the assembled code
			assembled.push([hexToA[instruction[0]], hexToD[instruction[1]]]);
			output += hexToA[instruction[0]];
			if (hexToA[instruction[0]] == "ELP" || hexToA[instruction[0]] == "STP") {
				output += "\n";
			}
			else {
				output += " " + hexToD[instruction[1]] + "\n";
			}
			
			// Check if this is an open loop
			if (hexToA[instruction[0]] == "BLP") {
				openLoops++;
			}
			
			// Check if it a closed loop
			if (hexToA[instruction[0]] == "ELP") {
				openLoops--;
			}
		}
		
	}
	if (operatingMode == "assembly") {
	
		// Look at each line of code
		for (var i = 0; i < c.length; i++) {
			
			// Get the current item to check and replace spaces
			var instruction = c[i].replace(" ", "");
			
			// Check if the instruction is empty
			if (instruction == "") {
				continue;
			}
			
			// Check whether the instruction doesn't require a length check
			if (instruction.substring(0,3) != "ELP" && instruction.substring(0,3) != "STP") {
			
				// Check the length is correct
				if (instruction.length != 4) {
					cout("ERROR ON LINE " + (i + 1) + ": " + c[i] + " is not valid machine code!");
					document.getElementById("code").style.backgroundColor = "#FF6961";
					document.getElementById("assembled").value = output;
					return false;
				}
				
				// Check that it is composed of valid assembly code
				if (validAssembly.indexOf(instruction.substring(0,3)) == -1) {
					cout("ERROR ON LINE " + (i + 1) + ": " + instruction.substring(0,3) + " is not a valid opcode!");
					document.getElementById("code").style.backgroundColor = "#FF6961";
					document.getElementById("assembled").value = output;
					return false;
				}
				
				// Check that the opcode is a valid hex number
				if (validHex.indexOf(instruction.substring(3,instruction.length)) == -1) {
					cout("ERROR ON LINE " + (i + 1) + ": " + instruction.substring(3,instruction.length) + " is not a valid hex operand!");
					document.getElementById("code").style.backgroundColor = "#FF6961";
					document.getElementById("assembled").value = output;
					return false;
				}
			}
			
			// Code is valid, insert into the assembled code
			assembled.push([instruction.substring(0,3), hexToD[instruction.substring(3,instruction.length)]]);
			output += c[i].substring(0,3);
			if (instruction.substring(0,3) == "ELP" || instruction.substring(0,3) == "STP") {
				output += "\n";
			}
			else {
				output  += " " + hexToD[instruction.substring(3,instruction.length)] + "\n";
			}
			
			// Check if this is an open loop
			if (instruction.substring(0,3) == "BLP") {
				openLoops++;
			}
			
			// Check if this is a close loop
			if (instruction.substring(0,3) == "ELP") {
				openLoops--;
			}
		}
	}
	
	// Set the assembled output
	document.getElementById("assembled").value = output;
	
	// Check if there are unopen or unclosed loops
	if (openLoops > 0) {
		cout("LOOP ERROR: You have not closed all of your open loops. Ensure you use 'ELP' to end all opened loops!");
		document.getElementById("code").style.backgroundColor = "#FF6961";
		return false;
	}
	if (openLoops < 0) {
		cout("LOOP ERROR: You have closed a loop that was never opened. Ensure you use 'BLP' to open a loop!");
		document.getElementById("code").style.backgroundColor = "#FF6961";
		return false;
	}
	
	// Success message
	cout("Code was assembled successfully!");
	executable = assembled;
	document.getElementById("code").style.backgroundColor = "#77DD77";
	return true;
	
}

// Create a function to execute the code
function execute(n) {
	
	// Clear any existing timers
	clearTimeout(timer);
	
	// Get the executable
	var c = executable;
	if (c == []) {
		cout("No compiled code to execute...");
		return;
	}
	
	// Check if this is the last command
	if (n == executable.length) {
		cout("Execution completed...");
		return;
	}

	// Get the opcode and operand for current instruction
	var opcode = c[n][0];
	var operand = c[n][1];
	
	// Check empty line
	if (opcode == "") {
		
		// Execute next line
		execute(n+1);
		
	}
		
	// Check the command for movement
	if (opcode == "MLT") {
		move([-1,0], operand, n+1);
	}
	else if (opcode == "MRT") {
		move([1,0], operand, n+1);
	}
	else if (opcode == "MUP") {
		move([0,-1], operand, n+1);
	}
	else if (opcode == "MDN") {
		move([0,1], operand, n+1);
	}
	
	// Check if this is the top of a loop
	else if (opcode == "BLP") {
		
		// Push the loop to the loop stack
		lStack.push([operand, n]);
		lStackPointer++;
		
		// Operate the next instruction
		execute(n+1);
		
	}
	
	// Check if this is the end of a loop
	else if (opcode == "ELP") {
		
		// Check if the loop has been run the correct amount of times
		if (lStack[lStackPointer][0] == 1) {
			
			// Pop from the stack and run the next instruction
			lStack.pop();
			lStackPointer--;
			execute(n+1);
			
		}
		// Otherwise run the top loop from the stack
		else {
			
			// Execute the top of the loop
			execute(lStack[lStackPointer][1] + 1);
			
			// Take one from the remaining executions
			lStack[lStackPointer][0]--;
			
		}
		
	}
	
}

// Function to move the player
function move(direction, amount, next) {
	
	// Check if the amount has hit 0
	if (amount <= 0) {
		timer = setTimeout(function() {execute(next)}, delay);
		return;
	}
	
	// Move the player
	playerX += direction[0];
	playerY += direction[1];
	
	// Take one from amount
	amount--;
	
	// Check if the player is at the goal
	if (playerX == goalX && playerY == goalY) {
		
		// Win message
		cout("Congratulations, you reached the goal!");
		
		// Reset
		reset();
		return;
		
	}
	
	// Check if we have gone off screen
	if (playerX < 0) {
		playerX = 0;
		crash();
		cout("CRASH: Player has gone off the left side of the grid...");
		return;
	}
	if (playerX == gridSize) {
		playerX = gridSize - 1;
		crash();
		cout("CRASH: Player has gone off the right side of the grid...");
		return;
	}
	if (playerY < 0) {
		playerY = 0;
		crash();
		cout("CRASH: Player has gone off the top of the grid...");
		return;
	}
	if (playerY == gridSize) {
		playerY = gridSize - 1;
		crash();
		cout("CRASH: Player has gone off the bottom of the grid...");
		return;
	}
	
	// Check for wall collisions
	if (wallCollision()) {
		// Move back
		playerX -= direction[0];
		playerY -= direction[1];
		// Crash
		crash();
		cout("CRASH: Player has collided with a wall...");
		return;
	}
	
	// Set a timeout to move again
	timer = setTimeout(function() {move(direction,amount,next)}, delay);
}

// Function to check for collisions with the wall
function wallCollision() {

	// Check whether the player has collided with the walls
	for (var i = 0; i < walls.length; i++) {
		if (playerX == walls[i][0] && playerY == walls[i][1]) {
			return true;
		}
	}
	return false;

}

// Function to crash the program
function crash() {
	
	// Set the canvas colour
	backgroundColour = "#FF6961";
	
}

// Function to set the operating mode
function op(o) {
	operatingMode = o;	
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

// Function to clear style when user clicks in the editor
function edit() {
	document.getElementById("code").style.backgroundColor = "#FFF";
	backgroundColour = "#FFF";
	
	// If hex editor clear the output window
	if (operatingMode == "assembly") {
		document.getElementById("assembled").value = "";
	}
}

// Function to clear the console
function clearConsole() {
	cnsl.value = "";
}

// Function to return a random number within a range
function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;	
}