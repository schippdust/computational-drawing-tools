import P5 from 'p5'
import { Rectangle } from './Geometry'
import { BaseSketchElement } from './BaseSketchElement'
import { QuadTree } from './QuadTree'

export class AnalyticalGridCell extends BaseSketchElement {
  constructor(sketch, x, y, w, h) {
    super(sketch, x + w / 2, y + h / 2)
    this.rectangle = Rectangle(sketch, x, y, w, h)
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
      xCursor -= this.xMargin
    }
    if (this.yMargin > 0) {
      this.rowCount += 2
      yCursor -= this.yMargin
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
        )
        columnCells.push(cell)
        yCursor += this.cellDim
      }
      this.cells.push(columnCells)
      yCursor = this.minY
      xCursor += this.cellDim
    }
  }

  getCellByPosition(posVect){

  }
  
  queryCellsByVehicles(vehicles){
    if (!Array.isArray(vehicles)){
      vehicles = [vehicles]
    }


  }
}
