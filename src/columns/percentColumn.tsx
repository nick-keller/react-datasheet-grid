import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const numberToString = (value: any): string =>
  typeof value === 'number' && !isNaN(value)
    ? String(Math.round(value * 1000000000000) / 10000000000)
    : ''

const PercentComponent = React.memo<CellProps<number | null, any>>(
  ({ focus, active, rowData, setRowData }) => {
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
      <>
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
            setRowData(!isNaN(number) && targetValue ? number / 100 : null)
          }}
        />
        <span
          className="dsg-input-suffix"
          style={{ opacity: rowData || active ? undefined : 0 }}
        >
          %
        </span>
      </>
    )
  }
)

PercentComponent.displayName = 'PercentComponent'

export const percentColumn: Partial<Column<number | null, any>> = {
  component: PercentComponent as CellComponent<number | null, any>,
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  pasteValue: ({ value }) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number : null
  },
}
