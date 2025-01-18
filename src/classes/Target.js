import { BaseVehicle } from '@/classes/BaseVehicle'
import { ElementGeometryTypes } from '@/classes/BaseSketchElement'

export const TargetTypes = Object.freeze({
  ATTRACTOR: 0,
  REPELLER: 1,
})

export class Target extends BaseVehicle {
  constructor(
    sketch,
    targetRadius = 10,
    targetType = TargetTypes.ATTRACTOR,
    x = 0,
    y = 0,
  ) {
    super(sketch, x, y)
    this.geometryType = ElementGeometryTypes.POINT
    this.targetType = targetType
    this.targetRadius = targetRadius
  }
}
