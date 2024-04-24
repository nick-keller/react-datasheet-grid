import { createContext, useContext } from 'react'

export type ColumnsWidthContextType = {
  columnWidths?: number[]
  initialColumnsWidth?: Array<number | undefined>
  onColumnsResize?: (widths: number[]) => void
  onColumnResize?: (index: number, width: number) => void
}

export const ColumnsWidthContext = createContext<ColumnsWidthContextType>({})

export const useColumnsWidthContext = () => {
  return useContext(ColumnsWidthContext)
}
