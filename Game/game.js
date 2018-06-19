// Store the width and height of the canvas
var width, height;

// Grid variables
var gridSize = 16;
var backgroundColour;

// Player variables
var player, playerX, playerY, playerW, playerH;

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
    
    // Check whether there is a level in the url params
    checkURLData();
	
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

// Function to return a random number within a range
function getRand(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;	
}