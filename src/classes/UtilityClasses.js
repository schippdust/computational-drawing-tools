export class LimitedArray {
  constructor(maxLength = 20) {
    this.maxLength = maxLength
    this.array = []
  }

  push(item) {
    if (this.array.length >= this.maxLength) {
      this.array.shift()
    }
    this.array.push(item)
  }

  get length() {
    return this.array.length
  }

  toArray() {
    return this.array.slice()
  }
}
