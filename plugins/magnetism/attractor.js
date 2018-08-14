import Matter from 'matter-js'

const {
	Vector,
	Body,
} = Matter

const PSEUDO_COULOMB_CONSTANT = 1e-1
	
const chargesAttract = (chargeA, chargeB) => {
	return (chargeA > 0 && chargeB < 0) || (chargeA < 0 && chargeB > 0)
}

const makeMagnetismAttractor = (options = {}) => {
	const MAGNITUDE_MULTIPLIER = options.magnitudeMultiplier || PSEUDO_COULOMB_CONSTANT

	return (bodyA, bodyB) => {
		let magnetismA = bodyA.plugin && bodyA.plugin.magnetism
		let magnetismB = bodyB.plugin && bodyB.plugin.magnetism

		if (!magnetismA || !magnetismB) {
			return
		}

		// TODO: magnetism filtering mechanism
		if (magnetismA.category && magnetismB.category && magnetismA.category === magnetismB.category) {
			return
		}

		let distance = Vector.magnitude(Vector.sub(bodyA.position, bodyB.position))

		if (distance < 20) {
			return
		}

		let chargeA = magnetismA.charge
		let chargeB = magnetismB.charge

		let forceMagnitude = MAGNITUDE_MULTIPLIER * Math.abs(chargeA) * Math.abs(chargeB) / distance ** 2

		forceMagnitude = Math.min(forceMagnitude, .2)

		// console.log(forceMagnitude)

		if (chargesAttract(chargeA, chargeB)) {
			// attraction
			let forceA = Vector.mult(
				Vector.normalise(
					Vector.sub(bodyB.position, bodyA.position)
				),
				forceMagnitude
			)

			Body.applyForce(bodyA, bodyA.position, forceA)
			Body.applyForce(bodyB, bodyB.position, Vector.neg(forceA))

		} else {
			// repulsion
			let forceA = Vector.mult(
				Vector.normalise(
					Vector.sub(bodyA.position, bodyB.position)
				),
				forceMagnitude
			)

			Body.applyForce(bodyA, bodyA.position, forceA)
			Body.applyForce(bodyB, bodyB.position, Vector.neg(forceA))
		}

	}

}

export default makeMagnetismAttractor
