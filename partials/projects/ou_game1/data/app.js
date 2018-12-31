"use strict";

(function() {
    var prevTime = 0;
    var playerX;
    var playerY;
    var playerSpeed;
    var canvas;
    var context;
    var centerX;
    var centerY;
    var playerSize;
    var tps;
    var triangle;
    var deltaX = 0;
    var deltaY = 0;
    var keyW = 0;
    var keyA = 0;
    var keyS = 0;
    var keyD = 0;

    class Triangle {
        constructor() {
            this.x = 0; //centerX;
            this.y = 0; //centerX;
            this.speed = playerSpeed * 0.66;
            this.angle = 0;
            this.size = playerSize / 2.0;
        }

        physics() {
            //optimize this for the love of god
            this.angle = Math.atan2(playerY + playerSize / 2.0 - this.y - this.size / 2, playerX + playerSize / 2.0 - this.x - this.size / 2);
            this.x += this.speed * Math.cos(this.angle) * tps;
            this.y += this.speed * Math.sin(this.angle) * tps;
        }

        draw() {
            context.fillRect(this.x, this.y, this.size, this.size);
        }
    }

    function main() {
        canvas = document.getElementById("gameSurface");
        centerX = canvas.width / 2.0;
        centerY = canvas.height / 2.0;
        playerX = centerX;
        playerY = centerY;
        playerSpeed = canvas.width / 5.0;
        playerSize = canvas.width / 20.0;
        context = canvas.getContext("2d");
	var audio = new Audio("data/knock.mp3");
	audio.play();
        window.requestAnimationFrame(drawFrame);

        triangle = new Triangle();
    }

    function drawFrame() {
        var currTime = window.performance.now();
        tps = (currTime - prevTime) / 1000.0;
        prevTime = currTime;

		var deltaX = 0;
		var deltaY = 0;
		deltaY -= keyW;
		deltaY += keyS;
		deltaX -= keyA;
		deltaX += keyD;
		
        length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (length != 0) {
            deltaX /= length;
            deltaY /= length;

            playerX += deltaX * playerSpeed * tps;
            playerY += deltaY * playerSpeed * tps;
        }

        triangle.physics();

        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = "#000000";
        context.fillRect(playerX, playerY, playerSize, playerSize);

        triangle.draw();

        window.requestAnimationFrame(drawFrame);
    }

    document.addEventListener('keydown', function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                keyD = 1;
				break;
            case 83: //s
                keyS = 1;
				break;
            case 65: //a
                keyA = 1;
				break;
            case 87: //w
                keyW = 1;
        }
    });

    document.addEventListener('keyup', function(event) {
        var keyCode = event.keyCode;
        switch (keyCode) {
            case 68: //d
                keyD = 0;
				break;
            case 83: //s
                keyS = 0;
				break;
            case 65: //a
                keyA = 0;
				break;
            case 87: //w
                keyW = 0;
        }
    });
	
    main();
})();