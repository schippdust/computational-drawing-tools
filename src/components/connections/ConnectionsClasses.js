import P5 from 'p5'

class VehicleQuadTree {
  constructor(boundary, capacity, sketch) {
    this.s = sketch
    this.boundary = boundary // Rectangle representing the boundary of this quadtree
    this.capacity = capacity // Maximum number of vehicles in a quadtree node
    this.vehicles = [] // Array to hold vehicles in this quadtree
    this.divided = false // Flag to indicate if this quadtree has been divided
  }

  // Insert a vehicle into the quadtree
  insert(vehicle) {
    if (!this.boundary.contains(vehicle.location)) {
      // Vehicle is outside the boundary
      return false
    }

    if (this.vehicles.length < this.capacity) {
      // There is space in this quadtree node
      this.vehicles.push(vehicle)
      return true
    } else {
      // If the node is not divided, split it into four subnodes
      if (!this.divided) {
        this.subdivide()
      }

      // Try to insert the vehicle into one of the subnodes
      if (this.northeast.insert(vehicle)) return true
      if (this.northwest.insert(vehicle)) return true
      if (this.southeast.insert(vehicle)) return true
      if (this.southwest.insert(vehicle)) return true
    }
  }

  // Subdivide the current quadtree node into four subnodes
  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.w / 2
    let h = this.boundary.h / 2

    let ne = new Rectangle(x + w, y, w, h, this.s)
    let nw = new Rectangle(x, y, w, h, this.s)
    let se = new Rectangle(x + w, y + h, w, h, this.s)
    let sw = new Rectangle(x, y + h, w, h, this.s)

    this.northeast = new VehicleQuadTree(ne, this.capacity, this.s)
    this.northwest = new VehicleQuadTree(nw, this.capacity, this.s)
    this.southeast = new VehicleQuadTree(se, this.capacity, this.s)
    this.southwest = new VehicleQuadTree(sw, this.capacity, this.s)

    this.divided = true
  }

  // Query for vehicles within a given distance from a target vehicle
  queryRange(targetVehicle, distance) {
    let results = []
    if (!this.boundary.intersectsCircle(targetVehicle.location, distance)) {
      // The quadtree node does not intersect the search circle
      return results
    }

    for (let vehicle of this.vehicles) {
      if (
        vehicle !== targetVehicle &&
        vehicle.location.dist(targetVehicle.location) <= distance
      ) {
        results.push(vehicle)
      }
    }

    if (this.divided) {
      // Recursively search the subnodes
      results = results.concat(
        this.northeast.queryRange(targetVehicle, distance),
      )
      results = results.concat(
        this.northwest.queryRange(targetVehicle, distance),
      )
      results = results.concat(
        this.southeast.queryRange(targetVehicle, distance),
      )
      results = results.concat(
        this.southwest.queryRange(targetVehicle, distance),
      )
    }

    return results
  }

  // Retrieve all vehicles contained within the QuadTree
  getAllVehicles() {
    let vehicles = []

    // Collect vehicles in the current node
    vehicles = vehicles.concat(this.vehicles)

    if (this.divided) {
      // Recursively collect vehicles from subnodes
      vehicles = vehicles.concat(this.northeast.getAllVehicles())
      vehicles = vehicles.concat(this.northwest.getAllVehicles())
      vehicles = vehicles.concat(this.southeast.getAllVehicles())
      vehicles = vehicles.concat(this.southwest.getAllVehicles())
    }

    return vehicles
  }

  // Delete a specific vehicle from the quadtree
  deleteVehicle(vehicle) {
    if (!this.boundary.contains(vehicle.location)) {
      // Vehicle is outside the boundary
      return false
    }

    // Check if the vehicle exists in this node and remove it
    let index = this.vehicles.indexOf(vehicle)
    if (index !== -1) {
      console.log('deleting vehicle')
      this.vehicles.filter((v) => v != vehicle)
      // this.vehicles.splice(index, 1);
      return true
    } else if (this.divided) {
      // If the node is divided, recursively search for the vehicle in subnodes
      if (this.northeast.deleteVehicle(vehicle)) return true
      if (this.northwest.deleteVehicle(vehicle)) return true
      if (this.southeast.deleteVehicle(vehicle)) return true
      if (this.southwest.deleteVehicle(vehicle)) return true
    }

    return false // Vehicle not found
  }
}

