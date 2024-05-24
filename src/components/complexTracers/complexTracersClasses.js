import { BaseVehicle } from '@/classes/BaseVehicle'
import { createUUID } from '@/store/storeUtils'
import { ElementGeometryTypes } from '@/classes/BaseSketchElement'
import P5 from 'p5'
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

export class LinkRecord {
  constructor(log, pt1, pt2) {
    this.uuid = createUUID()
    this.log = log
    this.startPoint = P5.Vector.copy(pt1)
    this.endPoint = P5.Vector.copy(pt2)
  }

  get csvRecord() {
    let record = '\r\n'
    try {
      record = `${this.uuid},link,${this.log},${this.startPoint.x},${this.startPoint.y},${this.endPoint.x},${this.endPoint.y}\r\n`
    } catch {
      record = `${this.uuid},ERROR,could not resolve point geometry\r\n`
    }
    return record
  }
}
