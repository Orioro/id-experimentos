import Matter from 'matter-js'
import metaesquema from 'metaesquema-util'
import MatterAttractors from 'matter-attractors'
import magnetismPlugin from '../plugins/magnetism'
import magnetComposite from '../composites/magnet'


const {
	Engine,
	Render,
	Runner,
	Body,
	Bodies,
	World,
	Mouse,
	MouseConstraint,
	Events,
	Common
} = Matter

const setup = ({ canvasWidth, canvasHeight, canvas, plugins }) => {
  const CANVAS_WIDTH = canvasWidth
  const CANVAS_HEIGHT = canvasHeight

  if (!canvas) {
    throw new Error('canvas is required')
  }
  
  if (!CANVAS_WIDTH) {
    throw new Error('CANVAS_WIDTH is required')
  }
  
  if (!CANVAS_HEIGHT) {
    throw new Error('CANVAS_HEIGHT is required')
  }

  if (plugins) {
  	plugins.forEach(plugin => Matter.use(plugin))
  }

  // create engine
  let engine = Engine.create({
  	// enable sleeping as we are collision heavy users
  	// enableSleeping: true
  })

  engine.world.gravity.x = 0
  engine.world.gravity.y = 0

  // create renderer
  let render = Render.create({
  	canvas: canvas,
  	engine: engine,
  	options: {
  		wireframes: false,
      // showPositions: true,
      // showAngleIndicator: true,
  		background: '#FFFFFF',
  		pixelRatio: 1,

  		width: CANVAS_WIDTH,
  		height: CANVAS_HEIGHT,
  	}
  })
  Render.run(render)

  // create runner
  let runner = Runner.create()

  Runner.run(runner, engine)
  Render.run(render)

  /**
   * Walls
   */
  let WALLS = metaesquema.Matter.Composites.walls(
    {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      wallThickness: 60,
    },
    (spec) => {
      return Matter.Bodies.rectangle(spec.x, spec.y, spec.width, spec.height, {
        isStatic: true,
        restitution: 0, 
      })
    }
  )

  World.add(engine.world, WALLS)


  /**
   * Bodies
   */
  const BODIES = [
    // Bodies.circle(CANVAS_WIDTH * 1/3, CANVAS_HEIGHT * 1/3, 10, {
    // 	label: 'negative-1',
    // 	render: {
    // 		fillStyle: 'blue',
    // 	},
    // 	plugin: {
	   //  	magnetism: {
	   //  		charge: -1
	   //  	}
    // 	}
    // }),
    // Bodies.circle(CANVAS_WIDTH * 2/3, CANVAS_HEIGHT * 1/3, 10, {
    // 	label: 'negative-2',
    // 	render: {
    // 		fillStyle: 'red',
    // 	},
    // 	plugin: {
	   //  	magnetism: {
	   //  		charge: -1
	   //  	}
    // 	}
    // }),

    // Bodies.circle(CANVAS_WIDTH * 1/8, CANVAS_HEIGHT * 1/8, 10, {
    //   mass: 1000,
    //   restitution: 0,
    //   label: 'positive-1',
    //   render: {
    //     fillStyle: 'blue',
    //   },
    //   plugin: {
    //     magnetism: {
    //       charge: 100
    //     }
    //   }
    // }),

    // Bodies.circle(CANVAS_WIDTH * 2/10, CANVAS_HEIGHT * 2/10, 10, {
    //   mass: 100,
    //   isStatic: true,
    //   restitution: 0,
    //   label: 'positive-2',
    //   render: {
    //     fillStyle: 'blue',
    //   },
    //   plugin: {
    //     magnetism: {
    //       charge: 10
    //     }
    //   }
    // }),

    // magnetComposite({
    //   x: CANVAS_WIDTH / 2,
    //   y: CANVAS_HEIGHT / 2
    // }),
  ]

  World.add(engine.world, BODIES)

  /**
   * Compasses
   */
  const COMPASS_POSITIONS = []
  const TOTAL_LINES = 11
  const TOTAL_COLUMNS = 15
  let lines = TOTAL_LINES - 1

  while (lines > 0) {
    let columns = TOTAL_COLUMNS - 1
    while (columns > 0) {
      COMPASS_POSITIONS.push({
        x: CANVAS_WIDTH * columns / TOTAL_COLUMNS,
        y: CANVAS_HEIGHT * lines / TOTAL_LINES,
      })

      columns -= 1
    }

    lines -= 1
  }

  console.log(COMPASS_POSITIONS)

  World.add(engine.world, COMPASS_POSITIONS.map(position => {
    return magnetComposite(position)
  }))

  // let charges = [
  //   Bodies.circle(CANVAS_WIDTH * 4/15, CANVAS_HEIGHT * 1/2, 2, {
  //     mass: 100,
  //     isStatic: true,
  //     restitution: 0,
  //     label: 'positive',
  //     render: {
  //       fillStyle: 'black',
  //     },
  //     plugin: {
  //       magnetism: {
  //         charge: 50
  //       }
  //     }
  //   }),

  //   Bodies.circle(CANVAS_WIDTH * 11/15, CANVAS_HEIGHT * 1/2, 2, {
  //     mass: 100,
  //     isStatic: true,
  //     restitution: 0,
  //     label: 'negative',
  //     render: {
  //       fillStyle: 'white',
  //       strokeStyle: 'black',
  //       lineWidth: 1
  //     },
  //     plugin: {
  //       magnetism: {
  //         charge: -50
  //       }
  //     }
  //   })
  // ]

  // World.add(engine.world, charges)

  /**
   * Mouse control
   */
  let mouse = Mouse.create(render.canvas)
  // let mouseConstraint = MouseConstraint.create(engine, {
  //   mouse: mouse,
  //   constraint: {
  //     angularStiffness: 1,
  //     render: {
  //       visible: false
  //     }
  //   }
  // })

  // World.add(engine.world, mouseConstraint);

  // // keep the mouse in sync with rendering
  // render.mouse = mouse;

  let attractiveBody =  Bodies.circle(CANVAS_WIDTH * 1/2, CANVAS_HEIGHT * 1/2, 2, {
      // mass: 100,
      isStatic: true,
      restitution: 0,
      label: 'positive-2',
      render: {
        fillStyle: 'black',
      },
      plugin: {
        magnetism: {
          charge: 50
        }
      }
    })

  World.add(engine.world, attractiveBody)

  Events.on(engine, 'afterUpdate', function() {
      if (!mouse.position.x) {
        return;
      }

      // smoothly move the attractor body towards the mouse
      Body.translate(attractiveBody, {
          x: (mouse.position.x - attractiveBody.position.x) * 0.25,
          y: (mouse.position.y - attractiveBody.position.y) * 0.25
      });
  });




}

const app = setup({
  canvasWidth: window.innerWidth,
  canvasHeight: window.innerHeight,
  canvas: document.querySelector('canvas'),
  plugins: [
  	MatterAttractors,
  	magnetismPlugin(),
  ],
})
