let c = document.getElementById('canvas')
let ctx = c.getContext('2d')

let gameOn = false
let spacePressed = false

let score = 0

let img_bird = new Image()
img_bird.src = './duck.png'

let img_bg = new Image()
img_bg.src = './bg.png'

let img_pb = new Image()
img_pb.src = './pipe_bottom.png'

let img_pt = new Image()
img_pt.src = './pipe_top.png'
img_pt.onload = () => {
	ctx.drawImage(img_bg, 0, 0)
	ctx.save()
	ctx.translate(duck.x + 48, duck.y + 48)
	ctx.rotate(duck.accY / 10)
	ctx.drawImage(img_bird, -48, -48)
	ctx.restore()
}

let alive = true
let duck = {
	x: 192,
	y: 400,
	accY: 0,
}
let pipe1 = {
	x: 960,
	y: Math.floor(Math.random() * 330) + 50,
}
let pipe2 = {
	x: 1440,
	y: Math.floor(Math.random() * 330) + 50,
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousedown', function(event) {
	if (gameOn == false) {
		gameOn = true
		setInterval(main, 5)
	}
	if (alive == true) {
		duck.accY = -5
	}
})

function keyDownHandler(e) {
	console.log(e.keyCode)
	if (e.keyCode == 32 && alive == true) {
		spacePressed = true
		if (gameOn == false) {
			gameOn = true
			setInterval(main, 5)
		}
	}
}
function keyUpHandler(e) {
	if (e.keyCode == 32) {
		spacePressed = false
	}
}

function main() {
	//Game Calculations

	duck.accY += 0.1
	duck.y += duck.accY

	if (spacePressed == true) {
		duck.accY = -5
		spacePressed = false
	}

	if (alive == true) {
		pipe1.x -= 2
		pipe2.x -= 2
	}
	

	if (pipe1.x <= -88) {
		pipe1.x = 960
		pipe1.y = Math.floor(Math.random() * 330) + 50
		score += 1
	}
	if (pipe2.x <= -88) {
		pipe2.x = 960
		pipe2.y = Math.floor(Math.random() * 330) + 50
		score += 1
	}

	if (
		duck.x + 96 >= pipe1.x && duck.x <= pipe1.x + 88 && duck.y + 96 >= pipe1.y + 270 ||
		duck.x + 96 >= pipe1.x && duck.x <= pipe1.x + 88 && duck.y <= pipe1.y ||
		duck.x + 96 >= pipe2.x && duck.x <= pipe2.x + 88 && duck.y + 96 >= pipe2.y + 270 ||
		duck.x + 96 >= pipe2.x && duck.x <= pipe2.x + 88 && duck.y <= pipe2.y
	) {
		alive = false
		if(duck.y >= 1000) {
			location.reload()
		}
	}

	// Draw The Game
	ctx.clearRect(0, 0, c.width, c.height)
	ctx.drawImage(img_bg, 0, 0)

	ctx.drawImage(img_pt, pipe1.x, pipe1.y - 720)
	ctx.drawImage(img_pb, pipe1.x, pipe1.y + 270)

	ctx.drawImage(img_pt, pipe2.x, pipe2.y - 720)
	ctx.drawImage(img_pb, pipe2.x, pipe2.y + 270)

	ctx.save()
	ctx.translate(duck.x + 48, duck.y + 48)
	ctx.rotate(duck.accY / 10)
	ctx.drawImage(img_bird, -48, -48)
	ctx.restore()
	ctx.font = '50px Helvetica'
	ctx.fillText(score, 50, 50)

}