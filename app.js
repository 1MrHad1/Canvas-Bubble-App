var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// Declaring Circle properties
var circleRadius = 30;
var circleSpacing = 20;
var circleColors = ['red', 'green', 'blue', 'orange'];
var circles = [];

// Declaring Arrow properties
var arrowX = canvas.width - circleRadius - 10;
var arrowWidth = 30;
var arrowHeight = 15;
var arrowColor = 'black';
var arrows = [];

// Animation 
var animationSpeed = 2;

// Initialize circles and arrows
for (var i = 0; i < 4; i++) {
    var circle = {
        x: circleRadius + circleSpacing,
        y: (circleRadius * 2 + circleSpacing) * i + circleRadius + circleSpacing,
        color: circleColors[i],
        hit: false
    };
    circles.push(circle);

    var arrow = {
        x: arrowX,
        y: circle.y - arrowHeight / 2,
        hit: false,
        targetX: circle.x,
        targetY: circle.y
    };
    arrows.push(arrow);
}

// Drawing circles and arrows
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circleRadius, 0, 2 * Math.PI);
        ctx.fillStyle = circle.hit ? 'gray' : circle.color;
        ctx.fill();
        ctx.closePath();
    }

    for (var i = 0; i < arrows.length; i++) {
        var arrow = arrows[i];
        ctx.fillStyle = arrowColor;
        ctx.beginPath();
        ctx.moveTo(arrow.x, arrow.y);
        ctx.lineTo(arrow.x - arrowWidth, arrow.y - arrowHeight / 2);
        ctx.lineTo(arrow.x - arrowWidth, arrow.y + arrowHeight / 2);
        ctx.fill();
        ctx.closePath();
    }
}

// Checking if the click is inside the circle.
function handleClick(event) {
    var rect = canvas.getBoundingClientRect();
    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    for (var i = 0; i < circles.length; i++) {
        var circle = circles[i];
        var dx = clickX - circle.x;
        var dy = clickY - circle.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= circleRadius && !circle.hit) {
            circle.hit = true;
            arrows[i].hit = true;
            animateArrow(arrows[i], circle);
            break;
        }
    }

    draw();
}

// Animating  the arrow towards the targeted  circle
function animateArrow(arrow, target) {
    var dx = target.x - arrow.x;
    var dy = target.y - arrow.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    var speedX = (dx / distance) * animationSpeed;
    var speedY = (dy / distance) * animationSpeed;

    function updateArrowPosition() {
        arrow.x += speedX;
        arrow.y += speedY;

        if (arrow.x <= target.x) {
            arrow.hit = false;
            target.hit = false;
            clearInterval(arrowInterval);
        }

        draw();
    }

    var arrowInterval = setInterval(updateArrowPosition, 10);
}

// Reset app
function reset() {
    for (var i = 0; i < circles.length; i++) {
        circles[i].hit = false;
        arrows[i].hit = false;
        arrows[i].x = arrowX;
        arrows[i].y = circles[i].y - arrowHeight / 2;
    }

    draw();
}

canvas.addEventListener('click', handleClick);
draw();