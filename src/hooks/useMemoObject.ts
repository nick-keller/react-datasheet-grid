import { useMemo } from 'react'

export const useMemoObject = <T>(object: T): T => {
  return useMemo<T>(() => object, Object.values(object))
}
