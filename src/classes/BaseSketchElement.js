import { createUUID } from '@/store/storeUtils'

export const ElementGeometryTypes = Object.freeze({
  BASECLASS: 0,
  POINT: 1,
  LINE: 2,
  POLYLINE: 3,
})

export class BaseSketchElement {
  constructor(sketch, x = 0, y = 0) {
    this.uuid = createUUID()
    this.s = sketch
    this.originPoint = this.s.createVector(x, y)
    this.geometryType = ElementGeometryTypes.BASECLASS

    this.quadTree = undefined
    this.neighbors = []

    this.sketchMin = this.s.createVector(this.s.width / 4, this.s.height / 4)
    this.sketchMax = this.s.createVector(
      this.s.width * (3 / 4),
      this.s.height * (3 / 4),
    )
  }
}
