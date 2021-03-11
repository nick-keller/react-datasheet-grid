/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
import { ReactNode, Element } from 'react'

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

interface CounterComponentProps {
  addRows: (batchSize: number) => void
}

type ContextMenuItem =
  | {
      type: 'INSERT_ROW_BELLOW' | 'DELETE_ROW' | 'DUPLICATE_ROW'
      action: () => void
    }
  | {
      type: 'DELETE_ROWS' | 'DUPLICATE_ROWS'
      action: () => void
      fromRow: number
      toRow: number
    }

interface ContextMenuProps {
  clientX: number
  clientY: number
  items: ContextMenuItem[]
  close: () => void
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
  disableContextMenu?: boolean
  counterComponent?: (props: CounterComponentProps) => Element | null
  contextMenuComponent?: (props: ContextMenuProps) => Element | null
}

interface ColumnRenderFunctionOptions<TRow = any> {
  rowData: TRow
  rowIndex: number
  columnIndex: number
  active: boolean
  focus: boolean
  disabled: boolean
  setRowData: (rowData: TRow) => void
  done: ({ nextRow }: { nextRow: boolean }) => void
  items: ContextMenuItem[]
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
  keepFocus: boolean
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
  contextMenuItems: ContextMenuItem[]
}