class Rectangle {
  constructor(x, y, w, h, sketch) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.s = sketch
  }

  // Check if the rectangle contains a point
  contains(point) {
    return (
      point.x >= this.x &&
      point.x < this.x + this.w &&
      point.y >= this.y &&
      point.y < this.y + this.h
    )
  }

  // Check if the rectangle intersects a circle
  intersectsCircle(point, radius) {
    let closestX = clamp(point.x, this.x, this.x + this.w)
    let closestY = clamp(point.y, this.y, this.y + this.h)

    let distance = this.s.dist(point.x, point.y, closestX, closestY)

    return distance < radius
  }
}

// Helper function to clamp a value within a range
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

class LinearVehicleCollection {
  constructor(w, h, sketch) {
    this.s = sketch
    this.canvasWidth = w
    this.canvasHeight = h
    this.idIterator = 0
    this.treeBoundary = new Rectangle(0 - w, 0 - h, w * 2, h * 2, this.s)
    // this.tree = new VehicleQuadTree(this.treeBoundary,5)
    this.vehicles = []
    this.neighborQueryDistance = 50
    this.noiseTime = 400
    this.patternScale = 0.001
    this.outputScale = 10
  }

  addLinearVehicle(locationVector, guideVector) {
    let newVehicle = new LinearVehicle(locationVector, guideVector, this)
    newVehicle.id = this.idIterator
    // console.log('new vehicle',newVehicle)
    this.idIterator += 1
    // this.tree.insert(newVehicle)
    this.vehicles.push(newVehicle)
  }

  deleteOldVehicles() {
    for (let vehicle of this.vehicles) {
      if (vehicle.dies()) {
        this.vehicles = this.vehicles.filter((v) => v != vehicle)
      }
    }
  }

  updateVehicles() {
    for (let vehicle of this.vehicles) {
      vehicle.update()
    }
  }

  update() {
    // console.log('updating')
    console.log(this.vehicles)
    this.deleteOldVehicles()
    this.updateVehicles()
    this.findNearbyVehicles()
  }

  findNoiseVector(vehicle) {
    let noiseVal = this.s.noise(
      vehicle.location.x * this.patternScale + this.noiseTime,
      vehicle.location.y * this.patternScale + this.noiseTime,
    )
    let radianVal = this.s.map(noiseVal, 0, 1, 0, Math.PI * 2)
    let noiseX =
      Math.cos(radianVal) *
      this.s.randomGaussian(this.outputScale, this.outputScale / 2)
    let noiseY =
      Math.sin(radianVal) *
      this.s.randomGaussian(this.outputScale, this.outputScale / 2)
    let noiseVect = this.s.createVector(noiseX, noiseY)
    return noiseVect
  }

  findForwardVehicles(vehicle) {}

  findNearbyVehicles() {
    let tree = new VehicleQuadTree(this.treeBoundary, 5, this.s)
    for (let vehicle of this.vehicles) {
      tree.insert(vehicle)
    }
    for (let vehicle of this.vehicles) {
      let nearbyVehicles = tree.queryRange(vehicle, this.neighborQueryDistance)
      // this.findNearbyVehicles(vehicle,searchDistance)
      for (let nearbyVehicle of nearbyVehicles) {
        this.s.line(
          vehicle.location.x,
          vehicle.location.y,
          nearbyVehicle.location.x,
          nearbyVehicle.location.y,
        )
      }
    }
  }
}

class LinearVehicle {
  constructor(locationVector, guideVector, linearVehicleCollection) {
    this.id = undefined
    this.s = linearVehicleCollection.s
    this.lifeExpectancy = 50
    this.randomDieRate = 0.02
    this.age = 0
    this.location = locationVector
    this.guide = guideVector
    this.direction = this.s.createVector(this.guide.x, this.guide.y).normalize()
    this.velocity = this.guide.mag() / 20

    this.movementType = 'no neighbors'
    console.log('instantiating vehicle')
    this.swarm = linearVehicleCollection
  }

  dies() {
    if (this.lifeExpectancy < this.age) {
      return true
    } else if (this.s.random() < this.randomDieRate) {
      return true
    }
    return false
  }

  update() {
    this.move()
    this.draw()
  }

  move() {
    this.movement = this.s
      .createVector(this.direction.x, this.direction.y)
      .setMag(this.velocity)
    this.noisyMovement = this.swarm.findNoiseVector(this)
    this.movement = P5.Vector.add(this.movement, this.noisyMovement)
    this.velosity = this.movement.mag()
    this.location.x += this.movement.x
    this.location.y += this.movement.y
    this.age += 1
  }

  detect() {
    let forwardVehicles = this.swarm.findForwardVehicles(this)
  }

  draw() {
    this.s.fill(0)
    this.s.circle(this.location.x, this.location.y, 2)
    console.log('drawing vehicle')
  }
}

export { VehicleQuadTree, Rectangle, LinearVehicleCollection, LinearVehicle }
