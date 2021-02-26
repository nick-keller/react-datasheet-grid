import * as React from 'react'
import { useState } from 'react'
import { CounterComponentProps } from '../typings'

export const AddRowsCounter = React.memo(
  ({ addRows }: CounterComponentProps) => {
    const [value, setValue] = useState<number>(1)
    const [rawValue, setRawValue] = useState<string>(String(value))

    return (
      <button
        className='dsg-add-row'
        type='button'
        onClick={(e) => {
          // @ts-ignore
          if (e.target.tagName !== 'INPUT') {
            addRows(value)
          }
        }}
      >
        Add
        <input
          className='dsg-add-row-input'
          value={rawValue}
          onBlur={() => setRawValue(String(value))}
          onChange={(e) => {
            setRawValue(e.target.value)
            setValue(Math.max(1, Math.round(parseInt(e.target.value) || 0)))
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              addRows(value)
            }
          }}
        />
        rows
      </button>
    )
  }
)
