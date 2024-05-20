import { Rectangle } from './Geometry'

export class QuadTree {
  constructor(sketch, boundary, quadCapacity = 10) {
    this.s = sketch
    this.boundary = boundary
    this.quadCapacity = quadCapacity
    this.vehicles = []
    this.divided = false
  }

  insert(vehicle) {
    if (!this.boundary.contains(vehicle.basePoint, true)) {
      return false
    }

    if (this.vehicles.length < this.quadCapacity) {
      this.vehicles.push(vehicle)
      vehicle.quadTree = this
      return true
    } else {
      if (!this.divided) {
        this.subdivide()
      }

      if (this.northeast.insert(vehicle)) return true
      if (this.northwest.insert(vehicle)) return true
      if (this.southeast.insert(vehicle)) return true
      if (this.southwest.insert(vehicle)) return true
    }
  }

  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.w / 2
    let h = this.boundary.h / 2

    let ne = new Rectangle(this.s, x + w, y, w, h)
    let nw = new Rectangle(this.s, x, y, w, h)
    let se = new Rectangle(this.s, x + w, y + h, w, h)
    let sw = new Rectangle(this.s, x, y + h, w, h)

    this.northeast = new QuadTree(this.s, ne, this.capacity)
    this.northwest = new QuadTree(this.s, nw, this.capacity)
    this.southeast = new QuadTree(this.s, se, this.capacity)
    this.southwest = new QuadTree(this.s, sw, this.capacity)

    this.divided = true
  }

  queryRange(searchVehicle, distance) {
    let results = []
    if (!this.boundary.intersectsCircle(searchVehicle.basePoint, distance)) {
      return results
    }

    for (let vehicle of this.vehicles) {
      if (
        vehicle.uuid != searchVehicle.uuid &&
        vehicle.basePoint.dist(searchVehicle.basePoint) <= distance
      ) {
        results.push(vehicle)
      }
    }

    if (this.divided) {
      // Recursively search the subnodes
      results = results.concat(
        this.northeast.queryRange(searchVehicle, distance),
      )
      results = results.concat(
        this.northwest.queryRange(searchVehicle, distance),
      )
      results = results.concat(
        this.southeast.queryRange(searchVehicle, distance),
      )
      results = results.concat(
        this.southwest.queryRange(searchVehicle, distance),
      )
    }

    return results
  }

  getAllVehicles() {
    let vehicles = []

    vehicles = vehicles.concat(this.vehicles)

    if (this.divided) {
      vehicles = vehicles.concat(this.northeast.getAllVehicles())
      vehicles = vehicles.concat(this.northwest.getAllVehicles())
      vehicles = vehicles.concat(this.southeast.getAllVehicles())
      vehicles = vehicles.concat(this.southwest.getAllVehicles())
    }

    return vehicles
  }

  deleteVehicle(vehicle) {
    if (!this.boundary.contains(vehicle.basePoint)) {
      return false
    }

    let index = this.vehicles.indexOf(vehicle)
    if (index !== -1) {
      vehicle.quadTree = undefined
      this.vehicles.filter((v) => v != vehicle)
      return true
    } else if (this.divided) {
      if (this.northeast.deleteVehicle(vehicle)) return true
      if (this.northwest.deleteVehicle(vehicle)) return true
      if (this.southeast.deleteVehicle(vehicle)) return true
      if (this.southwest.deleteVehicle(vehicle)) return true
    } else {
      return false
    }
  }
}
