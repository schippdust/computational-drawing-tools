import { BaseVehicle } from '@/classes/BaseVehicle'
import { createUUID } from '@/store/storeUtils'
import { ElementGeometryTypes } from '@/classes/BaseSketchElement'
import { LinkRecord } from '@/classes/GeometryRecords'

import P5 from 'p5'
import { Target, TargetTypes } from '@/classes/Target'
import { VehicleCollection } from '@/classes/VehicleCollection'
export class ConnectedWanderer extends BaseVehicle {
  constructor(sketch) {
    super(sketch)
    this.randomizeLocation()
    this.boundsMin = this.s.createVector(0, 0)
    this.boundsMax = this.s.createVector(this.s.width, this.s.height)
    this.wanderRadius = 50
    this.coefOfFrict = 0.3
    this.wanderForwardRatio = 0.5
    this.mass = 10
    this.maxWanderAdjustment = (2 * Math.PI) / 20
  }

  draw(connectionsLog) {
    let records = []
    this.s.stroke(255)
    this.s.fill(0)
    for (let neighbor of this.neighbors) {
      let connectionIds = [this.uuid, neighbor.uuid]
      connectionIds.sort()
      let connectionId = connectionIds.join('-')
      if (!connectionsLog.includes(connectionId)) {
        let record = new LinkRecord(
          connectionId,
          this.originPoint,
          neighbor.originPoint,
        )
        records.push(record)
        this.s.line(
          this.originPoint.x,
          this.originPoint.y,
          neighbor.originPoint.x,
          neighbor.originPoint.y,
        )
      }
    }
    // this.s.circle(this.originPoint.x, this.originPoint.y, 2)
    return records
  }
}

export class AttractorTargets extends Target {
  constructor(sketch, targetRadius = 400, targetType = TargetTypes.ATTRACTOR) {
    super(sketch, targetRadius, targetType)
  }
}

export class AvoidanceTargets extends Target {
  constructor(sketch, targetRadius = 100, targettype = TargetTypes.REPELLER) {
    super(sketch, targetRadius, targetType)
  }
}

export class TracerGenerator extends Target {
  constructor(
    sketch,
    vehicleCollection,
    x,
    y,
    tracerLifespan=100,
    pointGenOffset=40,
    numberOfPoints=10,
    targetRadius = 300,
    targetType = TargetTypes.REPELLER,
  ) {
    super(sketch, targetRadius, targetType, x, y)

    this.pointGenOffset = pointGenOffset
    this.numberOfPoints = numberOfPoints
    this.globalVehicleCollection = vehicleCollection
    this.vehicles = new VehicleCollection(this.s)

    for (let i = 0; i < this.numberOfPoints; i++){
      let rotation = i * ((Math.PI * 2)/this.numberOfPoints)
      let tracerX = x + Math.cos(rotation) * targetRadius
      let tracerY = y + Math.sin(rotation) * targetRadius
      let tracer = new ComplexTracer(this.s,tracerX,tracerY)
      this.vehicles.push(tracer)
      this.globalVehicleCollection.push(tracer)
    }

  }
}

export class ComplexTracer extends BaseVehicle {
  constructor(sketch, x, y) {
    super(sketch, x, y)
    this.geometryType = ElementGeometryTypes.POLYLINE
    this.avoidanceTargets = []
    
  }

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
