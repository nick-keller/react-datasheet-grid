import {ReactNode} from "react";

export type RowParams<Row> = { rowData: Row; rowIndex: number }

export type Column<Row> = {
  id?: string
  sticky?: 'left' | 'right' | false | null
  basis: number
  grow: number
  shrink: number
  minWidth: number
  maxWidth?: number
}

export const dsgSymbol = Symbol('dsg')

export const isStaticRow = (row: any): row is StaticRow => {
  return row ? row[dsgSymbol] === true : false
}

export const createStaticRow = (
  row: Omit<StaticRow, typeof dsgSymbol>
): StaticRow => ({
  ...row,
  [dsgSymbol]: true,
})

export type StaticRow = {
  [dsgSymbol]: true
  height?: number
  sticky?: RowStickinessShortHand
  key?: string
}

export type RowStickiness = {
  position: 'top' | 'bottom'
  level: number
}

export type RowStickinessShortHand =
  | RowStickiness
  | 'top'
  | 'bottom'
  | boolean
  | number
  | null
  | undefined

export type RowStickinessFn<Row> = (
  opts: RowParams<Row>
) => RowStickinessShortHand

export type Cell = {
  col: number
  row: number
}

export type ScrollBehavior = {
  doNotScrollX?: boolean
  doNotScrollY?: boolean
}

export type Cursor<Row> = (opts: {
  cell: Cell
  column: Column<Row>
  rowData: Row | StaticRow
}) => ReactNode
