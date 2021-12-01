import React, { useState } from 'react'
import { AddRowsComponentProps } from '../types'

export const AddRows = ({ addRows }: AddRowsComponentProps) => {
  const [value, setValue] = useState<number>(1)
  const [rawValue, setRawValue] = useState<string>(String(value))

  return (
    <div className="dsg-add-row">
      <button className="dsg-add-row-btn" onClick={() => addRows(value)}>
        Add
      </button>{' '}
      <input
        className="dsg-add-row-input"
        value={rawValue}
        onBlur={() => setRawValue(String(value))}
        type="number"
        min={1}
        onChange={(e) => {
          setRawValue(e.target.value)
          setValue(Math.max(1, Math.round(parseInt(e.target.value) || 0)))
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            addRows(value)
          }
        }}
      />{' '}
      rows
    </div>
  )
}
