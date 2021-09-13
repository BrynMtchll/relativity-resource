function snake() {
    let snake = [{x: 200, y: 200}];
    let xFood, yFood;
    let blockSize = 20;
    let dx = blockSize, dy = 0;
    let changedDirection = false;
    let counter = 0;
    let speed = 15;
    
    // Get the canvas element
    const canvas = document.getElementById("snake-canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // Return a two dimensional drawing context
    const ctx = canvas.getContext("2d");
    // Start game
    document.addEventListener("keydown", changeDirection);

    function drawFood() {
      ctx.fillStyle = 'skyblue';
      ctx.strokestyle = 'yellow';
      ctx.fillRect(xFood, yFood, blockSize, blockSize);
      ctx.strokeRect(xFood, yFood, blockSize, blockSize);
    }
    
    // Draw one snake part
    function drawSnakePart(snakePart) {
      ctx.fillStyle = 'purple';
      ctx.strokestyle = 'white';
      ctx.fillRect(snakePart.x, snakePart.y, blockSize, blockSize);
      ctx.strokeRect(snakePart.x, snakePart.y, blockSize, blockSize);
    }

    function gameEnded() {
        let ended = false;
      for (let i = 4; i < snake.length; i++) {
        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) ended = true;
      }
      const hitLeftWall = snake[0].x < 0;
      const hitRightWall = snake[0].x > canvas.width - blockSize;
      const hitToptWall = snake[0].y < 0;
      const hitBottomWall = snake[0].y > canvas.height - blockSize;
      if( hitLeftWall || hitRightWall || hitToptWall || hitBottomWall ) ended = true;

      if (!ended) return;
      snake = [{x: 200, y: 200}];
      speed = 15;
    }

    function genFood() {
        let xMax = canvas.width - blockSize, yMax = canvas.height - blockSize;
        xFood = Math.round((Math.random() * xMax) / blockSize) * blockSize;
        yFood = Math.round((Math.random() * yMax) / blockSize) * blockSize;
        snake.forEach(function has_snake_eaten_food(part) {
            if (part.x == xFood && part.y == yFood) genFood();
        });
    }

    function changeDirection(event) {
      const LEFT_KEY = 65;
      const RIGHT_KEY = 68;
      const UP_KEY = 87;
      const DOWN_KEY = 83;
      
    // Prevent the snake from reversing
        changedDirection = true;
      const keyPressed = event.keyCode;
      const goingUp = dy === -blockSize;
      const goingDown = dy === blockSize;
      const goingRight = dx === blockSize;
      const goingLeft = dx === -blockSize;
      if (keyPressed === LEFT_KEY && !goingRight && !goingLeft) {
        dx = -blockSize;
        dy = 0;
      } else if (keyPressed === UP_KEY && !goingDown && !goingUp) {
        dx = 0;
        dy = -blockSize;
      } else if (keyPressed === RIGHT_KEY && !goingLeft && !goingRight) {
        dx = blockSize;
        dy = 0;
      } else if (keyPressed === DOWN_KEY && !goingUp && !goingDown) {
        dx = 0;
        dy = blockSize;
      } else {
          changedDirection = false;
          return;
      }

      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      snake.unshift(head);
      if (snake[0].x === xFood && snake[0].y === yFood) genFood();
      else snake.pop();    }

    function moveSnake() {
        if (changedDirection){
            changedDirection = false;
            return;
        }
      const head = {x: snake[0].x + dx, y: snake[0].y + dy};
      snake.unshift(head);

      if (snake[0].x === xFood && snake[0].y === yFood) {
        genFood();
        speed -= 1;
        if (speed < 5) speed = 5;
      }
      else snake.pop();
    }
    genFood();

    function updateMeasurements() {
      $("#phone-vx").html((dx/speed).toFixed(2));
      $("#phone-vy").html(-(dy/speed).toFixed(2));
      $("#phone-speed").html((dy/speed).toFixed(2));
      $("#ground-vx").html(((dx/speed)+5).toFixed(2));
      $("#ground-vy").html(-(dy/speed).toFixed(2));
    }

    function animate() {
        gameEnded();
        window.requestAnimationFrame(animate, canvas);

        updateMeasurements();
        if (counter == speed) counter = 0;
        else counter++;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (!counter) {
            // changedDirection = false;
            moveSnake();
        }
        drawFood();
        snake.forEach(drawSnakePart); 
    }
    animate();
}
snake();