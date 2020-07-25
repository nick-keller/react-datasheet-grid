/**
 * Default CSS definition for typescript,
 * will be overridden with file-specific definitions by rollup
 */
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

interface ColumnRenderFunctionOptions {
  rowData: any
  rowIndex: number
  active: boolean
  focus: boolean
}

interface ColumnRenderFunction {
  (options: ColumnRenderFunctionOptions): React.ReactNode
}

interface Column {
  title?: React.ReactNode
  width?: string | number
  minWidth?: number
  maxWidth?: number
  render: ColumnRenderFunction
}

interface Cell {
  col: number
  row: number
}

interface GridContext {
  focus: boolean
  activeCell: Cell | null
  columnWidths: number[]
  rowHeight: number
  headerRowHeight: number
  selection: {
    min: Cell
    max: Cell
  } | null
  data: any[]
  columns: Column[]
}
