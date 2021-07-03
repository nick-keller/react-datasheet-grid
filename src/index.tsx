import {
  Column as ColumnBase,
  CellComponent as CellComponentBase,
  CellProps as CellPropsBase,
  DataSheetGridProps as DataSheetGridPropsBase,
  AddRowsComponentProps as AddRowsComponentPropsBase,
  SimpleColumn as SimpleColumnBase,
} from './types'
import { DataSheetGrid as DataSheetGridBase } from './components/DataSheetGrid'
import { StaticDataSheetGrid as StaticDataSheetGridBase } from './components/StaticDataSheetGrid'

export type Column<T = any, C = any> = Partial<ColumnBase<T, C>>
export type CellComponent<T = any, C = any> = CellComponentBase<T, C>
export type CellProps<T = any, C = any> = CellPropsBase<T, C>
export type DataSheetGridProps<T = any> = DataSheetGridPropsBase<T>
export type AddRowsComponentProps = AddRowsComponentPropsBase
export type SimpleColumn<T = any, C = any> = SimpleColumnBase<T, C>
export const DynamicDataSheetGrid = DataSheetGridBase
export const DataSheetGrid = StaticDataSheetGridBase
export { textColumn } from './columns/textColumn'
export { checkboxColumn } from './columns/checkboxColumn'
export { floatColumn } from './columns/floatColumn'
export { intColumn } from './columns/intColumn'
export { percentColumn } from './columns/percentColumn'
export { dateColumn } from './columns/dateColumn'
export { keyColumn } from './columns/keyColumn'
