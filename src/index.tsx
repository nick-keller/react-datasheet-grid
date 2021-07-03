import {
  Column as ColumnBase,
  CellComponent as CellComponentBase,
  CellProps as CellPropsBase,
} from './types'
import { DataSheetGrid as DataSheetGridBase } from './components/DataSheetGrid'
import { StaticDataSheetGrid as StaticDataSheetGridBase } from './components/StaticDataSheetGrid'

export type Column<T = any, C = any> = Partial<ColumnBase<T, C>>
export type CellComponent<T = any, C = any> = CellComponentBase<T, C>
export type CellProps<T = any, C = any> = CellPropsBase<T, C>
export const DynamicDataSheetGrid = DataSheetGridBase
export const DataSheetGrid = StaticDataSheetGridBase
export { textColumn } from './columns/textColumn'
export { checkboxColumn } from './columns/checkboxColumn'
export { floatColumn } from './columns/floatColumn'
export { keyColumn } from './columns/keyColumn'
