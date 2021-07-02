import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const FALSY = [
  '',
  'false',
  'no',
  'off',
  'disabled',
  '0',
  'n',
  'f',
  'unchecked',
  'undefined',
  'null',
  'wrong',
  'negative',
]

const CheckboxComponent = React.memo<CellProps<boolean, any>>(
  ({
    focus,
    rowData,
    columnIndex,
    rowIndex,
    setRowData,
    active,
    stopEditing,
  }) => {
    console.log('cell', { rowIndex, columnIndex })
    const ref = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      if (focus) {
        setRowData(!rowData)
        stopEditing({ nextRow: false })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus, stopEditing])

    return (
      <input
        className="dsg-checkbox"
        type="checkbox"
        ref={ref}
        checked={Boolean(rowData)}
        onMouseDown={() => !active && setRowData(!rowData)}
        onChange={() => null}
      />
    )
  }
)

CheckboxComponent.displayName = 'CheckboxComponent'

export const checkboxColumn: Partial<Column<boolean, any>> = {
  component: CheckboxComponent as CellComponent<boolean, any>,
  deleteValue: () => false,
  copyValue: ({ rowData }) => (rowData ? 'YES' : 'NO'),
  pasteValue: ({ value }) => !FALSY.includes(value.toLowerCase()),
}
