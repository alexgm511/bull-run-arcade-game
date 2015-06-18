	// Declare all variables that may be changed in future updates
	// Images are declared here and preloaded in resources.js
	var myEnemySprite = 'images/enemy-bull.png',
		myPlayerSprite = 'images/char-mozo.png',
		myPokedSprite = 'images/bull-&-mozo.png',
		homeX = 0,
		homeY = 5 * 83 - 25,
		count = 0,
		xVal = 0,
		notCollided = true;

	function getLane() {
	    // Use random number from 1 to 3 to assign a lane to enemy
	    // multiply that by lane height and 
	    // last number adjusts enemy to right position on y axis.
	    var lane = Math.floor((Math.random() * 3) + 2) * 83 - 20;
	    return lane;
	}

	// Display "Ole!" and a counter on reaching the right end of the screen.
	// If 0 or less, display "Keep running!"
	function showScore(cnt) {
	    ctx.fillStyle = '#fff';
	    ctx.fillRect(325, 0, 180, 49);
		ctx.fillStyle = '#06f';
		ctx.font = '24px Chewy';
		ctx.textAlign = 'center';

	    if (cnt >= 0) {
	        ctx.fillStyle = '#06f';
	        ctx.fillText('Ole! ' + cnt, 404, 30);
	    } else {
	        ctx.fillStyle = '#06f';
	        ctx.fillText(cnt, 404, 30);
		}
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
		
	    if (pRect.x < eRect.x + eRect.width &&
	        pRect.x + pRect.width > eRect.x &&
	        pRect.y < eRect.y + eRect.height &&
	        pRect.height + pRect.y > eRect.y) {
				// collision detected!
				showScore(count);
				pokeAction(eX, eY, enemy);
				player.x = -101;
	    }
	}
	// At collision -- hide the striking bull and place 
	// pokedSprite at that same position 
	// notCollided variable makes sure it only happens once
	function pokeAction(eX, eY, enemy) {
		if (notCollided) {
			allEnemies[3].x = eX;
			allEnemies[3].y = eY;
			allEnemies[3].speed = enemy.speed;
			enemy.x = -120;
			enemy.mySpeed();
			notCollided = false;
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
	    // Movements are multiplied by the dt parameter
	    // to ensure the game runs at the same speed for
	    // all computers.
		// If player has been hit stop game and show count.
	    if ((this.x > 505) && (this.sprite == myPokedSprite)) {
			runAnimation.value = !runAnimation.value;
	        showScore(count);
		}

	    // If enemy is ouside the canvas send back to beginning, else continue moving
	    if (this.x > 505) {
			this.x = -101;
			//this.y = getLane();
			this.mySpeed(); 
	    } else {
	        collision(player.x + 30, player.y, this.x, this.y, this);
	        this.x += (this.speed * dt);
	    }
	}

	// Draw the enemy on the screen, required method for game
	/* 	Both the Enemy and the Player objects inherit
		the render = function from Sprite superclass */

	// Build out Player subclass
	var Player = function(mySprite, myX, myY) {
	    Sprite.call(this, mySprite, myX, myY);
	};

	Player.prototype = Object.create(Sprite.prototype);
	Player.prototype.constructor = Player;

	// Nothing happens here
	Player.prototype.update = function() {

	}

	// Respond to keyboard input and add score
	var xScore;
	Player.prototype.handleInput = function(key) {
		xScore = 0;
	    switch (key) {
	        case "left":
	            //move left
	            if (this.x > 100)
	                this.x -= 101;
				xScore = 1;
	            break;
	        case "up":
	            //move up
	            if (this.y > 138) {
	                this.y -= 83;
	            } 
				xScore = 1;
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
						count = xVal + count;
						showScore(count);
					}
	            }
				xScore = 1;
	            break;
	        case "down":
	            //move down
	            if (this.y < 354)
	                player.y += 83;
				xScore = 1;
	            break;
	        case "esc":
	            // Escape key resets the game
				runAnimation.value = true;
				doc.location.reload();
	    }
		// Figure score only for valid movement keys
		// player makes more points the further to the left he starts his run
		// Player must stay on street to get higher numbers added to score 
		var newVal;
		if (xScore == 1) {
			if ((this.y > 140) && (this.y < 308)) {
				switch (this.x) {
					case 0:
						newVal = 5;
						break;
					case 101:
						newVal = 4;
						break;
					case 202:
						newVal = 3;
						break;
					case 303:
						newVal = 2;
						break;
					case 404:
						newVal = 1;
						break;
				}
				if (xVal < newVal) {
					xVal = newVal;
				}
			} else {
				xVal = 1;
			}
		}
	}

	// Function that returns player to home base
	Player.prototype.home = function() {
	    this.x = homeX;
	    this.y = homeY;
	}

	// All enemy objects are in an array called allEnemies
	// Player object is in a variable called player

	// There are never more than 3 enemies on the screen
	// So only 3 enemies are needed.
	// fourth one is for when Mozo is poked.

	var enemy1, enemy2, enemy3, poked;
	var allEnemies = [enemy1, enemy2, enemy3, poked];

	for (i = 0; i < 4; i++) {
	    //allEnemies[i] = new Enemy(myEnemySprite, -101, getLane());
		// One bull per lane at different speeds
		if (i === 3) {
			allEnemies[i] = new Enemy(myPokedSprite, -101, 142);
			allEnemies[i].speed = 0;
		} else {
	    allEnemies[i] = new Enemy(myEnemySprite, -101, ((i+2)*83)-24);
	    allEnemies[i].mySpeed();
		}
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
	