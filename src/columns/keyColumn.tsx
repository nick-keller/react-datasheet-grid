import React, { useCallback, useRef } from 'react'
import { CellComponent, Column } from '../types'

type ColumnData = { key: string; original: Partial<Column<any, any>> }

const KeyComponent: CellComponent<any, ColumnData> = ({
  columnData: { key, original },
  rowData,
  setRowData,
  ...rest
}) => {
  // We use a ref so useCallback does not produce a new setKeyData function every time the rowData changes
  const rowDataRef = useRef(rowData)
  rowDataRef.current = rowData

  // We wrap the setRowData function to assign the value to the desired key
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
      // We only pass the value of the desired key, this is why each cell does not have to re-render everytime
      // another cell in the same row changes!
      rowData={rowData[key]}
      {...rest}
    />
  )
}

export const keyColumn = <
  T extends Record<string, any>,
  K extends keyof T = keyof T
>(
  key: K,
  column: Partial<Column<T[K], any>>
): Partial<Column<T, ColumnData>> => ({
  ...column,
  // We pass the key and the original column as columnData to be able to retrieve them in the cell component
  columnData: { key: key as string, original: column },
  component: KeyComponent,
  // Here we simply wrap all functions to only pass the value of the desired key to the column, and not the entire row
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
  disabled:
    typeof column.disabled === 'function'
      ? ({ rowData }) => {
          return typeof column.disabled === 'function'
            ? column.disabled({ rowData: rowData[key] })
            : column.disabled ?? false
        }
      : column.disabled,
})
