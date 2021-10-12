import React from 'react'
import { SelectionContextType } from '../types'

export const SelectionContext = React.createContext<SelectionContextType>({
  selection: null,
  headerRowHeight: 0,
  activeCell: null,
  rowHeight: 0,
  hasStickyRightColumn: false,
  dataLength: 0,
  edges: {
    top: true,
    left: true,
    bottom: true,
    right: true,
  },
  editing: false,
  isCellDisabled: () => false,
  expandSelection: null,
})
