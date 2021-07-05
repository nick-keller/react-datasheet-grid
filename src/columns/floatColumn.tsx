import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const numberToString = (value: any): string =>
  typeof value === 'number' && !isNaN(value) ? String(value) : ''

const FloatComponent = React.memo<CellProps<number | null, any>>(
  ({ focus, rowData, setRowData }) => {
    // We keep an internal state of the input, we we directly use rowData weird things happen because we are trying
    // to parse the input value at every key stroke
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

    // When the cell looses focus, or when the value changes while the cell is not in focus, make sure to update
    // the internal state to match this new value (otherwise an oudated value would be displayed)
    useEffect(() => {
      if (!focus) {
        setRawValue(numberToString(rowData))
      }
    }, [focus, rowData])

    return (
      <input
        className="dsg-input dsg-input-align-right"
        // Important to prevent any undesired "tabbing"
        tabIndex={-1}
        ref={ref}
        // This is the same trick as in `textColumn`
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        // We use the internal state, not the rowData
        value={rawValue}
        // When value changes, we update the internal state without parsing anything (allowing the user to
        // type invalid data)
        // We also update the rowData, but with a parsed and checked value this time, so any invalid input
        // would become null
        onChange={(e) => {
          const targetValue = e.target.value
          const number = parseFloat(targetValue)
          setRawValue(targetValue)
          setRowData(!isNaN(number) && targetValue ? number : null)
        }}
      />
    )
  }
)

FloatComponent.displayName = 'FloatComponent'

export const floatColumn: Partial<Column<number | null, any>> = {
  component: FloatComponent as CellComponent<number | null, any>,
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  // Because copyValue returns the number directly, and that number is automatically converted to a string, we can
  // use parseFloat to get back the original number
  // We still have to check for non parsable values and return null in those cases
  pasteValue: ({ value }) => {
    const number = parseFloat(value)
    return !isNaN(number) ? number : null
  },
}
