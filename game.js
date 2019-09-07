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
    brick.kill();
    score += 10;
    scoreText.setText(`Points: ${score}`);

    let count_alive = 0;
    for (let i = 0; i < bricks.children.length; i++) {
        if (bricks.children[i].alive === true) {
            count_alive++;
        }
    }
    if (count_alive === 0) {
        alert(`You've won the game with ${score} points!`);
        location.reload();
    }
}

function preload() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "rgb(50, 50, 50)";
    game.load.image("ball", "img/ball.png");
    game.load.image("paddle", "img/paddle.png");
    game.load.image("brick", "img/brick.png");
};

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, "ball");
    ball.anchor.set(0.5);
    game.physics.enable(ball, Phaser.Physics.ARCADE);
    ball.body.collideWorldBounds = true;
    ball.body.bounce.set(1);
    ball.body.velocity.set(150, -150);

    // Checking whether the ball has hit the bottom wall
    game.physics.arcade.checkCollision.down = false;
    ball.checkWorldBounds = true;
    ball.events.onOutOfBounds.add(function() {
        alert("Game over!");
        location.reload();
    }, console.log(this));

    paddle = game.add.sprite(game.world.width * 0.5, game.world.height-5, "paddle");
    paddle.anchor.set(0.5, 1);
    game.physics.enable(paddle, Phaser.Physics.ARCADE);
    paddle.body.immovable = true;

    initBricks();

    scoreText = game.add.text(5, 5, `Points: ${score}`, {font: "18px Arial", fill: "#0095DD"});
};

function update() {
    game.physics.arcade.collide(ball, paddle);
    game.physics.arcade.collide(ball, bricks, ballHitBrick);
    // Sets paddle position to input position (mouse or touch) or defaults to the center
    paddle.x = game.input.x || game.world.width * 0.5;
};