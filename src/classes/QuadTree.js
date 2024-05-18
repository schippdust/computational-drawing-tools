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
