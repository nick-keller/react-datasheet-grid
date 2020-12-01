import * as React from 'react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Column } from '../typings'

const numberToString = (value: any): string =>
  typeof value === 'number' && !isNaN(value) ? String(value) : ''

const Component = ({ focus, onChange, value }) => {
  const [rawValue, setRawValue] = useState<string>(numberToString(value * 100))
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
      setRawValue(typeof value === 'number' ? numberToString(value * 100) : '')
    }
  }, [focus, value])

  return (
    <React.Fragment>
      <input
        className='dsg-input dsg-input-align-right'
        ref={ref}
        style={{ pointerEvents: focus ? 'auto' : 'none' }}
        value={rawValue}
        onChange={(e) => {
          const targetValue = e.target.value
          const number = parseFloat(targetValue)
          setRawValue(targetValue)
          onChange(
            !isNaN(number) && targetValue
              ? Math.min(100, Math.max(0, number)) / 100
              : null
          )
        }}
      />
      <span className='dsg-input-suffix'>%</span>
      <div className='dsg-input-progress-indicator' style={{ width: value * 100 + '%'}} />
    </React.Fragment>
  )
}

export function progressColumn<TRow = any>({
  key,
  ...rest
}: Partial<Column<TRow>> & { key: string }): Partial<Column<TRow>> {
  return {
    render: ({ focus, rowData, setRowData }) => (
      <Component
        value={rowData[key]}
        focus={focus}
        onChange={(value) => setRowData({ ...rowData, [key]: value })}
      />
    ),
    deleteValue: ({ rowData }) => ({ ...rowData, [key]: null }),
    copyValue: ({ rowData }) => typeof rowData[key] === 'number' ? rowData[key] * 100 + '%' : null,
    pasteValue: ({ rowData, value }) => {
      const number = parseFloat(value)
      return {
        ...rowData,
        [key]: !isNaN(number) ? Math.min(100, Math.max(0, number)) / 100 : null,
      }
    },
    ...rest,
  }
}
