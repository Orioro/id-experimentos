import Matter from 'matter-js'

const {
	Composite,
	Bodies,
	Body,
	Constraint
} = Matter

const COLLISION_FILTER_CATEGORY = 'compass'

const createMagnetComposite = ({x, y}) => {
	const MAGNET_X = x
	const MAGNET_Y = y
	const MAGNET_WIDTH = 30
	const MAGNET_HEIGHT = 4

	let magnetComposite = Composite.create({
		label: 'Magnet',
	})

	let mainBody = Bodies.rectangle(MAGNET_X, MAGNET_Y, MAGNET_WIDTH, MAGNET_HEIGHT, {
    // restitution: 0,
    collisionFilter: {
    	category: COLLISION_FILTER_CATEGORY,
    },
  	render: {
  		fillStyle: 'black',
  	},
  	// inertia: 100000,
  })

  let mainBodyConstraint = Constraint.create({
  	stiffness: 1,
  	pointA: {
  		x: MAGNET_X,
  		y: MAGNET_Y,
  	},
  	pointB: { x: 0, y: 0 },
  	bodyB: mainBody,
    render: {
    	lineWidth: 0,
    }
  })

 //  let northPole = Bodies.circle(
 //  	MAGNET_X - MAGNET_WIDTH / 2,
 //  	MAGNET_Y,
 //  	MAGNET_HEIGHT / 2,
 //  	{
	//   	render: {
	//   		fillStyle: 'black',
	//   	},
	//   	collisionFilter: {
	//   		category: COLLISION_FILTER_CATEGORY,
	//   	},
	//   	plugin: {
	//   		magnetism: {
	//   			category: 'compass',
	//   			charge: 1,
	//   		},
	//   	},
	//   }
	// )

 //  let northPoleConstraint = Constraint.create({
 //  	stiffness: 1,
 //    bodyA: mainBody,
 //    bodyB: northPole,
 //    pointA: {
 //    	x: - MAGNET_WIDTH / 2,
 //    	y: 0,
 //    },
 //    pointB: {
 //    	x: 0,
 //    	y: 0,
 //    },
 //    render: {
 //    	lineWidth: 0,
 //    }
 //  })

	let southPole = Bodies.circle(
  	MAGNET_X + MAGNET_WIDTH / 2,
  	MAGNET_Y,
  	MAGNET_HEIGHT / 2,
  	{
	  	label: 'south',
	  	render: {
	  		fillStyle: 'black',
	  	},
	  	collisionFilter: {
	  		category: COLLISION_FILTER_CATEGORY,
	  	},
	  	plugin: {
	  		magnetism: {
	  			category: 'compass',
	  			charge: -1,
	  		},
	  	},
	  }
	)

	let southPoleConstraint = Constraint.create({
		stiffness: 1,
    bodyA: mainBody,
    bodyB: southPole,
    pointA: {
    	x: MAGNET_WIDTH / 2,
    	y: 0,
    },
    pointB: {
    	x: 0,
    	y: 0,
    },
    render: {
    	lineWidth: 0,
    }
  })

	Composite.add(magnetComposite, mainBody)
	Composite.add(magnetComposite, mainBodyConstraint)
	// Composite.add(magnetComposite, northPole)
	// Composite.add(magnetComposite, northPoleConstraint)
	Composite.add(magnetComposite, southPole)
	Composite.add(magnetComposite, southPoleConstraint)

	return magnetComposite
}

export default createMagnetComposite
