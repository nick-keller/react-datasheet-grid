import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const TextComponent = React.memo<CellProps<string | null, any>>(
  ({ focus, rowData, columnIndex, rowIndex, setRowData }) => {
    console.log('cell', { rowIndex, columnIndex })
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
        tabIndex={-1}
        ref={ref}
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        value={rowData || ''}
        onChange={(e) => setRowData(e.target.value || null)}
      />
    )
  }
)

TextComponent.displayName = 'TextComponent'

export const textColumn: Partial<Column<string | null, any>> = {
  component: TextComponent as CellComponent<string | null, any>,
  deleteValue: () => null,
  copyValue: ({ rowData }) => rowData,
  pasteValue: ({ value }) => value || null,
}
