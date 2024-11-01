const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

const CenterX = canvas.width / 2
const CenterY = canvas.height / 2

const mouse = {
	x: undefined,
	y: undefined
}
const firstClick = {
	x: undefined,
	y: undefined
}
const secondClick = {
	x: undefined,
	y: undefined
}

addEventListener('mousedown', event => {
	if(!firstClick.x && !firstClick.y) {
		firstClick.x = event.clientX
		firstClick.y = event.clientY
	} else if(!secondClick.x && !secondClick.y) {
		secondClick.x = event.clientX
		secondClick.y = event.clientY
	} else {
		firstClick.x = undefined
		firstClick.y = undefined
		secondClick.x = undefined
		secondClick.y = undefined
	}
})
addEventListener('mousemove', event => {
	mouse.x = event.clientX
	mouse.y = event.clientY
})

const getAngle = (x0, y0, x1, y1) => {
	const width = x1 - x0;
	const height = y1 - y0;
	return {
		angle: Math.atan2(height, width)
	}
}

const makeCircle = () => {
	c.beginPath();
	c.arc(CenterX, CenterY, Radius, 0, 2 * Math.PI)
	c.strokeStyle = 'black'
	c.stroke();
	c.closePath()
}

const getCircleCoordsFromMouse = (mouseX, mouseY) => {
	const { angle } = getAngle(CenterX, CenterY, mouseX, mouseY)
	const x = CenterX + Radius * Math.cos(angle)
	const y = CenterY + Radius * Math.sin(angle)
	return [ x, y ]
}

const makePoint = (x, y, color = 'green', radius = 6) => {
	c.beginPath();
	c.arc(x, y, radius, 0, 2 * Math.PI)
	c.strokeStyle = color
	c.fillStyle = color
	c.stroke();
	c.fill();
	c.closePath()
}

const makeLine = (x1, y1, x2, y2) => {
	c.beginPath();
	c.moveTo(x1, y1)
	c.lineTo(x2, y2)
	c.strokeStyle = 'green'
	c.stroke();
	c.closePath()
}

const Radius = 160

function animate() {

	c.clearRect(0, 0, canvas.width, canvas.height)
	c.lineWidth = 4

	makeCircle()
	const [ mouseX, mouseY ] = getCircleCoordsFromMouse(mouse.x, mouse.y)
	makePoint(mouseX, mouseY)

	const coords = {
		x1: 0,
		y1: 0,
		x2: 0,
		y2: 0,
	}

	if(firstClick.x && firstClick.y) {
		const firstPoint = getCircleCoordsFromMouse(firstClick.x, firstClick.y)
		coords.x1 = firstPoint[0]
		coords.y1 = firstPoint[1]
		makePoint(...firstPoint)
	}
	if((mouse.x && mouse.y) || (secondClick.x && secondClick.y)) {
		const x = secondClick.x ? secondClick.x : mouse.x
		const y = secondClick.y ? secondClick.y : mouse.y
		const secondPoint = getCircleCoordsFromMouse(x, y)
		coords.x2 = secondPoint[0]
		coords.y2 = secondPoint[1]
		makePoint(...secondPoint)
	}
	if(coords.x1 && coords.x2 && coords.y1 && coords.y2) {
		// Середина между двух выбранных точек (первого катета)
		const x_c = (coords.x1 + coords.x2) / 2
		const y_c = (coords.y1 + coords.y2) / 2
		// makePoint(...getCircleCoordsFromMouse(x_c, y_c), 'green')

		// Угол между центром круга и первой точкой на окружности
		const { angle: angle1 } = getAngle(coords.x1, coords.y1, CenterX, CenterY)

		// Угол между центром круга и серединой между двух окружностей
		const { angle: angleC } = getAngle(x_c, y_c, CenterX, CenterY)

		// Точка напротив середины катета
		const x_c2 = x_c + Radius * Math.cos(angleC)
		const y_c2 = y_c + Radius * Math.sin(angleC)
		// makePoint(...getCircleCoordsFromMouse(x_c2, y_c2), 'red')

		// Угол между центром круга и точки напротив первого катета
		const { angle: angleAgainstC } = getAngle(CenterX, CenterY, x_c2, y_c2)

		// Разница между углами первой выбранной точки и и точки посередине катета
		const diffAngle1 = angleC - angle1

		// Угол между центров круга и третьей точкой
		const angle3 = angleAgainstC + diffAngle1

		// Третья точка прямоугольного треугольника
		const x3 = CenterX + Radius * Math.cos(angle3)
		const y3 = CenterY + Radius * Math.sin(angle3)
		makePoint(x3, y3, 'green')

		// Первый катет
		makeLine(coords.x1, coords.y1, coords.x2, coords.y2)
		const length1 =  Math.sqrt((coords.x2 - coords.x1)**2 + (coords.y2 - coords.y1)**2)

		// Второй катет
		makeLine(coords.x1, coords.y1, x3, y3)
		const length2 = Math.sqrt((x3 - coords.x1)**2 + (y3 - coords.y1)**2)

		// Гипотенуза
		makeLine(coords.x2, coords.y2, x3, y3)
		const length3 = Math.sqrt(length1**2 + length2**2)

		// Первая четверть гипотенузы
		const x01 = CenterX + length3 / 4 * Math.cos(angle3)
		const y01 = CenterY + length3 / 4 * Math.sin(angle3)
		makePoint(x01, y01, 'black', 2)

		// Вторая четверть гипотенузы
		const x02 = CenterX + -(length3 / 4) * Math.cos(angle3)
		const y02 = CenterY + -(length3 / 4) * Math.sin(angle3)
		makePoint(x02, y02, 'black', 2)

		makePoint(CenterX, CenterY, 'black', 4)
	}

	c.lineWidth = 1
	makeLine(CenterX, 0, CenterX, CenterY * 2)
	makeLine(0, CenterY, CenterX * 2, CenterY)

	requestAnimationFrame(animate)
}

animate()
