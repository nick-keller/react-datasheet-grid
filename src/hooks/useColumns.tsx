import React, { useMemo } from 'react'
import { CellProps, Column, SimpleColumn } from '../types'

const defaultComponent = () => <></>
const identityRow = <T extends any>({ rowData }: { rowData: T }) => rowData
const defaultCopyValue = () => null
const defaultGutterComponent = ({ rowIndex }: CellProps<any, any>) => (
  <>{rowIndex + 1}</>
)

export const useColumns = <T extends any>(
  columns: Partial<Column<T, any>>[],
  gutterColumn?: SimpleColumn<T, any>,
  stickyRightColumn?: SimpleColumn<T, any>
): Column<T, any>[] => {
  return useMemo<Column<T, any>[]>(() => {
    const partialColumns: Partial<Column<T, any>>[] = [
      {
        width: '0 0 40px',
        minWidth: 0,
        title: <div className="dsg-corner-indicator" />,
        component: defaultGutterComponent,
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

    return partialColumns.map<Column<T, any>>((column) => ({
      width: 1,
      minWidth: 100,
      renderWhenScrolling: true,
      component: defaultComponent,
      disableKeys: false,
      disabled: false,
      keepFocus: false,
      deleteValue: identityRow,
      copyValue: defaultCopyValue,
      pasteValue: identityRow,
      ...column,
    }))
  }, [gutterColumn, stickyRightColumn, columns])
}
