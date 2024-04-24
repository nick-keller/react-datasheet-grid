import { createContext, useContext } from 'react'

export type ColumnsWidthContextType = {
  columnWidths?: number[]
  initialColumnsWidth?: number[]
  onColumnsResize?: (widths: number[]) => void
}

export const ColumnsWidthContext =
  createContext<ColumnsWidthContextType | null>(null)

export const useColumnsWidthContext = () => {
  return useContext(ColumnsWidthContext)
}
