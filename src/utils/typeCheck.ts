import { Cell, Selection } from '../types'

export const getCell = (
  value: any,
  colMax: number,
  rowMax: number
): Cell | null => {
  if (value === null || !colMax || !rowMax) {
    return null
  }

  if (typeof value !== 'object') {
    throw new Error('Value must be an object or null')
  }

  const cell: Cell = {
    col: Math.max(0, Math.min(colMax - 1, Number(value.col))),
    row: Math.max(0, Math.min(rowMax - 1, Number(value.row))),
  }

  if (isNaN(cell.col) || isNaN(cell.row)) {
    throw new Error('col or cell are not valid positive numbers')
  }

  return cell
}

export const getSelection = (
  value: any,
  colMax: number,
  rowMax: number
): Selection | null => {
  if (value === null || !colMax || !rowMax) {
    return null
  }

  if (typeof value !== 'object') {
    throw new Error('Value must be an object or null')
  }

  const selection = {
    min: getCell(value.min, colMax, rowMax),
    max: getCell(value.max, colMax, rowMax),
  }

  if (!selection.min || !selection.max) {
    throw new Error('min and max must be defined')
  }

  return selection as Selection
}
