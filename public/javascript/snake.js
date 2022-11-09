var screen;
var snake;
var backgroundColor = "white";

document.addEventListener('DOMContentLoaded', () => {
    screen = document.getElementById("snakeGame").getContext("2d");

    snake = {
        size: 5,
        location:
        {
            x: 0,
            y: 0
        },
        direction: "east"
    }
    x = 0
    drawRect(x, 10, 64, 5, "Black");
    
})

function drawRect(x, y, size, border, colour){
    screen.fillStyle = colour;
    screen.fillRect(x, y, size, size);

    screen.fillStyle = backgroundColor;
    screen.fillRect(x + border, y + border, size - border * 2, size - border * 2);
}

function drawSnake(){
    for (let i = 0; i < snake.size; i++){
        
    }
}