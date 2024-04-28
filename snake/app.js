const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')

vx = 10
vy = 0
foodX = 0
foodY = 0
score = 0
bugDirection = false
stopGame = false
pause = false

let snake = [
	{x: 200, y: 200},
	{x: 190, y: 200},
	{x: 180, y: 200},
	{x: 170, y: 200},
]

function animate() {
	if (stopGame === true) {
		return
	}

	setTimeout(function () {
		bugDirection = false
		if (!pause) {
			clearCanvas()
			drawFood()
			moveSnake()
			drawSnake()
		}
		animate()
	}, 100)
}
animate()
createFood()

function clearCanvas() {
	ctx.fillStyle = 'white'
	ctx.strokeStyle = 'black'
	ctx.fillRect(0, 0, canvas.width, canvas.height)
	ctx.strokeRect(0, 0, canvas.width, canvas.height)
}

function drawSnakePart(snakePart) {
	ctx.fillStyle = 'lightgreen'
	ctx.strokeStyle = 'darkgreen'
	ctx.fillRect(snakePart.x, snakePart.y, 10, 10)
	ctx.strokeRect(snakePart.x, snakePart.y, 10, 10)
}

function moveSnake() {
	const head = {x: snake[0].x + vx, y: snake[0].y + vy}
	snake.unshift(head)

	if (gameOver()) {
		snake.shift(head)
		restart()
		stopGame = true
		return
	}

	const snakeAteFood = snake[0].x === foodX && snake[0].y === foodY

	if (snakeAteFood) {
		score += 10
		document.getElementById('score').innerHTML = score
		createFood()
	} else {
		snake.pop()
	}
}

function drawSnake() {
	snake.forEach((snakePart) => drawSnakePart(snakePart))
}
drawSnake()

function changeDirection(event) {
	if (bugDirection) return
	bugDirection = true

	const LEFT_KEY = 37
	const RIGHT_KEY = 39
	const UP_KEY = 38
	const DOWN_KEY = 40

	const keyPressed = event.keyCode

	const goingUp = vy === -10
	const goingDown = vy === 10
	const goingRight = vx === 10
	const goingLeft = vx === -10

	if (keyPressed === LEFT_KEY && !goingRight) {
		// if (keyPressed === LEFT_KEY) {
		vx = -10
		vy = 0
	}

	if (keyPressed === RIGHT_KEY && !goingLeft) {
		// if (keyPressed === RIGHT_KEY) {
		vx = 10
		vy = 0
	}

	if (keyPressed === UP_KEY && !goingDown) {
		// if (keyPressed === UP_KEY) {
		vx = 0
		vy = -10
	}

	if (keyPressed === DOWN_KEY && !goingUp) {
		// if (keyPressed === DOWN_KEY) {
		vx = 0
		vy = 10
	}
}

function random() {
	return Math.round((Math.random() * 290) / 10) * 10
}

function createFood() {
	foodX = random()
	foodY = random()

	snake.forEach(function (part) {
		const foodIsOnSnake = part.x == foodX && part.y == foodY
		if (foodIsOnSnake) createFood()
	})
}

function drawFood() {
	ctx.fillStyle = 'red'
	ctx.strokeStyle = 'darkred'
	ctx.beginPath()
	ctx.arc(foodX + 5, foodY + 5, 5, 0, 2 * Math.PI)
	ctx.fill()
	ctx.stroke()
}

function gameOver() {
	let snakeWithoutHead = snake.slice(1, -1)
	let bit = false
	snakeWithoutHead.forEach((part) => {
		if (part.x === snake[0].x && part.y === snake[0].y) {
			bit = true
		}
	})

	const hitLeftWall = snake[0].x < -1
	const hitRightWall = snake[0].x > canvas.width - 10
	const hitTopWall = snake[0].y < -1
	const hitBottomWall = snake[0].y > canvas.height - 10

	let endGame = false

	if (bit || hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
		endGame = true
	}

	return endGame
}

function restart() {
	const restart = document.getElementById('restart')
	restart.style.display = 'block'
	const pause = document.getElementById('pause')
	pause.style.display = 'none'
	document.addEventListener('keydown', (e) => {
		if (e.keyCode === 32) {
			document.location.reload()
		}
	})
}

document.addEventListener('keydown', (e) => {
	if (e.keyCode === 32) {
		pause = !pause
	}
})

document.addEventListener('keydown', changeDirection)
