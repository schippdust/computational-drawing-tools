import { BaseSketchElement } from './BaseSketchElement'
import { createUUID } from '@/store/storeUtils'
// A class that acts as a container for vehicles.
// This container should only have methods that operate at the level of
// context.  For example, this list will check for then stop tracking
// vehicles that have expired, but will make no judgements about when
// or what causes should result in an vehicle expiring.

export class VehicleCollection {
  constructor(sketch = undefined) {
    this.uuid = createUUID()
    this.s = sketch
    if (this.s) {
      this.originPoint = this.s.createVector(x, y)
    }
    this.vehicles = []
  }

  [Symbol.iterator]() {
    let index = 0
    const items = this.vehicles
    return {
      // The next() function to iterate through the items
      next: function () {
        return index < items.length
          ? { value: items[index++], done: false }
          : { done: true }
      },
    }
  }

  push(vehicle) {
    this.vehicles.push(vehicle)
  }

  forEach(callback) {
    for (const item of this) {
      callback(item)
    }
  }

  update() {
    this.cullExpired()
    this.generateVehicles()
  }

  cullExpired() {
    this.vehicles.filter((v) => {
      return !v.expired
    })
  }

  generateVehicles() {
    //This function has no built in behavior
    //but can be extended to define sketch specific conditions
    //where this collection should automatically generate new vehicles
    //and add them to itself.
  }

  get length() {
    return this.vehicles.length
  }
}
