import * as d3 from 'd3'

const $svg = d3.select('#svg')

const generateData = () => {
	return d3.range(100).map(index => {
		if (index === 0) {
			return {
				x: 0,
				y: 0
			}
		}

		if (index === 99) {
			return {
				x: 10,
				y: 10
			}
		}

		return {
			x: Math.random() * 10,
			y: Math.random() * 10
		}
	})
}

const $path = $svg.append('path')
  .attr('stroke', 'black')
  .attr('stroke-width', '2')
  .attr('fill', 'none')


const scaleX = d3.scaleLinear()
	.domain([0, 10])
	.range([
		window.innerWidth * .2,
		window.innerWidth * .8
	])
const scaleY = d3.scaleLinear()
	.domain([0, 10])
	.range([
		window.innerHeight * .2,
		window.innerHeight * .8
	])

const drawLine = d3.line()
  .curve(d3.curveCatmullRom.alpha(0.5))
	.x(d => scaleX(d.x))
	.y(d => scaleY(d.y))

const render = () => {
	$path.transition()
  	.duration(10000)
  	.ease(d3.easeElastic)
  	.attr('d', drawLine(generateData()))
}

setInterval(render, 200)
render()

document.addEventListener('click', render)
