import P5 from 'p5'
import { LimitedArray } from './UtilityClasses'

export const VehicleActions = Object.freeze({
  STEER: 0,
})

export class BaseVehicle {
  constructor(sketch, x = 0, y = 0) {
    this.s = sketch
    this.position = this.s.createVector(x, y)
    this.previousPositions = new LimitedArray(20)
    this.previousPositions.push(this.position.copy())

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
    this.position.add(this.velocity)
    if (this.velocity.mag() < 0.00001){
      this.velocity.mult(0)
    }
    this.acceleration.mult(0)
  }

  applyForce(force = this.s.createVector(0, 0)) {
    let acceleration = P5.Vector.div(force, this.mass)
    this.acceleration.add(acceleration)
    if (this.acceleration.mag() < 0.00001){
      this.acceleration.mult(0)
    }
  }

  applyFriction() {
    // this is a simplified solution that roughly models real world behavior and assumes the canvas is "flat"
    let friction = P5.Vector.copy(this.velocity)
    friction.mult(-1).normalize().mult(this.coefOfFrict)
    this.applyForce(friction)
  }

  // Logic to select behavior may be appropriate in this class, or may be more appropriate in extensions of this class
  // based on the application desired in its implementations
  // DECIDE LATER

  //Vehicles Logic
  // selectAction(action,steering=this.s.createVector(0,0)){
  //     if (action == VehicleActions.STEER){
  //         this.steer()
  //     }
  // }

  seak(targetPosition = this.s.createVector(0, 0)) {
    let desiredVelocity = P5.Vector.sub(targetPosition, this.position)
    desiredVelocity.normalize().mult(this.maxVelocity)
    let steer = P5.Vector.sub(desiredVelocity, this.velocity)
    steer.limit(this.maxSteerForce)
    this.applyForce(steer)
  }

  wander() {
    let circleCenter = undefined
    if (this.velocity.mag() == 0) {
      circleCenter = this.position
    } else {
      circleCenter = P5.Vector.add(
        this.position,
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

  steerWithinBounds(
    min = this.s.createVector(0, 0),
    max = this.s.createVector(this.s.width, this.s.height),
  ) {
    let aboveBounds = false
    let belowBounds = false
    let leftOfBounds = false
    let rightOfBounds = false
    if (this.position.x < min.x){
      leftOfBounds = true
    } else if (this.position.x > max.x){
      rightOfBounds = true
    }
    if (this.position.y < min.y){
      aboveBounds = true //above and below are relative to +y axis pointing downward
    } else if (this.position.y > max.y){
      belowBounds = true
    }
    if (!aboveBounds && !belowBounds && !leftOfBounds && !rightOfBounds){
      return
    }
    let steer = this.velocity.copy()
    if (aboveBounds){
      steer.y = min.y - this.position.y
    } else if (belowBounds){
      steer.y = max.y - this.position.y
    }
    if (rightOfBounds){
      steer.x = max.x - this.position.x
    } else if (leftOfBounds){
      steer.x = min.x - this.position.x
    }
    let target = P5.Vector.add(this.position,steer)
    // this.applyForce(steer)
    this.seak(target)
  }

  randomizeLocation() {
    let randomX = this.s.random(0, this.s.width)
    let randomY = this.s.random(0, this.s.height)
    this.position = this.s.createVector(randomX, randomY)
  }

  get x() {
    return this.position.x
  }
  get y() {
    return this.position.y
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
