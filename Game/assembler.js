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

// Function to write to console
function cout(data) {
	
	// Write the data to the console
	cnsl.value += new Date().toUTCString().split(" ")[4] +"\n" + data + "\n\n";
	
	// Scroll the text box
	cnsl.scrollTop = cnsl.scrollHeight;
	
}

// Function to set the operating mode
function op(o) {
	operatingMode = o;	
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