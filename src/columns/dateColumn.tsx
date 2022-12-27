import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'
import cx from 'classnames'

const DateComponent = React.memo<CellProps<Date | null, any>>(
  ({ focus, active, rowData, setRowData }) => {
    const ref = useRef<HTMLInputElement>(null)

    // This is the same trick as in `textColumn`
    useLayoutEffect(() => {
      if (focus) {
        ref.current?.select()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <input
        className={cx('dsg-input', !active && 'dsg-hide-date-picker')}
        type="date"
        // Important to prevent any undesired "tabbing"
        tabIndex={-1}
        max="9999-12-31"
        ref={ref}
        // The `pointerEvents` trick is the same than in `textColumn`
        // Only show the calendar symbol on non-empty cells, or when cell is active, otherwise set opacity to 0
        style={{
          pointerEvents: focus ? 'auto' : 'none',
          opacity: rowData || active ? undefined : 0,
        }}
        // Because rowData is a Date object and we need a string, we use toISOString...
        value={rowData?.toISOString().substr(0, 10) ?? ''}
        // ...and the input returns a string that should be converted into a Date object
        onChange={(e) => {
          const date = new Date(e.target.value)
          setRowData(isNaN(date.getTime()) ? null : date)
        }}
      />
    )
  }
)

DateComponent.displayName = 'DateComponent'

export const dateColumn: Partial<Column<Date | null, any, string>> = {
  component: DateComponent as CellComponent<Date | null, any>,
  deleteValue: () => null,
  // We convert the date to a string for copying using toISOString
  copyValue: ({ rowData }) =>
    rowData ? rowData.toISOString().substr(0, 10) : null,
  // Because the Date constructor works using iso format, we can use it to parse ISO string back to a Date object
  pasteValue: ({ value }) => {
    const date = new Date(value.replace(/\.\s?|\//g, '-'))
    return isNaN(date.getTime()) ? null : date
  },
  minWidth: 170,
  isCellEmpty: ({ rowData }) => !rowData,
}
