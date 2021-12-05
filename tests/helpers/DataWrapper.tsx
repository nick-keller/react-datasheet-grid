import { DataSheetGrid, DataSheetGridProps, DataSheetGridRef } from '../../src'
import React, { useState } from 'react'

export const DataWrapper = ({
  dataRef,
  dsgRef,
  ...rest
}: Omit<DataSheetGridProps, 'ref' | 'value' | 'onChange'> & {
  dataRef: { current: any[] }
  dsgRef: { current: DataSheetGridRef }
}) => {
  const [value, setValue] = useState(dataRef.current)

  return (
    <DataSheetGrid
      value={value}
      onChange={(newData) => {
        setValue(newData)
        dataRef.current = newData
      }}
      ref={dsgRef}
      {...rest}
    />
  )
}
