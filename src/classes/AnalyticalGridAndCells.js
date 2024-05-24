import P5 from 'p5'
import { Rectangle } from './Geometry'
import { BaseSketchElement } from './BaseSketchElement'
import { QuadTree } from './QuadTree'

export class AnalyticalGridCell extends BaseSketchElement {
  constructor(sketch, x, y, w, h, i, j) {
    super(sketch, x + w / 2, y + h / 2)
    this.rectangle = Rectangle(sketch, x, y, w, h)
    this.i = i
    this.j = j
  }
}

export class AnalyticalGrid extends BaseSketchElement {
  constructor(sketch, cellDim) {
    super(sketch, 0, 0)

    this.cellDim = cellDim
    this.cells = []

    let width = this.s.width
    let height = this.s.height
    // this breaks down if the canvas is smaller than the grid dim
    this.xMargin = (width % cellDim) / 2
    this.yMargin = (height % cellDim) / 2
    let xCursor = this.xMargin
    let yCursor = this.yMargin
    this.columnCount = this.s.floor(width / cellDim)
    this.rowCount = this.s.floor(height / cellDim)
    if (this.xMargin > 0) {
      this.columnCount += 2
      xCursor += this.xMargin
      xCursor -= this.cellDim
    }
    if (this.yMargin > 0) {
      this.rowCount += 2
      yCursor += this.yMargin
      yCursor -= this.cellDim
    }

    this.minX = xCursor
    this.minY = yCursor

    for (let i = 0; i < this.colCount; i++) {
      let columnCells = []
      for (let j = 0; j < this.rowCount; j++) {
        let cell = new AnalyticalGridCell(
          this.s,
          xCursor,
          yCursor,
          this.cellDim,
          this.cellDim,
          i,
          j,
        )
        columnCells.push(cell)
        yCursor += this.cellDim
      }
      this.cells.push(columnCells)
      yCursor = this.minY
      xCursor += this.cellDim
    }
  }

  calculateIndexByPosition(posVect){
    let x = posVect.x
    let y = posVect.y
    
  }

  getCellByPosition(posVect) {
    let x = posVect.x
    let y = posVect.y
    let xCursor = this.minX
    let yCursor = this.minY
    for (let i = 0; i < this.colCount; i++) {
      for (let j = 0; j < this.rowCount; j++) {
        let xInRange = x >= xCursor && x < xCursor + this.cellDim
        let yInRange = y >= yCursor && y < yCursor + this.cellDim
        if (xInRange && yInRange) {
          return this.cells[i][j]
          break
        }
        yCursor += this.cellDim
      }
      xCursor += this.cellDim
    }
    return undefined

    // how could I calculate i and j by position?
  }

  queryCellsByVehicles(vehicles) {
    let identifiedCells = []
    if (!Array.isArray(vehicles)) {
      vehicles = [vehicles]
    }
    for (let vehicle of vehicles){
      let identifiedCell = this.getCellByPosition(vehicle.originPoint)
      if (identifiedCell && !identifiedCells.includes(identifiedCell)){
        identifiedCells.push(identifiedCell)
      }
    }
    return identifiedCells
  }
}
