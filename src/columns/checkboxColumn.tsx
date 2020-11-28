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
  'wrong',
  'negative',
]

const Component = ({ focus, active, onChange, value, onDoneEditing }) => {
  const ref = useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (focus) {
      onChange(!value)
      onDoneEditing({ nextRow: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus, onDoneEditing])

  return (
    <input
      className='dsg-checkbox'
      type='checkbox'
      ref={ref}
      checked={Boolean(value)}
      onMouseDown={() => !active && onChange(!value)}
      onChange={() => null}
    />
  )
}

export function checkboxColumn<TRow = any>({
  key,
  ...rest
}: Partial<Column<TRow>> & { key: string }): Partial<Column<TRow>> {
  return {
    render: ({ focus, active, setRowData, rowData, onDoneEditing }) => (
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
  }
}
