var canvas          = require("../canvas");
var Background      = require("./background");
var Cursor          = require("./cursor");
var Confirmation    = require("./confirmation");
var controls        = require("../controls");

function Menu(fontSize, colors, selections, mainTitle) {
    "use strict";

    this.menuState = "mainmenu";
    this.mainTitle = mainTitle || null;
    this.sceneLoaderHook = null;

    // Styling
    this.fontSize = fontSize;
    this.font = fontSize + "px monospace";
    this.lineHeight = Math.floor(fontSize * 1.2);
    this.colors = colors;

    // Positioning: Default
    this.menuX = canvas.width / 2;
    this.menuY = canvas.height / 2 + this.lineHeight;

    // Content
    this.selections = selections;
    this.background = new Background(canvas, this.colors.background);

    this.cursorData = {
        x: this.menuX,
        y: this.menuY - 24,
        w: 24
    };

    if (mainTitle) {
        this.mainTitle.init(canvas);

        // menu adjusments
        this.menuX = this.mainTitle.textX;
        this.cursorData.x = this.menuX - 40;
    }

    this.cursor = new Cursor(this);
}

Menu.prototype.mainConfirm = function() {

    this.confirmation = new Confirmation(() => {
        delete this.confirmation;
        this.select(this.cursor.i);
    }, " to confirm selection ");
};

Menu.prototype.init = function(f) {
    this.sceneLoaderHook = f;
    this.mainConfirm();
};

Menu.prototype.draw = function(ctx) {

    this.background.draw(ctx);

    switch (this.menuState) {
        case "mainmenu":
            ctx.fillStyle = this.colors.selections;
            ctx.font = this.font;
            
            this.selections.forEach((selection, i) => {
                ctx.fillText(selection, this.menuX,
                        this.menuY + this.lineHeight * i);
            });

            if (this.mainTitle) {
                this.mainTitle.draw(ctx);
            }

            this.cursor.draw(ctx);
            break;

        case "controls":
            // controls
            controls.draw();
            break;

        case "leaderboards":
            // leaderboards
            break;

        case "credits":
            // credits
            break;

        default:
            // no default
    }

    if (this.confirmation) {
        this.confirmation.draw();
    }
};

Menu.prototype.update = function(keysDown, delta) {

    if (this.menuState === "mainmenu") {
        this.cursor.update(keysDown, delta);
    }

    if (this.confirmation) {
        this.confirmation.update(keysDown);
    }
};

Menu.prototype.select = function(i) {

    switch (this.selections[i]) {
        case "new game":
            // Launch new game at level 1
            this.sceneLoaderHook(i);
            break;

        case "leaderboards":
            // Display Hi Scores for each level
            console.log("leaderboards selected");
            break;

        case "controls":
            this.menuState = "controls";

            this.confirmation = new Confirmation(() => {
                delete this.confirmation;

                this.menuState = "mainmenu";
                this.mainConfirm();
            }, " to return ");
            break;

        case "credits":
            // Choose a level to start at
            console.log("credits selected");
            break;

        default:
            // Do nothing
    }
};

module.exports = Menu;
