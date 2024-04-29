import { BaseVehicle } from '@/classes/BaseVehicle'
import P5 from 'p5'

export class MovingTarget extends BaseVehicle {
  constructor(sketch, targetRadius = 10, x = 0, y = 0) {
    super(sketch, x, y)
    this.randomizeLocation()
    this.targetRadius = targetRadius
    this.boundsMin = this.s.createVector(this.s.width/4,this.s.height/4),
    this.boundsMax = this.s.createVector(this.s.width * (3/4),this.s.height * (3/4))
  }

  draw() {
    this.steerWithinBounds(
        this.boundsMin,
        this.boundsMax
    )
    this.update()
    this.s.circle(this.position.x, this.position.y, this.targetRadius * 2)
  }
}
