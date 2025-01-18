import { createUUID } from '@/store/storeUtils'
import P5 from 'p5'

export class PointRecord {
  constructor(log, pt) {
    this.uuid = createUUID()
    this.log = log
    this.pt = pt
  }

  static createCsvRecord(uuid, pt) {
    let record = ''
    try {
      record = `${uuid},point,${pt.x},${pt.y}\r\n`
    } catch {
      record = `${uuid},ERROR,could not resolve point geometry\r\n`
    }
    return record
  }

  get csvRecord() {
    return PointRecord.createCsvRecord(this.uuid, this.pt)
  }
}

export class LinkRecord {
  constructor(log, pt1, pt2) {
    this.uuid = createUUID()
    this.log = log
    this.startPoint = P5.Vector.copy(pt1)
    this.endPoint = P5.Vector.copy(pt2)
  }

  static createCsvRecord(uuid, pt1, pt2) {
    let record = ''
    try {
      record = `${uuid},link,${pt1.x},${pt1.y},${pt2.x},${pt2.y}\r\n`
    } catch {
      record = `${uuid},ERROR,could not resolve point geometry\r\n`
    }
    return record
  }

  get csvRecord() {
    return LinkRecord.createCsvRecord(this.uuid, this.startPoint, this.endPoint)
  }
}

export class PolylineRecord {
  constructor(log, pts) {
    this.uuid = createUUID()
    this.log = log
    this.points = pts
  }

  static createCsvRecord(uuid, pts) {
    let record = ''
    try {
      for (let i in pts) {
        let v = pts[i]
        record += `${uuid},polyline control point,${i},${v.x},${v.y}\r\n`
      }
    } catch {
      record = `${uuid},ERROR,could not resolve polyline geometry`
    }
    return record
  }

  get csvRecord() {
    PolylineRecord.createCsvRecord(this.uuid, this.pts)
  }
}
