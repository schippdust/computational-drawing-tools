//Geometry utilities to use in different
import { clamp } from './UtilityClasses'

export class Rectangle {
  constructor(x, y, w, h, sketch) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this.s = sketch
  }

  contains(point, tiled = false) {
    if (tiled) {
      return (
        point.x >= this.x &&
        point.x < this.x + this.w &&
        point.y >= this.y &&
        point.y < this.y + this.h
      )
    } else {
      return (
        point.x >= this.x &&
        point.x <= this.x + this.w &&
        point.y >= this.y &&
        point.y <= this.y + this.h
      )
    }
  }

  intersectsCircle(point, radius) {
    let closestX = clamp(point.x, this.x, this.x + this.w)
    let closestY = clamp(point.y, this.y, this.y + this.h)

    let distance = this.s.dist(point.x, point.y, closestX, closestY)

    return distance < radius
  }
}
