/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
import { ReactNode } from 'react'

declare module '*.css' {
  const content: { [className: string]: string }
  export default content
}

interface SvgrComponent
  extends React.StatelessComponent<React.SVGAttributes<SVGElement>> {}

declare module '*.svg' {
  const svgUrl: string
  const svgComponent: SvgrComponent
  export default svgUrl
  export { svgComponent as ReactComponent }
}

interface DataSheetGridProps<TRow = any> {
  data?: TRow[]
  onChange?: (data: TRow[]) => void
  columns?: Partial<Column<TRow>>[]
  height?: number
  rowHeight?: number
  headerRowHeight?: number
  gutterColumnWidth?: number | string
  createRow?: () => TRow
  duplicateRow?: ({ rowData }: { rowData: TRow }) => TRow
  isRowEmpty?: ({ rowData }: { rowData: TRow }) => boolean
  autoAddRow?: boolean
  lockRows?: boolean
}

interface ColumnRenderFunctionOptions<TRow = any> {
  rowData: TRow
  rowIndex: number
  columnIndex: number
  active: boolean
  focus: boolean
  setRowData: (rowData: TRow) => void
  onDoneEditing: ({ nextRow }: { nextRow: boolean }) => void
}

interface ColumnRenderFunction<TRow = any> {
  (options: ColumnRenderFunctionOptions<TRow>): ReactNode
}

interface Column<TRow = any> {
  title?: ReactNode
  width: string | number
  minWidth?: number
  maxWidth?: number
  render: ColumnRenderFunction<TRow>
  disableKeys: boolean
  disabled: boolean | (({ rowData }: { rowData: TRow }) => boolean)
  deleteValue: ({ rowData }: { rowData: TRow }) => TRow
  copyValue: ({ rowData }: { rowData: TRow }) => number | string | null
  pasteValue: ({ rowData, value }: { rowData: TRow; value: string }) => TRow
}

interface Cell {
  col: number
  row: number
}

interface GridContext<TRow = any> {
  focus: boolean
  editing: boolean
  activeCell: Cell | null
  columnWidths: number[]
  columnOffsets: number[]
  innerWidth: number
  rowHeight: number
  headerRowHeight: number
  selection: {
    min: Cell
    max: Cell
  } | null
  data: TRow[]
  onChange: (data: TRow[]) => void
  columns: Column<TRow>[]
  isCellDisabled: (cell: Cell) => boolean
  onDoneEditing: ({ nextRow }: { nextRow: boolean }) => void
}
