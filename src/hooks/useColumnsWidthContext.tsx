import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export type ColumnWidthsContextType = {
  columnWidths?: number[]
  initialColumnWidths?: Array<number | undefined>
  resizedColumnWidths?: Array<number | undefined>
  onColumnsResize?: (widths: Array<number | undefined>) => void
  resizeCallback?: Dispatch<SetStateAction<Array<number | undefined>>>
}

export const ColumnWidthsContext = createContext<ColumnWidthsContextType>({})

export const useColumnWidthsContext = () => {
  return useContext(ColumnWidthsContext)
}
