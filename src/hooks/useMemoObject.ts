import { useMemo } from 'react'

export const useMemoObject = <T>(object: T): T => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo<T>(() => object, Object.values(object))
}
