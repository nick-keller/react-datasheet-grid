import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const TEN_TO_THE_12 = 1000000000000
const TEN_TO_THE_10 = 10000000000

// We turn percentages (numbers between 0 and 1) into string (between 0 and 100)
// We could have just multiply percentages by 100, but due to floating point arithmetic: 0.29 * 100 === 28.999999999999996
// So we have to round those numbers to 10 decimals before turning them into strings
const numberToString = (value: any): string =>
  typeof value === 'number' && !isNaN(value)
    ? String(Math.round(value * TEN_TO_THE_12) / TEN_TO_THE_10)
    : ''

const PercentComponent = React.memo<CellProps<number | null, any>>(
  ({ focus, active, rowData, setRowData }) => {
    // This is the same as in `floatColumn`
    const [rawValue, setRawValue] = useState<string>(numberToString(rowData))

    const ref = useRef<HTMLInputElement>(null)

    // This is the same trick as in `textColumn`
    useLayoutEffect(() => {
      if (focus) {
        ref.current?.select()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    // This is the same as in `floatColumn`
    useEffect(() => {
      if (!focus) {
        setRawValue(numberToString(rowData))
      }
    }, [focus, rowData])

    return (
      <>
        <input
          className="dsg-input dsg-input-align-right"
          // Important to prevent any undesired "tabbing"
          tabIndex={-1}
          ref={ref}
          // This is the same trick as in `textColumn`
          style={{ pointerEvents: focus ? 'auto' : 'none' }}
          // We use the internal state, not the rowData
          value={rawValue}
          // This is the same as in `floatColumn`, but we divide by 100 to have a percentage
          onChange={(e) => {
            const targetValue = e.target.value
            const number = parseFloat(targetValue)
            setRawValue(targetValue)
            setRowData(!isNaN(number) && targetValue ? number / 100 : null)
          }}
        />
        <span
          className="dsg-input-suffix"
          // Only show the "%" symbol on non-empty cells, or when cell is active, otherwise set opacity to 0
          style={{
            opacity:
              (rowData !== null && rowData !== undefined) || active
                ? undefined
                : 0,
          }}
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
  // This is the same as in `floatColumn`
  pasteValue: ({ value }) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number : null
  },
  isCellEmpty: ({ rowData }) => rowData === null || rowData === undefined,
}
