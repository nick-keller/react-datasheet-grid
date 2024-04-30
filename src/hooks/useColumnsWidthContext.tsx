import { Dispatch, SetStateAction, createContext, useContext } from 'react'

export type ColumnWidthsContextType = {
  columnWidths?: number[]
  initialColumnWidths?: Record<string, number>
  resizedColumnWidths?: Record<string, number>
  onColumnsResize?: (widths: Record<string, number>) => void
  resizeCallback?: Dispatch<SetStateAction<Record<string, number>>>
  columnsMap?: Record<string, number>
}

export const ColumnWidthsContext = createContext<ColumnWidthsContextType>({})

export const useColumnWidthsContext = () => {
  return useContext(ColumnWidthsContext)
}
