import React, { useCallback, useRef } from 'react'
import { CellComponent, Column } from '../types'

type ColumnData = { key: string; original: Partial<Column<any, any>> }

const KeyComponent: CellComponent<any, ColumnData> = ({
  columnData: { key, original },
  rowData,
  setRowData,
  ...rest
}) => {
  const rowDataRef = useRef(rowData)
  rowDataRef.current = rowData

  const setKeyData = useCallback(
    (value) => {
      setRowData({ ...rowDataRef.current, [key]: value })
    },
    [key, setRowData]
  )

  if (!original.component) {
    return <></>
  }

  const Component = original.component

  return (
    <Component
      columnData={original.columnData}
      setRowData={setKeyData}
      rowData={rowData[key]}
      {...rest}
    />
  )
}

export const keyColumn = <T extends Record<string, any>>(
  key: string,
  column: Partial<Column<any, any>>
): Partial<Column<T, ColumnData>> => ({
  ...column,
  columnData: { key, original: column },
  component: KeyComponent,
  copyValue: ({ rowData }) =>
    column.copyValue?.({ rowData: rowData[key] }) ?? null,
  deleteValue: ({ rowData }) => ({
    ...rowData,
    [key]: column.deleteValue?.({ rowData: rowData[key] }) ?? null,
  }),
  pasteValue: ({ rowData, value }) => ({
    ...rowData,
    [key]: column.pasteValue?.({ rowData: rowData[key], value }) ?? null,
  }),
})
