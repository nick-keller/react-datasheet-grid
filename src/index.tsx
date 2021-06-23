import { Column as ColumnBase } from './types'

export type Column<T> = Partial<ColumnBase<T>>
export { DataSheetGrid } from './components/DataSheetGrid'
