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

// Function to draw the walls
function drawWalls() {
	
	// For each wall, draw it
	for (var i = 0; i < walls.length; i++) {
		
		// Draw the wall
		fill("#000");
		rect(walls[i][0] * playerW, walls[i][1] * playerH, playerW, playerH);
		
	}
	
}