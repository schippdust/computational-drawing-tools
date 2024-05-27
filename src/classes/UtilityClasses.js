export class LimitedArray {
  constructor(maxLength = 20) {
    this.maxLength = maxLength
    this.items = []
  }

  [Symbol.iterator]() {
    let index = 0
    const items = this.items
    return {
      // The next() function to iterate through the items
      next: function () {
        return index < items.length
          ? { value: items[index++], done: false }
          : { done: true }
      },
    }
  }

  push(item) {
    if (this.items.length >= this.maxLength) {
      this.items.shift()
    }
    this.items.push(item)
  }

  forEach(callback) {
    for (const item of this) {
      callback(item)
    }
  }

  filter(predicate) {
    const filteredItems = []
    for (const item of this) {
      if (predicate(item)) {
        filteredItems.push(item)
      }
    }
    let newArray = new LimitedArray(this.maxLength)
    newArray.items = filteredItems
    return newArray
  }

  map(callback) {
    const mappedItems = []
    for (const item of this) {
      mappedItems.push(callback(item))
    }
    let newArray = new LimitedArray(this.maxLength)
    newArray.items = mappedItems
    return mappedItems
  }

  get length() {
    return this.items.length
  }

  toArray() {
    return this.items.slice()
  }
}

export function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max)
}
