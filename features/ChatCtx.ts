import createStateContext from 'react-use/lib/factory/createStateContext'
import { Eventful } from 'types'

export const [useChatCtx, ChatCtxProvider] = createStateContext<{
  options: { plans: boolean; messages: boolean }
  editing?: Eventful.API.MessageGet
  replying?: Eventful.API.MessageGet
}>({
  options: { plans: true, messages: true },
  editing: undefined,
  replying: undefined,
})
