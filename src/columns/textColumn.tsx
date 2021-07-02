import React, { useLayoutEffect, useRef } from 'react'
import { CellComponent, CellProps, Column } from '../types'

const TextComponent = React.memo<CellProps<Record<string, any>, any>>(
  ({ focus, rowData, columnIndex, rowIndex, columnData: key, setRowData }) => {
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
        ref={ref}
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        value={rowData[key] || ''}
        onChange={(e) =>
          setRowData({ ...rowData, [key]: e.target.value || null })
        }
      />
    )
  }
)

TextComponent.displayName = 'TextComponent'

export const textColumn = <T extends Record<string, any>>(
  key: keyof T
): Partial<Column<T, string>> => ({
  columnData: key as string,
  component: TextComponent as CellComponent<T, string>,
})
