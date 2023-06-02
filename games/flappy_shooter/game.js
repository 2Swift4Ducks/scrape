// Basic Setup
let c = document.getElementById('canvas')
let ctx = c.getContext('2d')

// Game Variables

let turret = {
	ammo: 5,
	max: 5,
	reloadTime: 250,
	reloading: false,
	rotation: 0,
	health: 1,
}
let bullets = []
let birdsl = []
let birdsr = []
let score = 0

// Key Event Variables
let spacePressed = false

// Game Assets

let img_bg = new Image()
img_bg.src = './bg.png'

let img_birdl = new Image()
img_birdl.src = './birdl.png'

let img_birdr = new Image()
img_birdr.src = './birdr.png'

let img_bullet = new Image()
img_bullet.src = './bullet.png'

let img_nobullet = new Image()
img_nobullet.src = './nobullet.png'

let img_health = new Image()
img_health.src = './health.png'

let img_base = new Image()
img_base.src = './base.png'

let img_turret = new Image()
img_turret.src = './turret.png'

// Project Event Listeners
c.addEventListener('click', function(event) {
	if (turret.reloading == false) {
		turret.ammo -= 1
		bullets.push({
			x: 480,
			y: 660,
			rotation: turret.rotation + Math.PI / 2,
		})
		console.log(bullets)
	}
	if (turret.ammo == 0 && turret.reloading == false) {
		turret.reloading = true
		reload()
	}
})
document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
c.addEventListener("mousemove", handleMouseMove);

function handleMouseMove(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Calculate the angle
  const angle = Math.atan2(mouseY - 720, mouseX - 480);

  // Store the angle in rotation property of turret
  turret.rotation = angle - Math.PI / 2
}

// Event Listener Functions
function keyDownHandler(e) {
	if (e.keyCode == 32) {
		spacePressed = true
	}
}
function keyUpHandler(e) {
	if (e.keyCode == 32) {
		spacePressed = false
	}
}

