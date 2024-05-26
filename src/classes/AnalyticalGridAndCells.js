import P5 from 'p5'
import { Rectangle } from './Geometry'
import { BaseSketchElement } from './BaseSketchElement'
import { QuadTree } from './QuadTree'

export class AnalyticalGridCell extends BaseSketchElement {
  constructor(sketch, x, y, w, h, i, j, params) {
    super(sketch, x + w / 2, y + h / 2)
    this.rectangle = Rectangle(sketch, x, y, w, h)
    this.i = i
    this.j = j
    this.data = {}
    for (let param of dataParams) {
      this.data[param] = 0
    }
  }
}

export class AnalyticalGrid extends BaseSketchElement {
  constructor(sketch, cellDim, numericalParams = ['eventCount']) {
    super(sketch, 0, 0)

    this.cellDim = cellDim
    this.cells = []

    let width = this.s.width
    let height = this.s.height
    // this breaks down if the canvas is smaller than the grid dim

    this.xMargin = undefined
    this.yMargin = undefined
    this.columnCount = undefined
    this.rowCount = undefined
    this.minX = undefined
    this.minY = undefined
    this.instantiateCells(numericalParams)
  }

  instantiateCells(numericalParams) {
    this.xMargin = (width % cellDim) / 2
    this.yMargin = (height % cellDim) / 2
    let xCursor = this.xMargin
    let yCursor = this.yMargin
    this.columnCount = Math.floor(width / cellDim)
    this.rowCount = Math.floor(height / cellDim)
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
          numericalParams,
        )
        columnCells.push(cell)
        yCursor += this.cellDim
      }
      this.cells.push(columnCells)
      yCursor = this.minY
      xCursor += this.cellDim
    }
  }

  addNumericalParamToCells(param) {
    for (let cell of this.cells) {
      if (!param in cell.data) {
        cell.data[param] = 0
      }
    }
  }

  getCellIndicesByPosition(posVect) {
    let x = posVect.x
    let y = posVect.y
    let i = Math.floor((x + (this.cellDim - this.xMargin)) / this.cellDim)
    let j = Math.floor((y + (this.cellDim - this.yMargin)) / this.cellDim)
    if (i >= 0 && j >= 0) {
      return { i, j }
    } else {
      return undefined
    }
  }

  getCellByPosition(posVect) {
    let indices = this.getCellIndicesByPosition(posVect)
    if (indices == undefined) {
      return undefined
    } else {
      return this.cells[indices.i][indices.j]
    }
  }

  getCellsIntersectingVehicles(vehicles) {
    let identifiedCells = []
    if (!Array.isArray(vehicles)) {
      vehicles = [vehicles]
    }
    for (let vehicle of vehicles) {
      let identifiedCell = this.getCellByPosition(vehicle.originPoint)
      if (identifiedCell && !identifiedCells.includes(identifiedCell)) {
        identifiedCells.push(identifiedCell)
      }
    }
    return identifiedCells
  }

  getNeighborIndicesFromCellIndices(indices) {
    let i = indices.i
    let j = indices.j
    let neighborIndices = []
    if (i != 0 && j != 0) {
      neighborIndices.push({ i: i - 1, j: j - 1 })
    }
    if (j != 0) {
      neighborIndices.push({ i: i, j: j - 1 })
    }
    if (j != 0 && i != this.columnCount - 1) {
      neighborIndices.push({ i: i + 1, j: j - 1 })
    }
    if (i != 0) {
      neighborIndices.push({ i: i - 1, j: j })
    }
    if (i != this.columnCount - 1) {
      neighborIndices.push({ i: i + 1, j: j })
    }
    if (i != 0 && j != this.rowCount - 1) {
      neighborIndices.push({ i: i - 1, j: j + 1 })
    }
    if (j != this.rowCount - 1) {
      neighborIndices.push({ i: i, j: j + 1 })
    }
    if (i != this.columnCount - 1 && j != this.rowCount - 1) {
      neighborIndices.push({ i: i + 1, j: j + 1 })
    }
    return neighborIndices
  }

  getCellNeighbors(cell, includeSourceCell = false) {
    let indices = { i: cell.i, j: cell.j }
    let neighborIndices = getNeighborIndicesFromCellIndices(indices)
    let neighbors = []
    if (includeSourceCell) {
      neighbors.push(cell)
    }
    neighborIndices.forEach((indices) => {
      neighbors.push(this.cells[indices.i][indices.j])
    })
    return neighbors
  }

  getMultipleCellNeighbors(cells, includeSourceCells = false) {
    setOfNeighbors = []
    for (let cell of cells) {
      let cellNeighbors = this.getCellNeighbors(cell, includeSourceCells)
      cellNeighbors.forEach((cell) => {
        if (!setOfNeighbors.includes(cell)) {
          setOfNeighbors.push(cell)
        }
      })
    }
    if (!includeSourceCells) {
      setOfNeighbors.filter((neighbor) => {
        return !cells.includes(neighbor)
      })
    }
    return setOfNeighbors
  }
}
