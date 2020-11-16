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

interface DataSheetGridProps {
  data?: any[]
  onChange?: (data: any[]) => void
  columns?: Partial<Column>[]
  width?: number
  height?: number
  rowHeight?: number
  headerRowHeight?: number
  createRow?: () => any
  duplicateRow?: ({ rowData }) => any
  isRowEmpty?: ({ rowData }) => boolean
  autoAddRow?: boolean
  lockRows?: boolean
}

interface ColumnRenderFunctionOptions {
  rowData: any
  rowIndex: number
  columnIndex: number
  active: boolean
  focus: boolean
  setRowData: (rowData: any) => void
  onDoneEditing: ({ nextRow }: { nextRow: boolean }) => void
}

interface ColumnRenderFunction {
  (options: ColumnRenderFunctionOptions): ReactNode
}

interface Column {
  title?: ReactNode
  width: string | number
  minWidth?: number
  maxWidth?: number
  render: ColumnRenderFunction
  disableKeys: boolean
  disabled: boolean | (({ rowData }: { rowData: any }) => boolean)
  deleteValue: ({ rowData }: { rowData: any }) => any
  copyValue: ({ rowData }: { rowData: any }) => number | string | null
  pasteValue: ({ rowData, value }: { rowData: any; value: string }) => any
}

interface Cell {
  col: number
  row: number
}

interface GridContext {
  focus: boolean
  editing: boolean
  activeCell: Cell | null
  columnWidths: number[]
  rowHeight: number
  headerRowHeight: number
  selection: {
    min: Cell
    max: Cell
  } | null
  data: any[]
  onChange: (data: any[]) => void
  columns: Column[]
  isCellDisabled: (cell: Cell) => boolean
  onDoneEditing: ({ nextRow }: { nextRow: boolean }) => void
}
