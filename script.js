// DOM elements selectors
const currentScore = document.querySelector(".score-holder"); // Holds the DOM element that displays the score
const gameBoard = document.querySelector('.game-body'); // DOM element representing the game board

// Configuration constants for the game board grid
const numRows = 10;  // Number of rows in the grid
const numCols = 10;  // Number of columns in the grid
const gridColorOne = "#d1d1e9";  // Primary color for the grid
const gridColorTwo = "#fffffe";  // Secondary color for the grid
// Game state variables
let score = 0;  // Player's score
let endGame = false;  // Flag to indicate if the game has ended
let snakePositionX = 5;  // Initial X position of the snake
let snakePositionY = 5;  // Initial Y position of the snake
let velocityX = 0;  // Horizontal velocity of the snake
let velocityY = 0;  // Vertical velocity of the snake
let snakeBodyArr = [];  // Array holding the snake's body parts
let randomPos;
let gameInterval;

// Setting up the grid's CSS grid template
gameBoard.style.gridTemplate = `repeat(${numRows}, 1fr) /  repeat(${numCols}, 1fr)`;


// Create the grid cells and apply initial styling
for (let i = 0; i < numRows; i++) {
	for (let j = 0; j < numCols; j++) {
		const cell = document.createElement('div'); // Creating a new div for each grid cell
		cell.className = "grid-item"; // Assigning class name
		if ((i + j) % 2 === 0) {
			cell.style.backgroundColor = gridColorOne;
		} else {
			cell.style.backgroundColor = gridColorTwo;
		}
		gameBoard.appendChild(cell); // Adding the cell to the game board
	}
}


// Assign unique classes to each grid cell to pick a random cell
const gridDiv = document.querySelectorAll(".grid-item");
for (let i = 0; i < gridDiv.length; i++) {
	gridDiv[i].classList.add(`grid-item-num-${i}`);
}


/**
 * Places food on the game board at a random location not occupied by the snake.
 */
function setFoodLocation() {
	let foodPlaced = false; // Flag to check if food has been placed
	while (!foodPlaced) {
		randomPos = Math.floor(Math.random() * gridDiv.length); // Generating a random position
		const randomGridItem = gridDiv[randomPos]; // Accessing the randomly selected grid cell
		if (!snakeBodyArr.includes(randomGridItem)) { // Ensure the cell is not part of the snake
			gridDiv.forEach((cell, index) => {
					if (cell.style.backgroundColor === "var(--food-color)") { // Setting the food color
						const row = Math.floor(index / numCols);
						const col = index % numCols;
						resetCellColor(cell, row, col); // Resetting the color of all cells
					}
				}
			);
			randomGridItem.style.backgroundColor = "var(--food-color)";
			foodPlaced = true; // Marking the food as placed
		}
	}
}


/**
 * Handles keydown events to change the direction of the snake based on arrow key input.
 * @param {KeyboardEvent} event - When key is pressed, move to that direction.
 */
document.addEventListener("keydown", function (event) {
	if (event.key === "ArrowUp" && velocityY !== 1) {
		velocityX = 0;
		velocityY = -1;
	} else if (event.key === "ArrowDown" && velocityY !== -1) {
		velocityX = 0;
		velocityY = 1;
	} else if (event.key === "ArrowLeft" && velocityX !== 1) {
		velocityX = -1;
		velocityY = 0;
	} else if (event.key === "ArrowRight" && velocityX !== -1) {
		velocityX = 1;
		velocityY = 0;
	}
});


/**
 * Draws the snake on the board by changing the background color of the snake's current position.
 */function drawSnake() {
	const snakeIndex = snakePositionX * numCols + snakePositionY; // Calculating the snake's head position
	gridDiv[snakeIndex].style.backgroundColor = 'var(--snake-color)'; // Setting the snake's color
	snakeBodyArr.push(gridDiv[snakeIndex]); // Adding the new position to the snake's body array
}


/**
 * Resets the background color of a grid cell based on its position in the grid.
 * @param {Element} cell - The grid cell to reset.
 * @param {number} rowIndex - The row index of the cell.
 * @param {number} colIndex - The column index of the cell.
 */
function resetCellColor(cell, rowIndex, colIndex) {
	// Apply color based on position
	if ((rowIndex + colIndex) % 2 === 0) {
		cell.style.backgroundColor = gridColorOne;
	} else {
		cell.style.backgroundColor = gridColorTwo;
	}
}


/**
 * Moves the snake based on its current velocity and updates the game state.
 */
function moveSnake() {
	const headX = snakePositionX + velocityX; // Calculate new head X position
	const headY = snakePositionY + velocityY; // Calculate new head Y position
	const newSnakeIndex = headY * numCols + headX;
	const newHead = gridDiv[newSnakeIndex];
	if (headX < 0 || headX >= numCols || headY < 0 || headY >= numRows || snakeBodyArr.slice(0, -1).includes(newHead)) {
		endGame = true; // End game if a snake hits the boundary or itself
		return;
	}

	if (newHead.style.backgroundColor === "var(--food-color)") {
		snakeBodyArr.unshift(newHead);
		newHead.style.backgroundColor = "var(--snake-color)";
		score++;
		currentScore.textContent = score;
		setFoodLocation();
	} else {
		snakeBodyArr.unshift(newHead);
		const tail = snakeBodyArr.pop();
		const tailIndex = Array.prototype.indexOf.call(gridDiv, tail);
		resetCellColor(tail, Math.floor(tailIndex / numCols), tailIndex % numCols);
		newHead.style.backgroundColor = "var(--snake-color)";
	}

	snakePositionX = headX;
	snakePositionY = headY;
}

/**
 * Main game loop. Controls game timing and state updates.
 */
function gameLoop() {
	if (endGame) {
		alert("Game over"); // Display game over a message
		clearTimeout(gameInterval); // Clear the game interval
		location.reload(); // Reload the page to restart the game
	}

	moveSnake(); // Move the snake
	gameInterval = setTimeout(gameLoop, 200); // Set timeout for the next game loop iteration
}

// Start the game
setFoodLocation(); // Initial placement of food
drawSnake(); // Initial drawing of the snake
gameLoop(); // Start the game loop