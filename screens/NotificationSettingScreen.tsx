import { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { Checkbox } from '../components/Checkbox'
import { H3 } from '../components/Header'
import { useNotifications } from '../eventfulLib/notification'
import { s } from '../libs/styles'

interface Item {
  key: Eventful.NotificationSetting['key']
  label: string
}

interface Category {
  category: string
  ref: Eventful.ID
  refModel: Eventful.NotificationSetting['refModel']
  items: Item[]
}

export const NotificationSettingScreen = ({
  navigation,
  route,
}: Eventful.RN.StackProps<'NotificationSetting'>) => {
  const { type, id } = route.params
  const { data, isEnabled, enable, disable, isFetching } = useNotifications()

  useEffect(() => {
    navigation.setOptions({
      title: 'Notification Settings',
    })
  }, [navigation])

  const items: Category[] = useMemo(
    () =>
      type === 'events'
        ? [
            {
              category: 'Chat',
              ref: id,
              refModel: 'events',
              items: [{ key: 'message:add', label: 'New message' }],
            },
          ]
        : [],
    [type, id]
  )

  return isFetching ? null : (
    <View style={[s.c]}>
      {items.map(({ category, items, ref, refModel }) => (
        <View key={category}>
          {items.map(({ key, label }) => (
            <Checkbox
              key={key}
              label={label}
              defaultChecked={isEnabled({ key, ref, refModel })}
              onChange={(v) =>
                v ? enable({ key, ref, refModel }) : disable({ key, ref, refModel })
              }
            />
          ))}
        </View>
      ))}
    </View>
  )
}
