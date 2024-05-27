import { BaseVehicle } from '@/classes/BaseVehicle'
import { ElementGeometryTypes } from '@/classes/BaseSketchElement'
import P5 from 'p5'

export class MovingTarget extends BaseVehicle {
  constructor(
    sketch,
    targetRadius = 10,
    x = 0,
    y = 0,
    constrainOrthogonally = false,
  ) {
    super(sketch, x, y)
    this.constrainOrthogonally = constrainOrthogonally
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
    this.s.circle(this.originPoint.x, this.originPoint.y, this.targetRadius * 2)
  }
}

export class Tracer extends BaseVehicle {
  constructor(sketch, x = 0, y = 0, constrainOrthogonally = false) {
    super(sketch, x, y)
    this.constrainOrthogonally = constrainOrthogonally
  }
  geometryType = ElementGeometryTypes.POLYLINE
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
