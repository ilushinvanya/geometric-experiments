let mode = 'math.random' // crypto.getRandomValues

class RandomGenerator {
	values = []
	average = 0
	constructor(loops) {
		this.loops = loops
		this.generateValues()
		this.getAverageValue()
	}

	/**
	 * Накапливаем результы Math.random() или crypto.getRandomValues в массиве
	 */
	generateValues = () => {
		if(mode === 'math.random') {
			for(let i = 0; i <= this.loops; i++){
				this.values.push(Math.random())
			}
		}
		if(mode === 'crypto.getRandomValues') {
			this.values = new Uint32Array(this.loops);
			crypto.getRandomValues(this.values)
		}
	}

	/**
	 * Вычисляем среднее значение всех результатов
	 */
	getAverageValue = () => {
		const sum = this.values.reduce((acc, item) => {
			return acc += item
		}, 0)
		this.average = sum / this.values.length
	}
}

function init() {
	document.getElementById('result').innerHTML = ''
	document.getElementById('totalAverage').innerHTML = ''

	const loops = document.getElementById('loops').value
	const count = document.getElementById('count').value

	const results = Array.from({length: count}, () => new RandomGenerator(loops))

	const resultElement = document.getElementById('result')
	let totalAverage = 0

	results.forEach(result => {
		const divElement = document.createElement('div')
		const preElement = document.createElement('pre')
		const pElement = document.createElement('p')

		preElement.textContent = result.values.join('\n')
		pElement.innerHTML = 'Среднее:<br/>' + result.average

		totalAverage += result.average

		resultElement.appendChild(divElement)

		divElement.appendChild(pElement)
		divElement.appendChild(preElement)
	})

	const totalAverageElement = document.getElementById('totalAverage')
	totalAverageElement.innerHTML = 'Общее среднее: ' + totalAverage / results.length

}

function changeMode() {
	mode = (mode === 'math.random' ? 'crypto.getRandomValues' : 'math.random')
	return mode
}
