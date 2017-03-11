var collision = require("../collision");
var move8 = require("../input.js").move8;

function Player(canvas, color, blockSize) {
    "use strict";

    this.w = blockSize * 2;
    this.minW = blockSize / 2;
    this.maxW = blockSize * 3;

    // Initial settings
    this.x = canvas.width / 2 - blockSize;
    this.y = canvas.height / 2 - blockSize;
    this.color = color;

    // Movement speed
    this.dx = 4;
    this.dy = 4;

    // Scoring
    this.score = 0;
    this.multiplier = 1;

    this.path = function(x, y) {
        
        var path = new Path2D(),
            halfW = this.w / 2;

        path.rect(x, y, this.w, this.w);
        return path;
    };

    this.shrink = function() {
        this.x += 4;
        this.y += 4;
        this.w -= 8;
    };

    this.grow = function() {
        this.x -= 2;
        this.y -= 2;
        this.w += 4;
    };

    this.multiUpdate = function() {

        if (this.w === 96) {
            this.multiplier = 2;

        } else if (this.w >= 80) {
            this.multiplier = 1.5;

        } else if (this.w >= 64) {
            this.multiplier = 1;

        } else {
            this.multiplier = 0.5;
        }
    };
}

Player.prototype.draw = function(ctx) {

    ctx.fillStyle = this.color;
    ctx.fill(this.path(this.x, this.y));
};

Player.prototype.update = function(keysDown, entities) {

    // Process move
    var snapshot = {
        x: this.x,
        y: this.y
    };

    move8(this, keysDown);

    //Check collision
    entities.forEach((entity) => {
        
        if (entity.statusCode === 0) {
            return;
        }

        if (collision(this, entity)) {

            if (entity.collision === "soft") {

                entity.statusCode = 0;

                this.score += 100 * this.multiplier;

                if (this.w < this.maxW) {
                    this.grow();
                    this.multiUpdate();
                }
                return;
            }

            if (entity.collision === "hard") {

                this.x = snapshot.x;
                this.y = snapshot.y;

                if (this.w > this.minW) {
                    this.shrink();
                    this.multiUpdate();
                }
                return;
            }
        }
    });
};

module.exports = Player;
