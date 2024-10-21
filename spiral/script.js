if (window.location.hash) {
	const iframe = document.querySelector('iframe')
	iframe.src = `https://www.youtube.com/embed/${window.location.hash.replace('#', '')}?controls=0`
}

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
const CenterX = canvas.width / 2
const CenterY = canvas.height / 2
c.lineWidth = 4
const SpiralLoops = 10;

class Spiral {
	constructor(startAngle, color) {
		this.Angle = startAngle
		this.Color = color

		this.Iterations = SpiralLoops * 360 * this.AngleStep
	}
	AngleStep = 1;
	Radius = 0
	RadiusStep = 0.1

	update() {
		this.Angle += this.AngleStep;
		this.draw()
	}
	draw() {
		let angle = this.Angle;
		let radius = this.Radius

		c.beginPath()
		c.moveTo(CenterX, CenterY)
		c.strokeStyle = this.Color

		// Рисуем спираль
		for (let i = 0; i < this.Iterations; i++) {
			// Каждый раз увеличиваем радиус, получается спираль
			radius += this.RadiusStep
			// Движение по кругу
			angle += this.AngleStep;

			const { x, y } = this.getPoint(radius, angle)
			c.lineTo(x, y);
		}
		c.stroke()
	}
	getPoint(radius, angle) {
		// формула перевода градусов в радианы
		const rad = angle * Math.PI / 180

		// формула вычисления координат зная радиус и угол поворота
		const x = CenterX + radius * Math.cos(rad);
		const y = CenterY + radius * Math.sin(rad);
		return { x, y };
	}
}
const spirals = []
function init() {
	const count = 4
	const colors = ['black', 'black', 'black', 'black']
	for (let i = 0; i < count; i++) {
		spirals.push(
			new Spiral(i * 360 / count, colors[i])
		)
	}
}


function animate() {
	requestAnimationFrame(animate)
	c.clearRect(0, 0, canvas.width, canvas.height)
	spirals.forEach(spiral => spiral.update())

	c.beginPath();
	c.arc(CenterX, CenterY, 6, 0, Math.PI * 2)
	c.stroke();
	c.fill()

	c.beginPath();
	c.arc(canvas.width / 2, canvas.height / 2, SpiralLoops * 360 * 0.1, 0, 2 * Math.PI);
	c.strokeStyle = 'white'
	c.stroke();
}
init()
animate()
