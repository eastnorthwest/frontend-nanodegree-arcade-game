// begin script

var allEnemies = [];

// Enemies our player must avoid
var Enemy = function(yPosition) {
  yPosition = (yPosition) ? yPosition : 1;

  // X start
  const XSTART = -200;
  this.getXStart = function () {
    return XSTART;
  }

  this.sprite = 'images/enemy-bug.png';
  this.x = XSTART ; // initial x position
  this.y = 60 + (82 * (yPosition - 1)); // y position
  this.speed = 0; // speed of enemy
  this.waitForStart = null; // timer for wait
};

// generate a new speed
Enemy.prototype.getSpeed = function()
{
  return parseInt((Math.random() * 125) + 50);
}

// generate a wait time
Enemy.prototype.getStartWait = function()
{
  return parseInt(Math.random() * 5);
}

// reset position and wait timer
Enemy.prototype.resetPosition = function()
{
  this.x = this.getXStart();
  this.speed = this.getSpeed();
  this.waitForStart = null;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if (this.stop) {return false}
  if (this.x > 700) {
    if (!this.waitForStart)  {
        var waitTime = this.getStartWait();
        //console.log("Waiting ... " + waitTime);
        this.waitForStart = setTimeout(this.resetPosition.bind(this), waitTime);
    }
  } else {
    this.x += (this.speed * dt);
  }
  //console.log(this.x, this.speed)
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var Player = function() {

  // X start
  const XSTART = 202;
  this.getXStart = function () {
    return XSTART;
  }

  // Y start
  const YSTART = 390;
  this.getYStart = function () {
    return YSTART;
  }

  // safe zone
  const SAFEZONE = 50;
  this.getSafeZone = function () {
    return SAFEZONE;
  }

  // bug X zone
  const BUGXZONE = 85;
  this.getBugXZone = function () {
    return BUGXZONE;
  }

  // bug Y zone
  const BUGYZONE = 10;
  this.getBugYZone = function () {
    return BUGYZONE;
  }

  // check boundaries
  const LEFTBOUNDARY = 0, RIGHTBOUNDARY = 404,
        UPBOUNDARY = 0, DOWNBOUNDARY = 390;
  this.getBoundary = function (direction) {
    switch (direction)
    {
      case "up":
        return UPBOUNDARY;

      case "down":
        return DOWNBOUNDARY;

      case "left":
        return LEFTBOUNDARY;

      case "right":
        return RIGHTBOUNDARY;
    }
  }

  // set movement
  const MOVELEFTRIGHT = 101, MOVEUPDOWN = 80;
  this.movePlayer = function (direction) {
    switch (direction)
    {
      case "up":
      case "down":
        return MOVEUPDOWN;

      case "left":
      case "right":
        return MOVELEFTRIGHT;
    }
  }

  // collision message
  const COLLISIONMESSAGE = "You were devoured by the BUGS!!";
  this.getCollisionMessage = function()
  {
    return COLLISIONMESSAGE;
  }

  // success message
  const SUCCESSMESSAGE = "You arrived .. umm .. 'safe' in the WATER!!";
  this.getSuccessMessage = function()
  {
    return SUCCESSMESSAGE;
  }

  this.sprite = 'images/char-boy.png';
  this.x = XSTART ; // initial x position
  this.y = YSTART; // y position
  this.message = ""; // placeholder for success/collision
  this.realMessage = ""; // actual message
  this.setupMessageTimer = null; // timer for message setup
  this.showMessageTimer = null; // timer for message
};

// player update
Player.prototype.update = function()
{
  // check for collision or success
  this.message = this.checkForCollision() || this.checkForSafe();
  //console.log(this.setupMessageTimer, this.message);
  if (!this.setupMessageTimer && this.message)
  {
    this.realMessage = this.message;
    this.setupMessageTimer = setTimeout(this.resetPosition.bind(this), 500)
    setTimeout(this.showMessage.bind(this), 1000)
  }
}

// show message
Player.prototype.showMessage = function()
{
  document.getElementById("message").innerHTML=this.realMessage;
  if (this.showMessageTimer) {
    clearTimeout(this.showMessageTimer);
    this.showMessageTimer = null;
  }
  this.showMessageTimer = setTimeout(function()
  {
    document.getElementById("message").innerHTML="&nbsp;";
  }, 4000)
  this.realMessage = "";
}

Player.prototype.checkForCollision = function()
{
  var result = false;
  for (var idx = 0; idx < allEnemies.length; idx ++ )
  {
    if (result) {continue;}
    var enemy = allEnemies[idx];
    var xZone = this.x - enemy.x;
    var yZone = this.y - enemy.y;
    if
    (
        (xZone > -(this.getBugXZone())) && (xZone < this.getBugXZone())
        &&
        (yZone > 0) && (yZone <= this.getBugYZone())
    ) {
      result = this.getCollisionMessage();
    }
  }
  return result;
}

Player.prototype.checkForSafe = function()
{
  var result = false;
  if (this.y <= this.getSafeZone())
  {
    result = this.getSuccessMessage();
  }
  return result;
}

// reset position
Player.prototype.resetPosition = function()
{
  this.x = this.getXStart();
  this.y = this.getYStart();
  this.setupMessageTimer = null;
}

// Draw the enemy on the screen, required method for game
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// handle player movement
Player.prototype.handleInput = function(keyCode)
{
  switch (keyCode)
  {
    case "up":
      this.y -= (this.y > this.getBoundary("up")) ? this.movePlayer("up") : 0;
      break;

    case "down":
      this.y += (this.y < this.getBoundary("down")) ? this.movePlayer("down") : 0;
      break;

    case "left":
      this.x -= (this.x > this.getBoundary("left")) ? this.movePlayer("left") : 0;
      break;

    case "right":
      this.x += (this.x < this.getBoundary("right")) ? this.movePlayer("right") : 0;
      break;

    default:
      //console.log("Invalid key!")
  }
}

for (var idx = 1; idx <= 3; idx ++)
{
  var enemy = new Enemy(idx);
  enemy.speed = enemy.getSpeed();
  allEnemies.push(enemy);
}

var player = new Player();

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down',
  };
  player.handleInput(allowedKeys[e.keyCode]);
});


