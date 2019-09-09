const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
    preload: preload, create: create, update: update
});

// Game variables
let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;
let scoreText;
let score = 0;
let lives = 3;
let livesText;
let lifeLostText;

const initBricks = () => {
    brickInfo = {
        width: 50,
        height: 20,
        count: {
            row: 3,
            col: 7
        },
        offset: {
            top: 50,
            left: 60
        },
        padding: 10
    };
    // Empty group to contain the bricks
    bricks = game.add.group();
    // Loop through rows and columns to create new bricks
    for (c = 0; c < brickInfo.count.col; c++) {
        for (r = 0; r < brickInfo.count.row; r++) {
            const brickX = (c * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            const brickY = (r * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, "brick");
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            newBrick.anchor.set(0.5);
            bricks.add(newBrick);
        }
    }
};

// Callback function used in update function to remove brick when hit by ball
const ballHitBrick = (ball, brick) => {
    const killTween = game.add.tween(brick.scale);
    killTween.to({x:0, y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(() => {
        brick.kill();
    }, this);
    killTween.start();
    
    score += 10;
    scoreText.setText(`Points: ${score}`);

    if (score === brickInfo.count.row * brickInfo.count.col * 10) {
        alert ("You've won the game!");
        location.reload();
    };
};

// Callback function to trigger events when the ball hits the bottom wall
const ballLeaveScreen = () => {
    lives--;
    if (lives) {
        livesText.setText(`Lives: ${lives}`);
        lifeLostText.visible = true;
        ball.reset(game.world.width * 0.5, game.world.height - 25);
        paddle.reset(game.world.width * 0.5, game.world.height - 5);
        game.input.onDown.addOnce(() => {
            lifeLostText.visible = false;
            ball.body.velocity.set(150, -150);
        }, this);
    }
    else {
        alert("You lost, game over!");
        location.reload();
    }
}

// Callback function to call the ball wobble animatio when the ball hits the paddle
const ballHitPaddle = () => ball.animations.play("wobble");

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "rgb(50, 50, 50)";
    game.load.image("ball", "img/ball.png");
    game.load.image("paddle", "img/paddle.png");
    game.load.image("brick", "img/brick.png");
    game.load.spritesheet("ball", "img/wobble.png", 20, 20);
};

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "ball");
    ball.animations.add("wobble", [0,1,0,2,0,1,0,2,0], 24);
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.body.velocity.set(150, -150);

    // Checking whether the ball has hit the bottom wall
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(ballLeaveScreen, this);

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height-5, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

    textStyle = {font: "18px Arial", fill: "#0095DD"};
    // Display score
    scoreText = game.add.text(5, 5, `Points: ${score}`, textStyle);
    // Display lives
    livesText = game.add.text(game.world.width - 5, 5, `Lives: ${lives}`, textStyle);
    livesText.anchor.set(1, 0);
    lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, "Life lost, click to continue", textStyle);
    lifeLostText.anchor.set(0.5);
    lifeLostText.visible = false;
};

function update() {
    game.physics.arcade.collide(ball, paddle, ballHitPaddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    // Sets paddle position to input position (mouse or touch) or defaults to the center
    paddle.x = game.input.x || game.world.width * 0.5;
};