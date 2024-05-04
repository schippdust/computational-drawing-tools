import { saveAs } from 'file-saver'

function createUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16),
  )
}

//create full hex from a short format hex
function fullHexFromShort(hex) {
  let r = hex.slice(1, 2)
  let g = hex.slice(2, 3)
  let b = hex.slice(3, 4)

  r = parseInt(r + r, 16)
  g = parseInt(g + g, 16)
  b = parseInt(b + b, 16)

  // return {r, g, b}
  return { r, g, b }
}

function hexToRgb(hex) {
  if (hex.length === 4) {
    return fullHexFromShort(hex)
  }

  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)

  // return {r, g, b}
  return { r, g, b }
}

function getNowAsString() {
  let d = Date.now()
  let time = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(d)
  return time
}

function saveP5CanvasAsImage(drawingName) {
  console.log('saving image')
  let classQueryResults = document.getElementsByClassName('p5Canvas')
  if (classQueryResults.length > 1) {
    console.log(
      'multiple matching classes were found, saving only the first one',
    )
  } else if (classQueryResults.length <= 0) {
    console.log("no matching classes were found, something isn't right")
    return
  }
  let canvas = classQueryResults[0]
  console.log('canvas element identified', canvas)
  canvas.toBlob(function (blob) {
    saveAs(blob, getNowAsString() + ' - ' + drawingName + '.png')
  })
}

function saveCsvData(drawingName, csvDataAsString) {
  let file = new File([csvDataAsString], 'test.csv', {
    type: 'text/csv;charset=utf-8',
  })
  saveAs(file, getNowAsString() + ' - ' + drawingName + '.csv')
}

function saveImageAndCsv(drawingName, csvDataAsString) {
  saveP5CanvasAsImage(drawingName)
  saveCsvData(drawingName, csvDataAsString)
}

export {
  createUUID,
  saveImageAndCsv,
  fullHexFromShort,
  hexToRgb,
  getNowAsString,
  saveP5CanvasAsImage,
}
