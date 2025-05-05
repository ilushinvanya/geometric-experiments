const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight


/* Utilities */
const randomNumber = (minimum, maximum) => Math.floor(Math.random() * (maximum - minimum + 1)) + minimum;
const symbols = ['⚽️', '🏀', '🏈', '⚾️', '🥎', '🎾', '🏐', '🎱', '🎲'];
function randomSymbol() {
	return symbols[randomNumber(0, symbols.length - 1)]
}
function roundNumber(number, fraction = 2) {
	return parseFloat(number.toFixed(fraction));
}
function calcGeometry(x0, y0, x1, y1) {
	const width = x1 - x0;
	const height = y0 - y1;
	return {
		hypotenuse: Math.sqrt(width**2 + height**2),
		angle: Math.atan2(height, width)
	}
}
function canvas_arrow(context, fromx, fromy, tox, toy, r){
	let x_center = tox;
	let y_center = toy;

	let angle;
	let x;
	let y;

	context.beginPath();

	angle = Math.atan2(toy-fromy,tox-fromx)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;

	context.moveTo(x, y);

	angle += (1/3)*(2*Math.PI)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;

	context.lineTo(x, y);

	angle += (1/3)*(2*Math.PI)
	x = r*Math.cos(angle) + x_center;
	y = r*Math.sin(angle) + y_center;

	context.lineTo(x, y);

	context.closePath();

	context.fill();
}

let newId = 1
let balls = [];
let candidateBall = null;
const mouse = {
	x: undefined,
	y: undefined
}

addEventListener('mousemove', event => {
	mouse.x = event.clientX
	mouse.y = event.clientY
	if(cursor.visible) {
		candidateBall = new Ball(newId, cursor.x0, cursor.y0, mouse.x, mouse.y, randomSymbol(), 20 + Math.random() * 10)
		candidateBall.fillPoints()
	}
})

addEventListener('mousedown', () => {
	cursor.visible = true;
	cursor.x0 = mouse.x;
	cursor.y0 = mouse.y;
})

addEventListener('mouseup', () => {
	if(candidateBall) {
		balls.push(candidateBall)
		candidateBall = null;
	}

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

		c.moveTo(this.x0, this.y0)
		c.lineTo(this.x0, mouse.y)

		c.moveTo(this.x0, this.y0)
		c.lineTo(mouse.x, this.y0)

		const { angle, hypotenuse } = calcGeometry(this.x0, this.y0, mouse.x, mouse.y)
		c.arc(this.x0, this.y0, 30, 0, -1 * angle, true)


		c.strokeStyle = 'black'
		c.stroke()
		c.closePath()


		const xText = Math.abs(mouse.x - this.x0)
		const yText = Math.abs(mouse.y - this.y0)

		c.font = `12px serif`;
		c.fillText('0', this.x0 - 12, this.y0 + 12)

		c.fillText(`x = ${xText}`, mouse.x, this.y0 + 12)
		c.fillText(`y = ${yText}`, this.x0 + 12, mouse.y)


		c.font = `15px serif`;

		const degree = angle * 180 / Math.PI;
		c.fillText(`${roundNumber(degree, 0)}º`, this.x0 + 30, this.y0 - 6)
		c.fillText(`${roundNumber(hypotenuse, 0)}`, mouse.x, mouse.y)

		canvas_arrow(c, this.x0, this.y0, mouse.x, mouse.y, 4)
		canvas_arrow(c, this.x0, this.y0, this.x0, mouse.y, 4)
		canvas_arrow(c, this.x0, this.y0, mouse.x, this.y0, 4)

		// V * COS(angle) * t + x0
		// гипотенуза * COS(angle) * time (дельта t) + Начальная координата x0

		// V * SIN(angle) * t + ((G * time^2) / 2) + y0
		// гипотенуза * SIN(angle) * time + ((G * time^2) / 2) + Начальная координата y0

	}
}
const cursor = new Cursor(false, 0,0);


