import * as React from 'react'
import { useState } from 'react'
import { CounterComponentProps } from '../typings'

export const AddRowsCounter = React.memo(
  ({ value, onChange, onPressEnter }: CounterComponentProps) => {
    const [rawValue, setRawValue] = useState<string>(String(value))

    return (
      <React.Fragment>
        Add
        <input
          className='dsg-add-row-input'
          value={rawValue}
          onBlur={() => setRawValue(String(value))}
          onChange={(e) => {
            setRawValue(e.target.value)
            onChange(parseInt(e.target.value))
          }}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              onPressEnter()
            }
          }}
        />
        rows
      </React.Fragment>
    )
  }
)
