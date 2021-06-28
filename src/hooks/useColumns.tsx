import React, { useMemo } from 'react'
import { Column, SimpleColumn } from '../types'

export const useColumns = <T extends any>(
  columns: Partial<Column<T>>[],
  gutterColumn?: SimpleColumn<T>,
  stickyRightColumn?: SimpleColumn<T>
): Column<T>[] => {
  return useMemo<Column<T>[]>(() => {
    const partialColumns: Partial<Column<T>>[] = [
      {
        width: '0 0 40px',
        minWidth: 0,
        title: <div className="dsg-corner-indicator" />,
        ...gutterColumn,
      },
      ...columns,
    ]

    if (stickyRightColumn) {
      partialColumns.push({
        width: '0 0 40px',
        minWidth: 0,
        ...stickyRightColumn,
      })
    }

    return partialColumns.map<Column<T>>((column) => ({
      width: 1,
      minWidth: 100,
      renderWhenScrolling: true,
      // render: () => null,
      disableKeys: false,
      disabled: false,
      keepFocus: false,
      deleteValue: ({ rowData }) => rowData,
      copyValue: () => null,
      pasteValue: ({ rowData }) => rowData,
      ...column,
    }))
  }, [gutterColumn, stickyRightColumn, columns])
}
