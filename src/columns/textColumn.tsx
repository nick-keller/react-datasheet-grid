import * as React from 'react'
import { useLayoutEffect, useRef } from 'react'
import { Column } from '../typings'

const Component = ({ focus, onChange, value }) => {
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
      className='dsg-input'
      ref={ref}
      style={{ pointerEvents: focus ? 'auto' : 'none' }}
      value={value || ''}
      onChange={(e) => onChange(e.target.value || null)}
    />
  )
}

export const textColumn = ({ key, ...rest }): Partial<Column> => ({
  render: ({ focus, rowData, setRowData }) => (
    <Component
      value={rowData[key]}
      focus={focus}
      onChange={(value) => setRowData({ ...rowData, [key]: value })}
    />
  ),
  deleteValue: ({ rowData }) => ({ ...rowData, [key]: null }),
  copyValue: ({ rowData }) => rowData[key],
  pasteValue: ({ rowData, value }) => ({ ...rowData, [key]: value }),
  ...rest,
})
