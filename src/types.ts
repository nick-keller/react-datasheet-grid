import { FC, ReactNode } from 'react'

export type RowParams<Row> = { rowData: Row; rowIndex: number }

export type Column<Row> = {
  id?: string
  title?: ReactNode
  sticky?: 'left' | 'right' | false | null
  basis: number
  grow: number
  shrink: number
  minWidth: number
  maxWidth?: number
  renderer: CellRenderer<Row>
}

export type CellRenderer<Row> = FC<RowParams<Row>>
export type StaticRowCellRenderer<Row> = FC<{ rowIndex: number, column: Column<Row>}>

export const dsgSymbol = Symbol('dsg')

export const isStaticRow = <Row>(row: any): row is StaticRow<Row> => {
  return row ? row[dsgSymbol] === true : false
}

export const createStaticRow = <Row>(
  row: Omit<StaticRow<Row>, typeof dsgSymbol>
): StaticRow<Row> => ({
  ...row,
  [dsgSymbol]: true,
})

export type StaticRow<Row> = {
  [dsgSymbol]: true
  height?: number
  sticky?: RowStickinessShortHand
  key?: string
  renderer?: StaticRowCellRenderer<Row>
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
  rowData: Row | StaticRow<Row>
}) => ReactNode
