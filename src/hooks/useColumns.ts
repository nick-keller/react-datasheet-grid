import { Column } from '../types'
import { useMemo } from 'react'

export const useColumns = (partialColumns: Partial<Column<any>>[]) => {
  return useMemo<Column<any>[]>(
    () =>
      partialColumns.map((partialColumn) => ({
        basis: 0,
        grow: 1,
        shrink: 1,
        minWidth: 100,
        ...partialColumn,
      })),
    [partialColumns]
  )
}
