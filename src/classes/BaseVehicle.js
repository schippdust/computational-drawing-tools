import P5 from 'p5'
import { LimitedArray } from './UtilityClasses'
import { createUUID } from '@/store/storeUtils'

export const VehicleActions = Object.freeze({
  STEER: 0,
})

export const GeometryTypes = Object.freeze({
  POINT: 0,
  LINE: 1,
  POLYLINE: 2,
})

export class BaseVehicle {
  constructor(sketch, x = 0, y = 0) {
    this.uuid = createUUID()
    this.s = sketch
    this.basePoint = this.s.createVector(x, y)
    this.secondPoint = undefined
    this.geometryType = GeometryTypes.POINT
    this.polylinePoints = new LimitedArray(20)

    this.velocity = this.s.createVector(0, 0)
    this.coefOfFrict = 0.7

    this.acceleration = this.s.createVector(0, 0)
    this.mass = 10

    this.maxVelocity = 10
    this.maxSteerForce = 5
    // this.maxAcceleration = 1 // not currently in use, consider implementing later if required

    this.wanderRadius = 50
    this.wanderForwardRatio = 9 / 10
    this.maxWanderAdjustment = (2 * Math.PI) / 10
    this.wanderPointRadians = this.s.random(0, 2 * Math.PI)
  }

  update(applyFriction = true) {
    if (applyFriction) {
      this.applyFriction()
    }
    this.velocity.add(this.acceleration).limit(this.maxVelocity)
    this.basePoint.add(this.velocity)
    if (this.velocity.mag() < 0.00001) {
      this.velocity.mult(0)
    }
    this.acceleration.mult(0)
    this.polylinePoints.push(this.basePoint.copy())
  }

  applyForce(force = this.s.createVector(0, 0)) {
    let acceleration = P5.Vector.div(force, this.mass)
    this.acceleration.add(acceleration)
    if (this.acceleration.mag() < 0.00001) {
      this.acceleration.mult(0)
    }
  }

  applyFriction() {
    // this is a simplified solution that roughly models real world behavior and assumes the canvas is "flat"
    let friction = P5.Vector.copy(this.velocity)
    friction.mult(-1).normalize().mult(this.coefOfFrict)
    this.applyForce(friction)
  }

  seak(targetPosition = this.s.createVector(0, 0)) {
    let desiredVelocity = P5.Vector.sub(targetPosition, this.basePoint)
    desiredVelocity.normalize().mult(this.maxVelocity)
    let steer = P5.Vector.sub(desiredVelocity, this.velocity)
    steer.limit(this.maxSteerForce)
    this.applyForce(steer)
  }

  wander() {
    let circleCenter = undefined
    if (this.velocity.mag() == 0) {
      circleCenter = this.basePoint
    } else {
      circleCenter = P5.Vector.add(
        this.basePoint,
        this.velocity
          .copy()
          .setMag(this.wanderRadius * this.wanderForwardRatio),
      )
    }
    let targetX = Math.cos(this.wanderPointRadians) * this.wanderRadius
    let targetY = Math.sin(this.wanderPointRadians) * this.wanderRadius
    let targetPoint = this.s.createVector(targetX, targetY).add(circleCenter)
    this.seak(targetPoint)
    this.wanderPointRadians += this.s.random(
      this.maxWanderAdjustment * -1,
      this.maxWanderAdjustment,
    )
  }

  arrive(targetPosition = this.s.createVector(0, 0)) {
    let desiredVelocity = P5.Vector.sub(targetPosition, this.basePoint)
    let desiredMagnitude = desiredVelocity.mag()
    desiredVelocity.normalize()

    let maxAccel = Math.sqrt(this.maxSteerForce / this.mass)
    let extraFrames = 3
    let framesToStop = this.maxVelocity / maxAccel + extraFrames
    let decelRadius = framesToStop * this.maxVelocity

    if (desiredMagnitude < decelRadius) {
      let mappedMagnitude = this.s.map(
        desiredMagnitude,
        0,
        decelRadius,
        0,
        this.maxVelocity,
      )
      desiredVelocity.mult(mappedMagnitude)
    } else {
      desiredVelocity.mult(this.maxVelocity)
    }
    let steer = P5.Vector.sub(desiredVelocity, this.velocity)
    steer.limit(this.maxSteerForce)
    this.applyForce(steer)
  }

  steerToWithinBounds(
    min = this.s.createVector(0, 0),
    max = this.s.createVector(this.s.width, this.s.height),
  ) {
    let aboveBounds = false
    let belowBounds = false
    let leftOfBounds = false
    let rightOfBounds = false
    if (this.basePoint.x < min.x) {
      leftOfBounds = true
    } else if (this.basePoint.x > max.x) {
      rightOfBounds = true
    }
    if (this.basePoint.y < min.y) {
      aboveBounds = true //above and below are relative to +y axis pointing downward
    } else if (this.basePoint.y > max.y) {
      belowBounds = true
    }
    if (!aboveBounds && !belowBounds && !leftOfBounds && !rightOfBounds) {
      return
    }
    let steer = this.velocity.copy()
    if (aboveBounds) {
      steer.y = min.y - this.basePoint.y
    } else if (belowBounds) {
      steer.y = max.y - this.basePoint.y
    }
    if (rightOfBounds) {
      steer.x = max.x - this.basePoint.x
    } else if (leftOfBounds) {
      steer.x = min.x - this.basePoint.x
    }
    let target = P5.Vector.add(this.basePoint, steer)
    // this.applyForce(steer)
    this.seak(target)
  }

  randomizeLocation() {
    let randomX = this.s.random(0, this.s.width)
    let randomY = this.s.random(0, this.s.height)
    this.basePoint = this.s.createVector(randomX, randomY)
  }

  get csvRecord() {
    let record = '\r\n'
    if (this.geometryType == GeometryTypes.POINT) {
      try {
        record = `${this.uuid},point,${this.basePoint.x},${this.basePoint.y}\r\n`
      } catch {
        record = `${this.uuid},ERROR,could not resolve point geometry\r\n`
      }
    } else if (this.geometryType == GeometryTypes.LINE) {
      try {
        record = `${this.uuid},line,${this.basePoint.x},${this.basePoint.y},${this.secondPoint.x},${this.secondPoint.y}\r\n`
      } catch {
        record = `${this.uuid},ERROR,could not resolve line geometry`
      }
    } else if (this.geometryType == GeometryTypes.POLYLINE) {
      try {
        record = ''
        for (let i in this.polylinePoints.items) {
          let v = this.polylinePoints.items[i]
          record += `${this.uuid},polyline control point,${i},${v.x},${v.y}\r\n`
        }
      } catch {
        record = `${this.uuid},ERROR,could not resolve polyline geometry`
      }
    } else {
      record = `${this.uuid},ERROR,geometry type enum did not match draw condition`
    }
    return record
  }

  get x() {
    return this.basePoint.x
  }
  get y() {
    return this.basePoint.y
  }
  get xVel() {
    return this.velocity.x
  }
  get yVel() {
    return this.velocity.y
  }
  get xAcc() {
    return this.acceleration.x
  }
  get yAcc() {
    return this.acceleration.y
  }
  get telemetry() {
    return {
      x: this.x,
      y: this.y,
      xVel: this.xVel,
      yVel: this.yVel,
      xAcc: this.xAcc,
      yAcc: this.yAcc,
    }
  }
}
