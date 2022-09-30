import { useEffect, useMemo } from 'react'
import { Pressable, View } from 'react-native'
import { Checkbox } from 'react-native-paper'
import { Eventful } from 'types'
import { H3, H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
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
}: Eventful.RN.MainStackScreenProps<'NotificationSetting'>) => {
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
        <View key={category} style={[s.c]}>
          <H3>{category}</H3>
          {items.map(({ key, label }) => (
            <Pressable
              key={key}
              style={[s.flx_r, s.aic, s.jcsb]}
              onPress={() =>
                isEnabled({ key, ref, refModel })
                  ? disable({ key, ref, refModel })
                  : enable({ key, ref, refModel })
              }
            >
              <H5>{label}</H5>
              <Checkbox status={isEnabled({ key, ref, refModel }) ? 'checked' : 'unchecked'} />
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  )
}
