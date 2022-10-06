import { useEffect } from 'react'

type Listener<Args extends any[]> = (value: Args) => void

export const createEvent = <Args extends any[]>() => {
  const listeners: Listener<Args>[] = []

  const emit = (args: Args) => listeners.forEach((fn) => fn(args))

  const addListener = (fn: Listener<Args>) => listeners.push(fn)
  const removeListener = (fn: Listener<Args>) =>
    listeners.splice(
      listeners.findIndex((fn2) => fn2 === fn),
      1
    )

  const useListen = (fn: Listener<Args>) =>
    useEffect(() => {
      addListener(fn)

      return () => {
        removeListener(fn)
      }
    }, [fn])

  return {
    emit,
    useListen,
  }
}
