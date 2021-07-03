import {
  Column as ColumnBase,
  CellComponent as CellComponentBase,
  CellProps as CellPropsBase,
} from './types'

export type Column<T = any, C = any> = Partial<ColumnBase<T, C>>
export type CellComponent<T = any, C = any> = CellComponentBase<T, C>
export type CellProps<T = any, C = any> = CellPropsBase<T, C>
export { DataSheetGrid } from './components/DataSheetGrid'
export { textColumn } from './columns/textColumn'
export { checkboxColumn } from './columns/checkboxColumn'
export { floatColumn } from './columns/floatColumn'
export { keyColumn } from './columns/keyColumn'
