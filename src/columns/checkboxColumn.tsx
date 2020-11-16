import * as React from 'react'
import { useLayoutEffect, useRef } from 'react'
import { Column } from '../typings'

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
]

const Component = ({ focus, active, onChange, value, onDoneEditing }) => {
  const ref = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (focus) {
      onChange(!value)
      onDoneEditing({ nextRow: false })
    }
  }, [focus, onDoneEditing])

  return (
    <input
      className='dsg-checkbox'
      type='checkbox'
      ref={ref}
      checked={value || false}
      onChange={(e) => !active && onChange(e.target.checked)}
    />
  )
}

export const checkboxColumn = ({ key, ...rest }): Partial<Column> => ({
  render: ({ focus, active, rowData, setRowData, onDoneEditing }) => (
    <Component
      value={rowData[key]}
      focus={focus}
      active={active}
      onDoneEditing={onDoneEditing}
      onChange={(value) => setRowData({ ...rowData, [key]: value })}
    />
  ),
  deleteValue: ({ rowData }) => ({ ...rowData, [key]: false }),
  copyValue: ({ rowData }) => (rowData[key] ? 'YES' : 'NO'),
  pasteValue: ({ rowData, value }) => ({
    ...rowData,
    [key]: !FALSY.includes(value.toLowerCase()),
  }),
  ...rest,
})
