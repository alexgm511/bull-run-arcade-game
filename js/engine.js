/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine is available globally via the Engine variable and it also makes
 * the canvas' context (ctx) object globally available to make writing app.js
 * a little simpler to work with.
 */

var Engine = (function(global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
		scoreCanvas = doc.createElement('canvas'),
		ctx2 = scoreCanvas.getContext('2d'),
        lastTime

	canvas.width = 505;
	canvas.height = 606;
	doc.getElementById('gameCanvas').appendChild(canvas);
	doc.getElementById('scoreCircle').appendChild(scoreCanvas);
	scoreCanvas.width = 80;
	scoreCanvas.height = 80;
	

      /* define the runAnimation boolean as an obect
       * so that it can be modified by reference
       */
	var runAnimation = {
		value: true
	};
	// add click listener to canvas
	/*doc.getElementById('gameCanvas').addEventListener('click', function() {
		// flip flag
		runAnimation.value = !runAnimation.value;
		init();
	});*/


    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Constant value that
         * would be the same for everyone -- regardless of how fast their
         * computer is.
         */

		if (runAnimation.value) {
			var now = Date.now(),
				dt = (now - lastTime) / 1000.0;

			/* Call our update/render functions, pass along the time delta to
			 * our update function since it may be used for smooth animation.
			 */
			update(dt);
			render();

			/* Set our lastTime variable which is used to determine the time delta
			 * for the next time this function is called.
			 */
			lastTime = now;

			/* Use the browser's requestAnimationFrame function to call this
			 * function again as soon as the browser is able to draw another frame.
			 */
			win.requestAnimationFrame(main);
		}
    };

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        // checkCollisions();
    }

    /* This is called by the update function  and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to  the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        player.update();
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        var rowImages = [
                //'images/water-block.png',   // Top row is water
				'images/balcony-block.png',   // Top row is water
				'images/wall-block.png',
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/wood-block.png',   // Row 1 of 2 of grass
                //'images/grass-block.png',   // Row 1 of 2 of grass
                //'images/stone-block.png',    // Row 2 of 2 of grass
				'images/door-block.png'
            ],
            numRows = 6,
            numCols = 5,
            row, col, addDoor;

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
				 * Add door on second row for a bit of variety, and the rest wall.
                 */
				if (row === 1 && col === 1) { 
					addDoor = 5 
				} else { 
					addDoor = 0 
				};
                ctx.drawImage(Resources.get(rowImages[row+addDoor]), col * 101, row * 83);
            }
        }

		//drawInstructions();
		
        renderEntities();
    }

    /* This function is called by the render function and is called on each game
     * tick. It's purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
    }

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
		count = 0;
		//showScore(count);
		allEnemies[3].x = -101;
		allEnemies[3].speed = 0;
		player.home();
    }
	
	/* This function puts playing instructions on the top left of the canvas*/
	function drawInstructions() {
		ctx.fillStyle = 'white';
		ctx.fillRect(0,0,300,49);
		ctx.fillStyle = '#999';
		ctx.fillRect(0,0,320,40);
		ctx.strokeColor = '#333';
		ctx.strokeRect(0,0,320,40);
		ctx.fillStyle = 'white';
		ctx.font = '12px sans-serif';
		ctx.textAlign = 'left';
		ctx.fillText('Keyboard arrows move character up, down, left or right.', 5, 15);
		ctx.fillText('Get to the water before getting run over! Esc resets game.', 5, 32);
		
	}

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        //'images/water-block.png',
        'images/wall-block.png',
        'images/door-block.png',
        'images/wood-block.png',
        'images/grass-block.png',
        'images/enemy-bull.png',
        //'images/char-boy.png'
        'images/char-mozo.png',
		'images/balcony-block.png',
		'images/bull-&-mozo.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developer's can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
	global.ctx2 = ctx2;
	global.runAnimation = runAnimation;
	global.doc = doc;
})(this);
