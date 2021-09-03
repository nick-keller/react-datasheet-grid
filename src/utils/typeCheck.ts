import { Cell, Column, Selection } from '../types'

export const getCell = (
  value: any,
  colMax: number,
  rowMax: number,
  columns: Column<any, any>[]
): Cell | null => {
  if (value === null || !colMax || !rowMax) {
    return null
  }

  if (typeof value !== 'object') {
    throw new Error('Value must be an object or null')
  }

  const colIndex = columns.findIndex((column) => column.id === value.col)

  const cell: Cell = {
    col: Math.max(
      0,
      Math.min(colMax - 1, colIndex === -1 ? Number(value.col) : colIndex - 1)
    ),
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
  rowMax: number,
  columns: Column<any, any>[]
): Selection | null => {
  if (value === null || !colMax || !rowMax) {
    return null
  }

  if (typeof value !== 'object') {
    throw new Error('Value must be an object or null')
  }

  const selection = {
    min: getCell(value.min, colMax, rowMax, columns),
    max: getCell(value.max, colMax, rowMax, columns),
  }

  if (!selection.min || !selection.max) {
    throw new Error('min and max must be defined')
  }

  return selection as Selection
}
