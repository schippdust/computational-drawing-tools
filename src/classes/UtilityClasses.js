export class LimitedArray {
  constructor(maxLength = 20) {
    this.maxLength = maxLength
    this.items = []
  }

  push(item) {
    if (this.items.length >= this.maxLength) {
      this.items.shift()
    }
    this.items.push(item)
  }

  get length() {
    return this.items.length
  }

  toArray() {
    return this.items.slice()
  }
}
