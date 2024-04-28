import { BaseVehicle } from '@/classes/BaseVehicle'
import P5 from 'p5'

export class MovingTarget extends BaseVehicle {
  constructor(sketch, targetRadius = 10, x = 0, y = 0) {
    super(sketch, x, y)
    this.randomizeLocation()
    this.targetRadius = targetRadius
  }

  draw() {
    this.update()
    this.s.circle(this.position.x, this.position.y, this.targetRadius * 2)
  }
}
