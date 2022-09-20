import * as Linking from 'expo-linking'
import { Eventful } from 'types'

export const createUrl = (queryParams: Eventful.ParsedQs) =>
  Linking.createURL('eventful', {
    queryParams,
  })
