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
    this.acceleration.mult(0)
  }

  applyFriction() {
    // this is a simplified solution that roughly models real world behavior and assumes the canvas is "flat"
    let friction = P5.Vector.copy(this.velocity)
    friction.mult(-1).normalize().mult(this.coefOfFrict)
    this.applyForce(friction)
  }

  applyForce(force = this.s.createVector(0, 0)) {
    let acceleration = P5.Vector.div(force, this.mass)
    this.acceleration.add(acceleration)
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