// Primary Game Loop
function game() {
	// Move The Bullets Using Sin and Cos Function
	for (let i = 0; i < bullets.length; i++) {
		bullets[i].x += 5 * Math.cos(bullets[i].rotation)
		bullets[i].y += 5 * Math.sin(bullets[i].rotation)
	}
	// Calculating Bird Movement and Bullet Detection for Left Birds
	for (let i = 0; i < birdsl.length; i++) {
		birdsl[i].x += 0.5
		if (birdsl[i].alive == true) {
			if (birdsl[i].accY >= 2.5) {
				birdsl[i].accY = -2.5
			}
			birdsl[i].accY += 0.05
			birdsl[i].y += birdsl[i].accY
			for (let j = 0; j < bullets.length; j++) {
				if (birdsl[i].x <= bullets[j].x && birdsl[i].x + 68 >= bullets[j].x && birdsl[i].y <= bullets[j].y && birdsl[i].y + 48 >= bullets[j].y) {
					birdsl[i].alive = false
					bullets.splice(j, 1)
					score += 1
				}
			}
			if (birdsl[i].x >= 976) {
				birdsl.splice(i, 1)
				score -= 1
			}
		}
		else {
			birdsl[i].accY += 0.05
			birdsl[i].y += birdsl[i].accY
			if (birdsl[i].y >= 1000) {
				birdsl.splice(i, 1)
			}
		}
	}
	// Calculating Bird Movement and Bullet Detection for Right Birds
	for (let i = 0; i < birdsr.length; i++) {
		birdsr[i].x -= 0.5
		if (birdsr[i].alive == true) {
			if (birdsr[i].accY >= 2.5) {
				birdsr[i].accY = -2.5
			}
			birdsr[i].accY += 0.05
			birdsr[i].y += birdsr[i].accY
			for (let j = 0; j < bullets.length; j++) {
				if (birdsr[i].x <= bullets[j].x && birdsr[i].x + 68 >= bullets[j].x && birdsr[i].y <= bullets[j].y && birdsr[i].y + 48 >= bullets[j].y) {
					birdsr[i].alive = false
					bullets.splice(j, 1)
					score += 1
				}
			}
			if (birdsr[i].x <= -80) {
				birdsr.splice(i, 1)
				score -= 1
			}
		}
		else {
			birdsr[i].accY += 0.05
			birdsr[i].y += birdsr[i].accY
			if (birdsr[i].y >= 1000) {
				birdsr.splice(i, 1)
			}
		}
	}

	// Clear Entire Canvas
	ctx.clearRect(0, 0, c.width, c.height)
	ctx.drawImage(img_bg, 0, 0)



	// Draw Ammo Indicator
	for (let i = turret.max; i > 0; i--) {
		if (turret.ammo < i) {
			ctx.drawImage(img_nobullet, i * 200 / turret.max, 646)
		}
	}
	for (let i = 1; i <= turret.max; i++) {
		if (turret.ammo > i) {
			ctx.drawImage(img_bullet, i * 200 / turret.max, 646)
		}
	}
	if (turret.ammo != 0) {
		ctx.drawImage(img_bullet, turret.ammo * 200 / turret.max, 638)
	}



	// Draw Birds
	for (let i = 0; i < birdsl.length; i++) {
		ctx.save()
		ctx.translate(birdsl[i].x + 34, birdsl[i].y)
		ctx.rotate(birdsl[i].accY / 8)
		ctx.drawImage(img_birdl, -34, -24)
		ctx.restore()
	}
	for (let i = 0; i < birdsr.length; i++) {
		ctx.save()
		ctx.translate(birdsr[i].x + 34, birdsr[i].y)
		ctx.rotate(birdsr[i].accY / 8)
		ctx.drawImage(img_birdr, -34, -24)
		ctx.restore()
	}
	for (let i = 0; i < bullets.length; i++) {
		ctx.save()
		ctx.lineWidth = 8
		ctx.strokeStyle = '#00000'
		ctx.beginPath()
		ctx.moveTo(bullets[i].x, bullets[i].y)
		ctx.lineTo(bullets[i].x + 25 * Math.cos(bullets[i].rotation), bullets[i].y + 25 * Math.sin(bullets[i].rotation))
		ctx.stroke()
		ctx.restore()
		ctx.closePath()
		ctx.save()
		ctx.lineWidth = 6
		ctx.strokeStyle = '#FFAA00'
		ctx.beginPath()
		ctx.moveTo(bullets[i].x, bullets[i].y)
		ctx.lineTo(bullets[i].x + 25 * Math.cos(bullets[i].rotation), bullets[i].y + 25 * Math.sin(bullets[i].rotation))
		ctx.stroke()
		ctx.restore()
		ctx.closePath()
	}

	// Draw Turret
	ctx.drawImage(img_base, 384, 656)
	ctx.save()
	ctx.translate(480, 660)
	ctx.rotate(turret.rotation + Math.PI)
	ctx.drawImage(img_turret, -24, -100)
	ctx.restore()

	// Game User Interface

	ctx.drawImage(img_health, 640, 654)

	ctx.fillStyle = '#EE0000'
	ctx.font = '56px Monomaniac One'
	ctx.fillText(turret.health, 704, 702)
	ctx.strokeStyle = '#000000'
	ctx.lineWidth = 2
	ctx.strokeText(turret.health, 704, 702)

	ctx.fillStyle = '#000000'
	ctx.font = '20px Monomaniac One'
	ctx.fillText(score, 480 - ctx.measureText(score).width / 2, 709)
}

function reload() {
	let i = 0
	const reloadTimer = setInterval(() => {

		turret.ammo += 1
		i++

		if (i === turret.max) {
			clearInterval(reloadTimer)
			turret.reloading = false
		}

	}, turret.reloadTime)
}

setInterval(game, 5)

setInterval(() => {
	birdsl.push({
		x: 0,
		y: Math.floor(Math.random() * (400 - 50 + 1)) + 50,
		accY: -2.5,
		alive: true,
	})
	birdsr.push({
		x: 922,
		y: Math.floor(Math.random() * (400 - 50 + 1)) + 50,
		accY: -2.5,
		alive: true,
	})
}, 2000)









