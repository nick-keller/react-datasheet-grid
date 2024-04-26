import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export type ColumnsWidthContextType = {
  columnWidths?: number[]
  initialColumnsWidth?: Array<number | undefined>
  onColumnsResize?: (widths?: Array<number | undefined>) => void
  resizeCallback?: (
    v: Dispatch<SetStateAction<Array<number | undefined>>>
  ) => number | undefined
}

export const ColumnsWidthContext = createContext<ColumnsWidthContextType>({})

export const useColumnsWidthContext = () => {
  return useContext(ColumnsWidthContext)
}
