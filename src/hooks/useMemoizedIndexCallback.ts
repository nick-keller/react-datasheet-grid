import { useMemo } from 'react'

export const useMemoizedIndexCallback = <T extends Array<any>>(
  callbackFn: (index: number, ...args: T) => void,
  argsLength: number
) => {
  return useMemo(() => {
    const cache = new Map<number, (...args: T) => void>()

    return (index: number) => {
      if (!cache.has(index)) {
        cache.set(index, (...args) => {
          callbackFn(index, ...(args.slice(0, argsLength) as T))
        })
      }

      return cache.get(index) as (...args: T) => void
    }
  }, [argsLength, callbackFn])
}
