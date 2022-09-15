import { useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Eventful } from 'types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useStorage = () => {
  const { data } = useQuery<Eventful.RN.Storage>(['storage'], () =>
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
        out[k as keyof Eventful.RN.Storage] = value
      })
      return out
    })
  )
  const qc = useQueryClient()

  const muSetValue = useMutation(
    ({ key, value }: { key: keyof Eventful.RN.Storage; value: Eventful.RN.Storage[typeof key] }) =>
      AsyncStorage.setItem(key, value.toString()),
    {
      onSuccess: (_, { key, value }) => {
        qc.setQueriesData<Eventful.RN.Storage>(['storage'], (prev) => ({
          ...prev,
          [key]: value,
        }))
      },
    }
  )

  const setValue = (value: Eventful.RN.Storage) =>
    Promise.all(
      Object.entries(value).map(([key, value]) =>
        muSetValue.mutateAsync({ key: key as keyof Eventful.RN.Storage, value })
      )
    )

  return [data, setValue] as [typeof data, typeof setValue]
}
