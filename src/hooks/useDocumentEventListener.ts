import { useEffect } from 'react'
import { unstable_batchedUpdates } from 'react-dom'

export const useDocumentEventListener = (
  type: string,
  listener: (...args: any[]) => void
) => {
  useEffect(() => {
    document.addEventListener(type, listener)

    return () => {
      document.removeEventListener(type, listener)
    }
  }, [listener, type])
}
