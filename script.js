/*****************************
 * snake.js - canvas version *
 *****************************/

// once window is ready
function windowReady() {
	// canvas params
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');
	var w = canvas.width;
	var h = canvas.height;

	// lets save the cell width in a variable for easy control
	var cellWidth = 10;

	// direction
	var d;
	var food;
	var snakeStartLength = 5;
	var score;

	// an array of cells to make up the snake
	var snake_array;

	// start it up
	init();

	function init() {
		// default direction
		d = "right";

		// lets create the snake now
		create_snake();

		// now we can see the food particle
		create_food();

		// finally lets display the score
		score = 0;

		// lets move the snake now using a timer which will trigger the paint function
		// every 60ms
		if(typeof game_loop != "undefined") {
			clearInterval(game_loop);
		}

		// set game loop of paint
		game_loop = setInterval(paint, 90);
	}

	function create_snake() {
		// empty array to start with
		snake_array = [];
		// loop through the initial snake length, and add that to the snake array
		for(var i = snakeStartLength - 1; i >= 0; i--) {
			// this will create a horizontal snake starting from the top left
			snake_array.push({
				x: i,
				y: 0
			});
		}
	}

	// lets create the food now
	function create_food() {
		// this will create a cell with x/y between 0-44
		// because there are 45(450/10) positions accross the rows and columns
		food = {
			x: Math.round(Math.random() * (w - cellWidth) / cellWidth),
			y: Math.round(Math.random() * (h - cellWidth) / cellWidth),
		};
	}

	// lets paint the snake now
	function paint() {
		// to avoid the snake trail we need to paint the BG on every frame
		// lets paint the canvas now
		ctx.fillStyle = "#f9f9f9";
		ctx.fillRect(0, 0, w, h);

		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		// the movement code for the snake to come here.
		// the logic is simple
		// pop out the tail cell and place it infront of the head cell
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;

		// these were the position of the head cell.
		// we will increment it to get the new head position
		// lets add proper direction based movement now
		if(d == "right") {
			nx++;
		} else if(d == "left") {
			nx--;
		} else if(d == "up") {
			ny--;
		} else if(d == "down") {
			ny++;
		}

		// lets add the game over clauses now
		// this will restart the game if the snake hits the wall
		// lets add the code for body collision
		// now if the head of the snake bumps into its body, the game will restart
		if(nx == -1 || nx == w / cellWidth || ny == -1 || ny == h / cellWidth || check_collision(nx, ny, snake_array)) {
			// restart game
			init();

			// lets organize the code a bit now.
			return;
		}

		// lets write the code to make the snake eat the food
		// the logic is simple
		// if the new head position matches with that of the food,
		// create a new head instead of moving the tail
		if(nx == food.x && ny == food.y) {
			var tail = {
				x: nx,
				y: ny
			};
			score++;

			// create new food
			create_food();
		} else {
			// pops out the last cell
			var tail = snake_array.pop();
			tail.x = nx;
			tail.y = ny;
		}

		// the snake can now eat the food.
		snake_array.unshift(tail); //puts back the tail as the first cell

		for(var i = 0; i < snake_array.length; i++) {
			var c = snake_array[i];
			// lets paint 10px wide cells
			paint_cell(c.x, c.y, 'blue');
		}

		// paint the food
		paint_cell(food.x, food.y, 'red');

		// paint the score
		var score_text = 'Score: ' + score;
		ctx.fillText(score_text, 5, h - 5);
	}

	// a generic function to paint cells
	function paint_cell(x, y, color) {
		ctx.fillStyle = color;
		ctx.fillRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);

		ctx.strokeStyle = "white";
		ctx.strokeRect(x * cellWidth, y * cellWidth, cellWidth, cellWidth);
	}

	function check_collision(x, y, array) {
		// this function will check if the provided x/y coordinates exist
		// in an array of cells or not
		for(var i = 0; i < array.length; i++) {
			if(array[i].x == x && array[i].y == y) {

				return true;
			}
		}

		return false;
	}

	// lets add the keyboard controls now
	document.onkeydown = function(e) {
		// get key pressed
		var key = e.which;

		// we will add another clause to prevent reverse gear
		if(key == "37" && d != "right") {
			d = "left";
		} else if(key == "38" && d != "down") {
			d = "up";
		} else if(key == "39" && d != "left") {
			d = "right";
		} else if(key == "40" && d != "up") {
			d = "down";
		}

		// the snake is now keyboard controllable!
	}

}

// on window ready checker
function onReady(fn) {
	// are we still waiting?
	if (document.readyState != 'loading'){
		// retry
		fn();
	} else {
		// dom content has loaded
		document.addEventListener('DOMContentLoaded', fn);
	}
}

// check are we ready?
onReady(windowReady);
