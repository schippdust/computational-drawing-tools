import { Rectangle } from './Geometry'

export class QuadTree {
  constructor(sketch, boundary, quadCapacity = 10) {
    this.s = sketch
    this.boundary = boundary
    this.quadCapacity = quadCapacity
    this.elements = []
    this.divided = false
  }

  insert(element) {
    if (!this.boundary.contains(element.originPoint, true)) {
      return false
    }

    if (this.elements.length < this.quadCapacity) {
      this.elements.push(element)
      element.quadTree = this
      return true
    } else {
      if (!this.divided) {
        this.subdivide()
      }

      if (this.northeast.insert(element)) return true
      if (this.northwest.insert(element)) return true
      if (this.southeast.insert(element)) return true
      if (this.southwest.insert(element)) return true
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

  queryRange(searchElement, distance) {
    let results = []
    if (!this.boundary.intersectsCircle(searchElement.originPoint, distance)) {
      return results
    }

    for (let element of this.elements) {
      if (
        element.uuid != searchElement.uuid &&
        element.originPoint.dist(searchElement.originPoint) <= distance
      ) {
        results.push(element)
      }
    }

    if (this.divided) {
      // Recursively search the subnodes
      results = results.concat(
        this.northeast.queryRange(searchElement, distance),
      )
      results = results.concat(
        this.northwest.queryRange(searchElement, distance),
      )
      results = results.concat(
        this.southeast.queryRange(searchElement, distance),
      )
      results = results.concat(
        this.southwest.queryRange(searchElement, distance),
      )
    }

    return results
  }

  getAllVehicles() {
    let elements = []

    vehicles = elements.concat(this.elements)

    if (this.divided) {
      elements = elements.concat(this.northeast.getAllVehicles())
      elements = elements.concat(this.northwest.getAllVehicles())
      elements = elements.concat(this.southeast.getAllVehicles())
      elements = elements.concat(this.southwest.getAllVehicles())
    }

    return elements
  }

  deleteVehicle(element) {
    if (!this.boundary.contains(element.originPoint)) {
      return false
    }

    let index = this.vehicles.indexOf(element)
    if (index !== -1) {
      element.quadTree = undefined
      this.vehicles.filter((e) => e != element)
      return true
    } else if (this.divided) {
      if (this.northeast.deleteVehicle(element)) return true
      if (this.northwest.deleteVehicle(element)) return true
      if (this.southeast.deleteVehicle(element)) return true
      if (this.southwest.deleteVehicle(element)) return true
    } else {
      return false
    }
  }
}
