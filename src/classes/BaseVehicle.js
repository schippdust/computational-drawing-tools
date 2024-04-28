import P5 from 'p5'
export const VehicleActions = Object.freeze({
  STEER: 0,
})

export class BaseVehicle {
  constructor(sketch, x = 0, y = 0) {
    this.s = sketch
    this.position = this.s.createVector(x, y)
    this.velocity = this.s.createVector(0, 0)
    this.acceleration = this.s.createVector(0, 0)
    this.frictionalLoss = 0.1
    this.maxVelocity = 2
  }

  applyForce(force = this.s.createVector(0, 0)) {
    this.acceleration = this.acceleration.add(force)
  }

  //Vehicles Logic
  // selectAction(action,steering=this.s.createVector(0,0)){
  //     if (action == VehicleActions.STEER){
  //         this.steer()
  //     }
  // }

  steer(targetPosition = this.s.createVector(0, 0)) {
    let desiredVelocity = P5.Vector.sub(targetPosition, this.position)
    desiredVelocity.normalize()
    desiredVelocity.mult(this.maxVelocity)
    let steer = P5.Vector.sub(desiredVelocity, this.velocity)
    this.applyForce(steer)
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
}