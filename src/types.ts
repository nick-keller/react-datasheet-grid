export type RowParams<Row> = { rowData: Row; rowIndex: number }

export type Column<Row> = {
  id: string
  sticky?: 'left' | 'right' | false | null
}

export type RowStickiness = {
  position: 'top' | 'bottom'
  level: number
}

export type RowStickinessFn<Row> = (opts: RowParams<Row>) => RowStickiness | boolean | number | null | undefined