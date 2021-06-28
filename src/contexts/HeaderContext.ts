import React from 'react'
import { HeaderContextType } from '../types'

export const HeaderContext = React.createContext<HeaderContextType<any>>({
  columns: [],
  height: 0,
  hasStickyRightColumn: false,
})
