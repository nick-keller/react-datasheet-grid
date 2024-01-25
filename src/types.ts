export type RowParams<Row> = { rowData: Row; rowIndex: number }

export type Column<Row> = {
  sticky?: 'left' | 'right' | false | null
}

export const dsgSymbol = Symbol('dsg')

export const isStaticRow = (row: any): row is StaticRow => {
  return row ? row[dsgSymbol] === true : false
}

export const createStaticRow = (row: Omit<StaticRow, typeof dsgSymbol>): StaticRow => ({
  ...row,
  [dsgSymbol]: true,
})

export type StaticRow = {
  [dsgSymbol]: true
  height?: number
  sticky?: RowStickinessShortHand
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