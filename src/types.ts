import React from 'react'

export type ColumnWidth = string | number

export type Column<T> = {
  title?: React.ReactNode
  width: ColumnWidth
  minWidth: number
  maxWidth?: number
  renderWhenScrolling: boolean
  // render: ColumnRenderFunction<TRow>
  // disableKeys: boolean
  // disabled: boolean | (({ rowData }: { rowData: TRow }) => boolean)
  // keepFocus: boolean
  // deleteValue: ({ rowData }: { rowData: TRow }) => TRow
  // copyValue: ({ rowData }: { rowData: TRow }) => number | string | null
  // pasteValue: ({ rowData, value }: { rowData: TRow; value: string }) => TRow
}

export type ListItemData<T> = {
  data: T[]
  contentWidth?: number
  columns: Column<T>[]
  hasStickyRightColumn: boolean
}

export type HeaderContextType<T> = {
  columns: Column<T>[]
  contentWidth?: number
  hasStickyRightColumn: boolean
  height: number
}

export type RowProps<T> = {
  index: number
  data: T
  style: React.CSSProperties
  isScrolling?: boolean
  columns: Column<T>[]
  hasStickyRightColumn: boolean
}

export type DataSheetGridProps<T> = {
  data?: T[]
  onChange?: (value: T[]) => void
  columns?: Partial<Column<T>>[]
  gutterColumn?: Partial<
    Pick<Column<T>, 'title' | 'maxWidth' | 'minWidth' | 'width'>
  >
  stickyRightColumn?: Partial<
    Pick<Column<T>, 'title' | 'maxWidth' | 'minWidth' | 'width'>
  >
  height?: number
  rowHeight?: number
  headerRowHeight?: number
}
