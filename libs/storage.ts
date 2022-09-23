import AsyncStorage from '@react-native-async-storage/async-storage'
import { Eventful } from 'types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { extend } from './log'
import { useEffect } from 'react'

const log = extend('STORAGE')

export const useStorage = (defaults: Eventful.RN.Storage = {}) => {
  const { data, isFetched } = useQuery<Eventful.RN.Storage>(['storage'], () =>
    AsyncStorage.getAllKeys().then(async (keys) => {
      const out: Eventful.RN.Storage = {}
      const kv = await AsyncStorage.multiGet(keys)
      kv.forEach(([k, v]) => {
        let value: string | boolean | null = v
        if (v === 'true') {
          value = true
        }
        if (v === 'false') {
          value = false
        }
        if (value != null) {
          out[k as keyof Eventful.RN.Storage] = value as any // idc
        }
      })
      return out
    })
  )
  const qc = useQueryClient()

  const muSetValue = useMutation(
    ({ key, value }: { key: keyof Eventful.RN.Storage; value?: Eventful.RN.Storage[typeof key] }) =>
      AsyncStorage.setItem(key, value?.toString() ?? ''),
    {
      onMutate: ({ key, value }) => {
        qc.setQueryData<Eventful.RN.Storage>(['storage'], (prev) => {
          if (prev && value != prev[key]) {
            log.info(`${key}=${value}`)
          }
          return {
            ...prev,
            [key]: value,
          }
        })
      },
    }
  )

  const setValue = (value: Eventful.RN.Storage) =>
    Promise.all(
      Object.entries(value).map(([key, value]) =>
        muSetValue.mutateAsync({ key: key as keyof Eventful.RN.Storage, value })
      )
    )

  useEffect(() => {
    if (defaults && isFetched && data) {
      for (const key in defaults) {
        if (!(key in data)) {
          log.info(`${key}=${defaults[key as keyof Eventful.RN.Storage]} (default)`)
          setValue({ [key]: defaults[key as keyof Eventful.RN.Storage] })
        }
      }
    }
  }, [defaults, isFetched, data])

  return [data, setValue] as [typeof data, typeof setValue]
}
