const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let balls = [];
const mouse = {
	x: undefined,
	y: undefined
}
let newId = 1
const randomNumber = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
const symbols = ['🤪','😵‍💫', '⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🏉', '🎱', '🎲'];
const randomSymbol = () => symbols[randomNumber(0, symbols.length - 1)]

const calcGeometry = (x0, y0, x1, y1) => {
	const width = x1 - x0;
	const height = y0 - y1;
	return {
		hypotenuse: Math.sqrt(width**2 + height**2),
		angle: Math.atan2(height, width)
	}
}

addEventListener('mousemove', event => {
	mouse.x = event.clientX
	mouse.y = event.clientY
})

addEventListener('mousedown', () => {
	cursor.visible = true;
	cursor.x0 = mouse.x;
	cursor.y0 = mouse.y;
})

addEventListener('mouseup', () => {
	const { angle, hypotenuse } = calcGeometry(cursor.x0, cursor.y0, mouse.x, mouse.y)
	const velocity = hypotenuse / 1.4;
	const freshBall = new Ball(newId, cursor.x0, cursor.y0, velocity, angle, randomSymbol(), 20 + Math.random() * 10)
	balls.push(freshBall)

	newId++;
	cursor.visible = false;
	cursor.x0 = 0;
	cursor.y0 = 0;
})

class Cursor {
	constructor(visible, x0, y0) {
		this.visible = visible
		this.x0 = x0
		this.y0 = y0
	}
	draw() {
		if(!this.visible) return;
		c.beginPath()
		c.moveTo(this.x0, this.y0)
		c.lineTo(mouse.x, mouse.y)
		c.stroke()
		c.closePath()
	}
}
const cursor = new Cursor(false, 0,0);


G = 9.8
DeltaT = 0.1
class Ball {
	constructor(newId, startX, startY, velocity, radian, symbol, symbolRadius) {
		this.r = symbolRadius
		this.startX = startX
		this.startY = startY
		this.x = 0
		this.y = 0
		this.t = 0
		this.startVelocity = velocity
		this.radian = radian
		this.symbol = symbol
		this.currentVelocity = 0
		this.verticalCollapse = 0
		this.horizontalCollapse = 0
	}
	draw() {
		c.beginPath()
		c.font = `${this.r * 2}px serif`;
		// c.arc(this.x, this.y, this.r, 0, Math.PI * 2)
		// let collapse = 0
		// if(this.verticalCollapse) verticalCollapse = 1
		// if(this.horizontalCollapse) horizontalCollapse = 1
		// console.log(this.r - this.horizontalCollapse)
		// c.ellipse(this.x, this.y, this.r - this.horizontalCollapse, this.r - this.verticalCollapse,  Math.PI,0, Math.PI * 2)
		c.ellipse(this.x, this.y, this.r, this.r - this.verticalCollapse,  Math.PI,0, Math.PI * 2)
		if(this.verticalCollapse > 0 ) {
			this.verticalCollapse--
		}
		if(this.horizontalCollapse > 0 ) {
			this.horizontalCollapse--
		}
		c.fillStyle = 'black'
		c.fill()
		c.closePath()
	}
	update() {
		const speed = this.startVelocity;

		this.t = this.t + DeltaT;
		const time = this.t

		const oldX = this.x
		const oldY = this.y

		this.x = this.startX + speed * Math.cos(this.radian) * time
		this.y = this.startY + -1 * speed * Math.sin(this.radian) * time + (G * time**2) / 2

		const newX = this.x
		const newY = this.y

		const { angle, hypotenuse } = calcGeometry(oldX, oldY, newX, newY)

		this.currentVelocity = (hypotenuse / 1.4) / DeltaT

		const leftSide = this.x - this.r < 0
		const rightSide = this.x + this.r > canvas.width
		const bottomSide = this.y + this.r > canvas.height

		if(rightSide || leftSide) {
			this.startVelocity = this.currentVelocity
			this.t = 0
			this.radian = Math.PI - angle
			this.startY = this.y

			if(rightSide)   this.startX = canvas.width - this.r
			if(leftSide)    this.startX = this.r
			this.horizontalCollapse = this.currentVelocity / 10
		}
		if(bottomSide) {
			this.startVelocity = this.currentVelocity
			this.t = 0
			this.radian = 2 * Math.PI - angle
			this.startX = this.x
			this.startY = canvas.height - this.r
			if(this.startVelocity < 0.4) {
				this.startVelocity = 0
			}
			this.verticalCollapse = this.currentVelocity / 10
		}

		this.draw()
	}

	// destroy() {
	// 	balls = balls.filter(ball => ball.id !== this.id)
	// }
}

function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	balls.forEach(ball => {
		ball.update()
	})
	cursor.draw()
}

animate()
