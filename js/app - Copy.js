	// Declare all variables that may be changed in future updates
	var myEnemySprite = 'images/enemy-bull.png',
	//var myPlayerSprite = 'images/char-boy.png';
		myPlayerSprite = 'images/char-mozo.png',
		myEnemyHits = 'images/bull-&-mozo.png',
		homeX = 2 * 101,
		homeY = 5 * 83 - 25,
		count = 0,
		notPaused = true;

	function getLane() {
	    // Use random number from 1 to 3 to assign a lane to enemy
	    // multiply that by lane height and 
	    // last number adjusts enemy to right position on y axis.
	    var lane = Math.floor((Math.random() * 3) + 2) * 83 - 20;
	    return lane;
	}

	//Algorithm to detect collision in 2D games from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	function collision(pX, pY, eX, eY, enemy) {
	    //pRect is the player, eRect is the enemy
	    var pRect = {
	        x: pX,
	        y: pY,
	        width: 68,
	        height: 76
	    };
	    var eRect = {
	        x: eX,
	        y: eY,
	        width: 100,
	        height: 68
	    };
		
		var notCollided = true;

	    if (pRect.x < eRect.x + eRect.width &&
	        pRect.x + pRect.width > eRect.x &&
	        pRect.y < eRect.y + eRect.height &&
	        pRect.height + pRect.y > eRect.y &&
			notCollided) {
	        // collision detected!
			splash(count);	
			enemy.sprite = myEnemyHits;
	        player.x = -101;
			notCollided = false;
	    }
	}
	
	// gotHit function that changes the sprite to bull & mozo

	// Display "Splash" and a counter on reaching the water
	// If 0 or less, display "Keep trying!"
	function splash(cnt) {
	    ctx.fillStyle = '#fff';
	    ctx.fillRect(325, 0, 180, 49);
		ctx.fillStyle = '#06f';
		ctx.font = '24px Chewy';
		ctx.textAlign = 'center';

	    if (cnt > 0) {
	        ctx.fillStyle = '#06f';
	        ctx.fillText('Ole! ' + cnt, 404, 30);
	    } else {
	        ctx.fillStyle = '#930';
	        ctx.fillText('Medic!', 404, 30);
		}
	}

	// Start with Sprite superclass with the 3 shared variables:
	// 		the sprite image, and the x and y coordinates
	var Sprite = function(mySprite, myX, myY) {
	    this.sprite = mySprite;
	    this.x = myX;
	    this.y = myY;
	}

	Sprite.prototype.render = function() {
	    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}

	// Enemies our player must avoid
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images

	// Build out the Enemy subclass
	var Enemy = function(mySprite, myX, myY) {
	    Sprite.call(this, mySprite, myX, myY);
	};

	// Create the Enemy prototype to define the Enemy functions
	Enemy.prototype = Object.create(Sprite.prototype);
	Enemy.prototype.constructor = Enemy;


	Enemy.prototype.mySpeed = function() {
	    // Use a random number to assign the lane and speed of enemy
	    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	    this.speed = Math.floor(Math.random() * (600 - 180)) + 180;
	}


	// Update the enemy's position, required method for game
	// Parameter: dt, a time delta between ticks
	Enemy.prototype.update = function(dt) {
	    // You should multiply any movement by the dt parameter
	    // which will ensure the game runs at the same speed for
	    // all computers.
	    // If ouside the canvas send back to beginning, else continue moving

	    if (this.x > 505 + 101) {
			if (this.sprite == myEnemyHits) {
				this.sprite = myEnemySprite;
				notPaused = false;
			} else {
				this.x = -101;
				this.y = getLane();
				this.mySpeed(); // = getSpeed();
			}
	    } else {
	        collision(player.x + 30, player.y, this.x, this.y, this);
	        this.x += (this.speed * dt);
	    }
	}

	// Draw the enemy on the screen, required method for game
	/* 	Both the Enemy and the Player objects inherit
		the render = function from Sprite superclass */

	// Now write your own player class
	// This class requires an update(), render() and
	// a handleInput() method.

	// Build out Player subclass
	var Player = function(mySprite, myX, myY) {
	    Sprite.call(this, mySprite, myX, myY);
	};

	Player.prototype = Object.create(Sprite.prototype);
	Player.prototype.constructor = Player;


	Player.prototype.update = function() {

	}

	Player.prototype.handleInput = function(key) {
	    switch (key) {
	        case "left":
	            //move left
	            if (this.x > 100)
	                this.x -= 101;
	            break;
	        case "up":
	            //move up
	            //if (this.y > 138) {
	            if (this.y > 138) {
	                this.y -= 83;
	            } /*else {
	                // if player reaches water, go back home
	                this.home();
	                // show some response
	                count++;
	                splash(count);
	            } */
	            break;
	        case "right":
	            //move right
	            if (this.x < 403) {
	                this.x += 101;
	            } else {
					if (this.y < 332 && this.y > 113) {
						// if player outruns bulls, go back home
						this.home();
						// show some response
						count++;
						splash(count);
					}
	            }
	            break;
	        case "down":
	            //move down
	            if (this.y < 354)
	                player.y += 83;
	            break;
	        case "esc":
	            // Escape key resets the game
				console.log('hit esc');
	            count = 0;
	            splash(count);
				notPaused = true;
	            //this.home();
				ctx.init();
	    }
	}

	// Function that returns player to home base
	Player.prototype.home = function() {
	    this.x = homeX;
	    this.y = homeY;
	}

	// Now instantiate your objects.
	// Place all enemy objects in an array called allEnemies
	// Place the player object in a variable called player

	// There are never more than 3 enemies on the screen
	// So only 3 enemies are needed.
	var enemy1, enemy2, enemy3;
	var allEnemies = [enemy1, enemy2, enemy3];

	for (i = 0; i < 3; i++) {
	    allEnemies[i] = new Enemy(myEnemySprite, -101, getLane());
	    allEnemies[i].mySpeed();
	}

	var player = new Player(myPlayerSprite, homeX, homeY);


	// This listens for key presses and sends the keys to your
	// Player.handleInput() method. You don't need to modify this.
	document.addEventListener('keyup', function(e) {
	    var allowedKeys = {
	        37: 'left',
	        38: 'up',
	        39: 'right',
	        40: 'down',
	        27: 'esc'
	    };

	    player.handleInput(allowedKeys[e.keyCode]);
	});
	