import { useMemo } from 'react'

export const useMemoizedIndexCallback = <T extends Array<any>>(
  callbackFn: (index: number, ...args: T) => void
) => {
  return useMemo(() => {
    const cache = new Map<number, (...args: T) => void>()

    return (index: number) => {
      if (!cache.has(index)) {
        cache.set(index, (...args) => {
          callbackFn(index, ...args)
        })
      }

      return cache.get(index) as (...args: T) => void
    }
  }, [callbackFn])
}
