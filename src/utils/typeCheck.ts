import { Cell, CellWithId, Column, Selection, SelectionWithId } from '../types'

export const getCell = (
  value: any,
  colMax: number,
  rowMax: number,
  columns: Column<any, any, any>[]
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

export const getCellWithId = (
  cell: Cell | null,
  columns: Column<any, any, any>[]
): typeof cell extends null ? CellWithId | null : CellWithId =>
  cell
    ? {
        col: cell.col,
        row: cell.row,
        colId: columns[cell.col + 1]?.id,
      }
    : (null as never)

export const getSelection = (
  value: any,
  colMax: number,
  rowMax: number,
  columns: Column<any, any, any>[]
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

export const getSelectionWithId = (
  selection: Selection | null,
  columns: Column<any, any, any>[]
): SelectionWithId | null =>
  selection
    ? {
        min: getCellWithId(selection.min, columns),
        max: getCellWithId(selection.max, columns),
      }
    : null
