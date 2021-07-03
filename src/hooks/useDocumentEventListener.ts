import { useEffect } from 'react'

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
