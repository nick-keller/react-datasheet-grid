import { DataSheetGridProps } from '../types'
import { useState } from 'react'
import { DataSheetGrid } from './DataSheetGrid'
import React from 'react'

export const StaticDataSheetGrid = <T extends any>({
  columns,
  gutterColumn,
  stickyRightColumn,
  addRowsComponent,
  createRow,
  duplicateRow,
  isRowEmpty,
  ...rest
}: DataSheetGridProps<T>) => {
  const [staticProps] = useState({
    columns,
    gutterColumn,
    stickyRightColumn,
    addRowsComponent,
    createRow,
    duplicateRow,
    isRowEmpty,
  })

  return <DataSheetGrid {...staticProps} {...rest} />
}
