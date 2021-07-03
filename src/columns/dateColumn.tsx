import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const DateComponent = React.memo<CellProps<Date | null, any>>(
  ({ focus, active, rowData, setRowData }) => {
    const ref = useRef<HTMLInputElement>(null)

    useLayoutEffect(() => {
      if (focus) {
        ref.current?.select()
      } else {
        ref.current?.blur()
      }
    }, [focus])

    return (
      <input
        className="dsg-input"
        type="date"
        tabIndex={-1}
        ref={ref}
        style={{
          pointerEvents: focus ? 'auto' : 'none',
          opacity: rowData || active ? undefined : 0,
        }}
        value={rowData?.toISOString().substr(0, 10) ?? ''}
        onChange={(e) => setRowData(new Date(e.target.value) || null)}
      />
    )
  }
)

DateComponent.displayName = 'DateComponent'

export const dateColumn: Partial<Column<Date | null, any>> = {
  component: DateComponent as CellComponent<Date | null, any>,
  deleteValue: () => null,
  copyValue: ({ rowData }) =>
    rowData ? rowData.toISOString().substr(0, 10) : null,
  pasteValue: ({ value }) => {
    const date = new Date(value)
    return isNaN(date.getTime()) ? null : date
  },
  minWidth: 170,
}