G = 9.8
DeltaT = 0.2
class Ball {
	constructor(newId, startX, startY, endX, endY, symbol, symbolRadius) {
		this.r = symbolRadius
		this.startX = startX
		this.startY = startY
		this.x = 0
		this.y = 0
		this.t = 0

		const { angle, hypotenuse } = calcGeometry(startX, startY, endX, endY)
		this.startVelocity = roundNumber((hypotenuse / 2), 2);
		this.radian = angle

		this.symbol = symbol
		this.currentVelocity = 0

		this.points = [[0,0]]
		this.activePoint = 0
		console.log(newId)
	}
	createPoint() {
		const speed = this.startVelocity;

		this.t = this.t + DeltaT;
		const time = roundNumber(this.t, 1)

		const oldX = this.x
		const oldY = this.y

		this.x = this.startX + speed * Math.cos(this.radian) * time


		const delimoe = roundNumber(-1 * speed * Math.sin(this.radian) * time, 6)
		const gravity = roundNumber((G * time**2) / 2, 6)
		this.y = this.startY + delimoe + gravity

		this.x = roundNumber(this.x, 6)
		this.y = roundNumber(this.y, 6)

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
			this.startY = roundNumber(this.y, 0)

			if(rightSide)   this.startX = roundNumber(canvas.width - this.r, 0)
			if(leftSide)    this.startX = roundNumber(this.r, 0)
		}
		if(bottomSide) {
			this.startVelocity = this.currentVelocity
			this.t = 0
			this.radian = 2 * Math.PI - angle
			this.startX = roundNumber(this.x, 0)
			this.startY = roundNumber(canvas.height - this.r, 0)
			if(this.startVelocity < 0.4) {
				this.startVelocity = 0
			}
		}
	}
	areLastElementsRepeating(arr, repeatCount = 2) {
		if (arr.length < repeatCount) {
			return false; // Недостаточно элементов для проверки
		}

		// Берем последний элемент
		const lastElement = arr[arr.length - 1];

		// Проверяем, совпадают ли предыдущие `repeatCount - 1` элементов с последним
		for (let i = 1; i < repeatCount; i++) {
			const prevElement = arr[arr.length - 1 - i];

			// Сравниваем x и y с допуском (из-за плавающей точки)
			const isEqualX = Math.abs(prevElement[0] - lastElement[0]) <= 0.3;
			const isEqualY = Math.abs(prevElement[1] - lastElement[1]) <= 1;

			if (!isEqualX || !isEqualY) {
				return false; // Нашли несовпадение → нет повторения
			}
		}

		return true; // Все проверенные элементы совпадают
	}
	fillPoints() {
		this.points = []
		let isDifferent = true
		while(isDifferent) {
			this.createPoint()
			this.points.push([this.x, this.y])
			isDifferent = !this.areLastElementsRepeating(this.points, 10)
			if(this.points.length > 2000) {
				isDifferent = false
			}
		}
		console.log(this.points)
		this.drawTrajectory()
	}
	drawTrajectory() {
		c.beginPath()
		c.moveTo(this.points[this.activePoint][0], this.points[this.activePoint][1])
		for(let i = this.activePoint; i < this.points.length; i++) {
			const x = this.points[i][0]
			const y = this.points[i][1]
			c.lineTo(x, y)
		}
		c.strokeStyle = '#515151'
		c.stroke()
		c.closePath()
	}

	drawBall() {
		c.beginPath()
		c.font = `${this.r * 2}px serif`;

		const x = this.points[this.activePoint][0]
		const y = this.points[this.activePoint][1]

		c.fillText(this.symbol, x - this.r, y + this.r)
		c.closePath()

	}
	moveBall() {
		if(!this.points.length) {
			return
		}
		this.drawBall()
		if(this.points.length - 1 > this.activePoint) {
			this.activePoint++
			this.drawTrajectory()
		}
	}
}

function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	balls.forEach(ball => {
		ball.moveBall()
	})
	if(candidateBall) {
		candidateBall.drawTrajectory()
	}

	cursor.draw()
}

animate()
