import { BaseVehicle, GeometryTypes } from '@/classes/BaseVehicle'
import P5 from 'p5'

export class MovingTarget extends BaseVehicle {
  constructor(sketch, targetRadius = 10, x = 0, y = 0) {
    super(sketch, x, y)
    this.randomizeLocation()
    this.targetRadius = targetRadius
    this.boundsMin = this.s.createVector(this.s.width / 4, this.s.height / 4)
    this.boundsMax = this.s.createVector(
      this.s.width * (3 / 4),
      this.s.height * (3 / 4),
    )
  }

  draw() {
    this.s.stroke(255)
    this.s.fill(0)
    this.steerToWithinBounds(this.boundsMin, this.boundsMax)
    this.update()
    this.s.circle(this.basePoint.x, this.basePoint.y, this.targetRadius * 2)
  }
}

export class Tracer extends BaseVehicle {
  geometryType = GeometryTypes.POLYLINE
  draw() {
    this.update()
    if (this.polylinePoints.length > 1) {
      for (let i = 0; i < this.polylinePoints.length - 1; i++) {
        let pt1 = this.polylinePoints.items[i]
        let pt2 = this.polylinePoints.items[i + 1]
        this.s.line(pt1.x, pt1.y, pt2.x, pt2.y)
      }
    }
  }
}
