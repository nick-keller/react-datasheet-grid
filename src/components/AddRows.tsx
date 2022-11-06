import React, { FC, useState } from 'react'
import { AddRowsComponentProps } from '../types'

export const createAddRowsComponent =
  (
    translationKeys: { button?: string; unit?: string } = {}
  ): FC<AddRowsComponentProps> =>
  // eslint-disable-next-line react/display-name
  ({ addRows }) => {
    const [value, setValue] = useState<number>(1)
    const [rawValue, setRawValue] = useState<string>(String(value))

    return (
      <div className="dsg-add-row">
        <button
          type="button"
          className="dsg-add-row-btn"
          onClick={() => addRows(value)}
        >
          {translationKeys.button ?? 'Add'}
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              addRows(value)
            }
          }}
        />{' '}
        {translationKeys.unit ?? 'rows'}
      </div>
    )
  }

export const AddRows = createAddRowsComponent()

AddRows.displayName = 'AddRows'
