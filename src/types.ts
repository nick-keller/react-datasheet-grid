import React from 'react'

export type Cell = {
  col: number
  row: number
}

export type Selection = { min: Cell; max: Cell }

export type CellProps<T, C> = {
  rowData: T
  rowIndex: number
  columnIndex: number
  active: boolean
  focus: boolean
  disabled: boolean
  columnData: C
  setRowData: (rowData: T) => void
  stopEditing: (opts?: { nextRow?: boolean }) => void
  insertRowBelow: () => void
  duplicateRow: () => void
  deleteRow: () => void
  getContextMenuItems: () => ContextMenuItem[]
}

export type CellComponent<T, C> = (props: CellProps<T, C>) => JSX.Element

export type Column<T, C, PasteValue> = {
  id?: string
  headerClassName?: string
  title?: React.ReactNode
  /** @deprecated Use `basis`, `grow`, and `shrink` instead */
  width?: string | number
  basis: number
  grow: number
  shrink: number
  minWidth: number
  maxWidth?: number
  component: CellComponent<T, C>
  columnData?: C
  disableKeys: boolean
  disabled: boolean | ((opt: { rowData: T; rowIndex: number }) => boolean)
  cellClassName?:
  | string
  | ((opt: {
    rowData: T
    rowIndex: number
    columnId?: string
  }) => string | undefined)
  keepFocus: boolean
  deleteValue: (opt: { rowData: T; rowIndex: number }) => T
  copyValue: (opt: { rowData: T; rowIndex: number }) => number | string | null
  pasteValue: (opt: { rowData: T; value: PasteValue; rowIndex: number }) => T
  prePasteValues: (values: string[]) => PasteValue[] | Promise<PasteValue[]>
  isCellEmpty: (opt: { rowData: T; rowIndex: number }) => boolean
}

export type SelectionContextType = {
  columnRights?: number[]
  columnWidths?: number[]
  activeCell: Cell | null
  selection: Selection | null
  dataLength: number
  rowHeight: (index: number) => { height: number; top: number }
  hasStickyRightColumn: boolean
  editing: boolean
  isCellDisabled: (cell: Cell) => boolean
  headerRowHeight: number
  viewWidth?: number
  viewHeight?: number
  contentWidth?: number
  edges: { top: boolean; right: boolean; bottom: boolean; left: boolean }
  expandSelection: number | null
}

export type SimpleColumn<T, C> = Partial<
  Pick<
    Column<T, C, string>,
    | 'title'
    | 'maxWidth'
    | 'minWidth'
    | 'basis'
    | 'grow'
    | 'shrink'
    | 'component'
    | 'columnData'
  >
>

export type AddRowsComponentProps = {
  addRows: (count?: number) => void
}

export type ContextMenuItem =
  | {
    type: 'INSERT_ROW_BELLOW' | 'DELETE_ROW' | 'DUPLICATE_ROW' | 'COPY' | 'CUT' | 'PASTE'
    action: () => void
  }
  | {
    type: 'DELETE_ROWS' | 'DUPLICATE_ROWS'
    action: () => void
    fromRow: number
    toRow: number
  }

export type ContextMenuComponentProps = {
  clientX: number
  clientY: number
  items: ContextMenuItem[]
  cursorIndex: Cell
  close: () => void
}

export type Operation = {
  type: 'UPDATE' | 'DELETE' | 'CREATE'
  fromRowIndex: number
  toRowIndex: number
}

export type DataSheetGridProps<T> = {
  value?: T[]
  style?: React.CSSProperties
  className?: string
  rowClassName?:
  | string
  | ((opt: { rowData: T; rowIndex: number }) => string | undefined)
  cellClassName?:
  | string
  | ((opt: {
    rowData: unknown
    rowIndex: number
    columnId?: string
  }) => string | undefined)
  onChange?: (value: T[], operations: Operation[]) => void
  columns?: Partial<Column<T, any, any>>[]
  gutterColumn?: SimpleColumn<T, any> | false
  stickyRightColumn?: SimpleColumn<T, any>
  rowKey?: string | ((opts: { rowData: T; rowIndex: number }) => string)
  height?: number
  rowHeight?: number | ((opt: { rowData: T; rowIndex: number }) => number)
  headerRowHeight?: number
  addRowsComponent?:
  | ((props: AddRowsComponentProps) => React.ReactElement | null)
  | false
  createRow?: () => T
  duplicateRow?: (opts: { rowData: T; rowIndex: number }) => T
  autoAddRow?: boolean
  lockRows?: boolean
  disableContextMenu?: boolean
  disableExpandSelection?: boolean
  contextMenuComponent?: (
    props: ContextMenuComponentProps
  ) => React.ReactElement | null
  onFocus?: (opts: { cell: CellWithId }) => void
  onBlur?: (opts: { cell: CellWithId }) => void
  onActiveCellChange?: (opts: { cell: CellWithId | null }) => void
  onSelectionChange?: (opts: { selection: SelectionWithId | null }) => void
  onScroll?: React.UIEventHandler<HTMLDivElement> | undefined
}

type CellWithIdInput = {
  col: number | string
  row: number
}

type SelectionWithIdInput = { min: CellWithIdInput; max: CellWithIdInput }

export type CellWithId = {
  colId?: string
  col: number
  row: number
}

export type SelectionWithId = { min: CellWithId; max: CellWithId }

export type DataSheetGridRef = {
  activeCell: CellWithId | null
  selection: SelectionWithId | null
  setActiveCell: (activeCell: CellWithIdInput | null) => void
  setSelection: (selection: SelectionWithIdInput | null) => void
}
