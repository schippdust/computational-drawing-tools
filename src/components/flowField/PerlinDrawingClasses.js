class PerlinPathCollection {
  constructor(_sketch, _colorGrid) {
    this.s = _sketch
    this.paths = []
    this.time = 0
    this.colorGrid = _colorGrid
  }

  update(_time) {
    this.time = _time
    // console.log(this)
    let i = this.paths.length
    while (i--) {
      let path = this.paths[i]
      if (path.lifeExpectancy < path.age) {
        this.paths.splice(i, 1)
        continue
      }
      path.noisyMovement(this.time)
      path.draw()

      path.age++
    }
  }

  addPath(_xPosition, _yPosition, _scale) {
    let fillColor = this.colorGrid.colorFromCell
    let newPath = new PerlinPath(
      this.s,
      _xPosition,
      _yPosition,
      _scale,
      fillColor,
    )
    // console.log(newPath)
    this.paths.push(newPath)
  }
}

class PerlinPath {
  constructor(_sketch, _xPosition, _yPosition, _scale, _fillColor) {
    this.s = _sketch
    this.x = _xPosition
    this.y = _yPosition
    this.lifeExpectancy = Math.round(this.s.random(80, 160))
    this.age = 0
    this.ytOffset = 10000
    this.velocity = -1
    this.acceleration = -0.2
    this.noiseScale = _scale
    this.fillColor = _fillColor
    // console.log(_fillColor);
  }

  noisyMovement() {
    let noiseRadians = this.s.map(
      this.s.noise(
        this.x * this.noiseScale,
        (this.y + this.ytOffset) * this.noiseScale,
      ),
      0,
      1,
      -2 * Math.PI,
      4 * Math.PI,
    )
    // console.log('noise radians',noiseRadians)
    this.noise = noiseRadians
    let noiseVect = this.s.createVector(
      Math.cos(noiseRadians) * this.velocity,
      Math.sin(noiseRadians) * this.velocity,
    )
    this.x += noiseVect.x
    this.y += noiseVect.y
    this.velocity += this.acceleration
  }

  draw() {
    this.s.stroke(this.fillColor)
    this.s.fill(this.fillColor)
    this.s.ellipse(this.x, this.y, 1, 1)
  }
}

class ColorGrid {
  constructor(_sketch, _cellSize) {
    this.s = _sketch
    this.blackThreshold = 600

    this.aproxCellSize = _cellSize
    this.columnCount = Math.round(this.s.width / _cellSize)
    this.rowCount = Math.round(this.s.height / _cellSize)
    this.actualHeight = this.s.height / this.rowCount
    this.actualWidth = this.s.width / this.columnCount
    this.createCells()

    //try not to have too many cells, it could slow down performance for little gain
    this.cellCount = this.columnCount * this.rowCount
    console.log('color grid initialized', this)
  }
  addUpdateColors(_light, _dark) {
    this.lightColor = this.s.color(_light.r, _light.g, _light.b)
    this.darkColor = this.s.color(_dark.r, _dark.g, _dark.b)
  }
  createCells() {
    this.cells = []
    let cellCounter = 0

    for (let i = 0; i < this.rowCount; i++) {
      for (let j = 0; j < this.columnCount; j++) {
        let cell = {
          id: cellCounter,
          lineCount: 0,
        }

        this.cells.push(cell)
        cellCounter++
      }
    }
  }

  get colorFromCell() {
    let index = this.xyIndex
    if (index < 0) {
      index = 0
    } else if (index >= this.cellCount) {
      index = this.cellCount - 1
    } else {
      this.cells[index].lineCount++
    }
    let lerpRatio = this.cells[index].lineCount / this.blackThreshold
    let lerpedColor = this.s.lerpColor(
      this.lightColor,
      this.darkColor,
      lerpRatio,
    )
    return lerpedColor
  }

  get xyIndex() {
    let index = 0
    let rowsDown = Math.floor(this.s.mouseY / this.actualHeight)
    index = index + rowsDown * this.columnCount
    let columnsOver = Math.floor(this.s.mouseX / this.actualWidth)
    index = index + columnsOver
    // console.log(index)
    return index
  }
}

export { PerlinPathCollection, PerlinPath, ColorGrid }
