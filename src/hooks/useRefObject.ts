import { useRef } from 'react'

export const useRefObject = <T>(object: T): { current: T } => {
  const ref = useRef<T>(object)
  ref.current = object

  return ref
}
