import React from 'react'

export type ColumnWidth = string | number

export type Cell = {
  col: number
  row: number
}

export type Selection = { min: Cell; max: Cell }

export type Column<T> = {
  title?: React.ReactNode
  width: ColumnWidth
  minWidth: number
  maxWidth?: number
  renderWhenScrolling: boolean
  // render: ColumnRenderFunction<TRow>
  disableKeys: boolean
  disabled: boolean | (({ rowData }: { rowData: T }) => boolean)
  keepFocus: boolean
  deleteValue: ({ rowData }: { rowData: T }) => T
  copyValue: ({ rowData }: { rowData: T }) => number | string | null
  pasteValue: ({ rowData, value }: { rowData: T; value: string }) => T
}

export type ListItemData<T> = {
  data: T[]
  contentWidth?: number
  columns: Column<T>[]
  hasStickyRightColumn: boolean
  activeCell: Cell | null
  selectionMinRow?: number
  selectionMaxRow?: number
}

export type HeaderContextType<T> = {
  columns: Column<T>[]
  contentWidth?: number
  hasStickyRightColumn: boolean
  height: number
  activeColMin?: number
  activeColMax?: number
}

export type SelectionContextType = {
  columnRights?: number[]
  columnWidths?: number[]
  activeCell: Cell | null
  selection: Selection | null
  dataLength: number
  rowHeight: number
  hasStickyRightColumn: boolean
  headerRowHeight: number
  viewWidth?: number
  viewHeight?: number
  contentWidth?: number
  edges: { top: boolean; right: boolean; bottom: boolean; left: boolean }
}

export type RowProps<T> = {
  index: number
  data: T
  style: React.CSSProperties
  isScrolling?: boolean
  columns: Column<T>[]
  hasStickyRightColumn: boolean
  active: boolean
}

export type SimpleColumn<T> = Partial<
  Pick<Column<T>, 'title' | 'maxWidth' | 'minWidth' | 'width'>
>

export type AddRowsComponentProps = {
  addRows: (count?: number) => void
}

export type DataSheetGridProps<T> = {
  data?: T[]
  onChange?: (value: T[]) => void
  columns?: Partial<Column<T>>[]
  gutterColumn?: SimpleColumn<T>
  stickyRightColumn?: SimpleColumn<T>
  height?: number
  rowHeight?: number
  headerRowHeight?: number
  addRowsComponent?: (props: AddRowsComponentProps) => JSX.Element
  createRow?: () => T
  duplicateRow?: ({ rowData }: { rowData: T }) => T
  isRowEmpty?: ({ rowData }: { rowData: T }) => boolean
  autoAddRow?: boolean
  lockRows?: boolean
}
