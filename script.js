// Global Variables
var DIRECTION = {
    IDLE: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4
};

// The ball object (The cube that bounces back and forth)
var Ball = {
    new: function (incrementedSpeed) {
        return {
            width: 18,
            height: 18,
            x: (this.canvas.width / 2) - 9,
            y: (this.canvas.height / 2) - 9,
            moveX: DIRECTION.IDLE,
            moveY: DIRECTION.IDLE,
            speed: incrementedSpeed || 7
        };
    },

    update: function (ball, canvas) {
        if (ball.x <= 0) ball.moveX = DIRECTION.RIGHT;
        if (ball.x >= canvas.width - ball.width) ball.moveX = DIRECTION.LEFT;
        if (ball.y <= 0) ball.moveY = DIRECTION.DOWN;
        if (ball.y >= canvas.height - ball.height) ball.moveY = DIRECTION.UP;

        // Move ball in intended direction based on moveY and moveX values
        if (ball.moveY === DIRECTION.UP) ball.y -= (ball.speed);
        else if (ball.moveY === DIRECTION.DOWN) ball.y += (ball.speed);
        if (ball.moveX === DIRECTION.LEFT) ball.x -= ball.speed;
        else if (ball.moveX === DIRECTION.RIGHT) ball.x += ball.speed;
    },

    draw: function (context, ball) {
        context.fillRect(
            ball.x,
            ball.y,
            ball.width,
            ball.height
        );
    }
};

// The padR object (The two lines that move up and down)
var Paddle = {
    new: function (side) {
        return {
            width: 180,
            height: 18,
            x: side === 'left' ? 300 : this.canvas.width / 2 + 300,
            y: (this.canvas.height) - 75,
            score: 0,
            move: DIRECTION.IDLE,
            speed: 8
        };
    },

    update: function (pad) {
        if (pad.move === DIRECTION.LEFT) pad.x -= pad.speed;
        else if (pad.move === DIRECTION.RIGHT) pad.x += pad.speed;
    },

    draw: function (context, pad) {
        context.fillRect(
            pad.x,
            pad.y,
            pad.width,
            pad.height
        );
    }
};

var Game = {
    initialize: function () {
        this.canvas = document.querySelector('canvas');
        this.context = this.canvas.getContext('2d');

        this.canvas.width = 1400;
        this.canvas.height = 1000;

        this.canvas.style.width = (this.canvas.width / 2) + 'px';
        this.canvas.style.height = (this.canvas.height / 2) + 'px';

        this.padL = Paddle.new.call(this, 'left');
        this.padR = Paddle.new.call(this, 'right');

        this.ball1 = Ball.new.call(this);
        this.ball1.moveX = DIRECTION.LEFT
        this.ball1.moveY = DIRECTION.DOWN

        this.ball2 = Ball.new.call(this);
        this.ball2.moveX = DIRECTION.RIGHT
        this.ball2.moveY = DIRECTION.DOWN

        this.running = false;
        this.color = '#8c52ff';

        Pong.listen();
    },

    updateBallPadCollision: function (ball, pad) {
        if (ball.y + ball.height >= pad.y && ball.y <= pad.y + pad.height) {
            if (ball.x <= pad.x + pad.width && ball.x + ball.width >= pad.x) {
                ball.moveY = DIRECTION.UP;
                ball.y = (pad.y - ball.height);
            }
        }
    },

    // Update all objects (move the padL, , ball, increment the score, etc.)
    update: function () {
        if (this.running) {
            // If the ball collides with the bound limits - correct the x and y coords.
            Ball.update(this.ball1, this.canvas)
            Ball.update(this.ball2, this.canvas)

            // Move padL if they padL.move value was updated by a keyboard event
            Paddle.update(this.padL)

            // Move padR if they padR.move value was updated by a keyboard event
            Paddle.update(this.padR)

            // Handle padL-Ball collisions
            this.updateBallPadCollision(this.ball1, this.padL)

            // Handle padR-Ball collisions
            this.updateBallPadCollision(this.ball1, this.padR)

            this.updateBallPadCollision(this.ball2, this.padL)

            this.updateBallPadCollision(this.ball2, this.padR)

        }
    },

    // Draw the objects to the canvas element
    draw: function () {
        // Clear the Canvas
        this.context.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Set the fill style to black
        this.context.fillStyle = this.color;

        // Draw the background
        this.context.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        // Set the fill style to white (For the paddles and the ball)
        this.context.fillStyle = '#ffffff';

        // Draw the padL
        Paddle.draw(this.context, this.padL)

        // Draw the padR
        Paddle.draw(this.context, this.padR)

        // Draw the Ball
        Ball.draw(this.context, this.ball1)
        Ball.draw(this.context, this.ball2)



        // Draw the net (Line in the middle)
        this.context.beginPath();
        this.context.setLineDash([7, 15]);
        this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
        this.context.lineTo((this.canvas.width / 2), 140);
        this.context.lineWidth = 10;
        this.context.strokeStyle = '#ffffff';
        this.context.stroke();

        // Set the default canvas font and align it to the center
        this.context.font = '100px Courier New';
        this.context.textAlign = 'center';

    },

    loop: function () {
        Pong.update();
        Pong.draw();

        // If the game is running, draw the next frame.
        if (Pong.running) requestAnimationFrame(Pong.loop);
    },

    listen: function () {
        document.addEventListener('keydown', function (key) {
            // Handle the 'Press any key to begin' function and start the game.
            if (Pong.running === false) {
                Pong.running = true;
                window.requestAnimationFrame(Pong.loop);
            }

            // Handle up arrow and w key events
            if (key.key === 'a') Pong.padL.move = DIRECTION.LEFT;

            // Handle down arrow and s key events
            if (key.key === 'd') Pong.padL.move = DIRECTION.RIGHT;

            // Handle up arrow and w key events
            if (key.key === 'ArrowLeft') Pong.padR.move = DIRECTION.LEFT;

            // Handle down arrow and s key events
            if (key.key === 'ArrowRight') Pong.padR.move = DIRECTION.RIGHT;
        });

        // Stop the padL from moving when there are no keys being pressed.
        document.addEventListener('keyup', function (key) {
            if (key.key === 'a' || key.key === 'd') Pong.padL.move = DIRECTION.IDLE;
            if (key.key === 'ArrowLeft' || key.key === 'ArrowRight') Pong.padR.move = DIRECTION.IDLE
        });
    },

};

var Pong = Object.assign({}, Game);
Pong.initialize();