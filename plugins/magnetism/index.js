import magnetismAttractor from './attractor'

const magnetism = (options) => {

	const initBody = (Matter, bodySpec) => {
		if (bodySpec.plugin && bodySpec.plugin.magnetism) {
			bodySpec.plugin.attractors = bodySpec.plugin.attractors || []
			bodySpec.plugin.attractors.push(magnetismAttractor(options))
		}
	}

	const install = (Matter) => {
		Matter.before('Body.create', initBody.bind(null, Matter))
	}

	return {
		name: 'matter-magnetism',
		version: '0.0.0',
		for: 'matter-js@^0.12.0',
		uses: [
			'matter-attractors@^0.1.6'
		],
		install,
	}
}

export default magnetism
