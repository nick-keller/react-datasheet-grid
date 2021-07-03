import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const numberToString = (value: any): string =>
  typeof value === 'number' && !isNaN(value) ? String(value) : ''

const IntComponent = React.memo<CellProps<number | null, any>>(
  ({ focus, rowData, columnIndex, rowIndex, setRowData }) => {
    console.log('cell', { rowIndex, columnIndex })
    const [rawValue, setRawValue] = useState<string>(numberToString(rowData))
    const ref = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.select()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    useEffect(() => {
      if (!focus) {
        setRawValue(numberToString(rowData))
      }
    }, [focus, rowData])

    return (
      <input
        className="dsg-input dsg-input-align-right"
        tabIndex={-1}
        ref={ref}
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        value={rawValue}
        onChange={(e) => {
          const targetValue = e.target.value
          const number = parseFloat(targetValue)
          setRawValue(targetValue)
          setRowData(!isNaN(number) && targetValue ? Math.round(number) : null)
        }}
      />
    )
  }
)

IntComponent.displayName = 'IntComponent'

export const intColumn: Partial<Column<number | null, any>> = {
  component: IntComponent as CellComponent<number | null, any>,
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  pasteValue: ({ value }) => {
    const number = parseFloat(value)
    return !isNaN(number) ? Math.round(number) : null
  },
}
