import Feather from '@expo/vector-icons/Feather'
import React, { useEffect, useMemo, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Checkbox, FAB, TouchableRipple } from 'react-native-paper'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useContacts } from '../eventfulLib/contact'
import { useSession } from '../eventfulLib/session'
import { createEvent } from '../libs/signal'
import { s } from '../libs/styles'

export const ContactSelectEvent = createEvent<Eventful.ID[]>()

export const ContactSelectScreen = ({
  navigation,
  route,
}: Eventful.RN.EventStackScreenProps<'ContactSelect'>) => {
  const { user, selected: defaultSelected } = route.params
  const { data } = useContacts({ user })
  const [selected, setSelected] = useState(defaultSelected)
  const { session } = useSession()

  useEffect(() => {
    ContactSelectEvent.emit(selected)
  }, [selected])

  const isDirty = useMemo(
    () => !defaultSelected.every((id) => selected.some((id2) => id === id2)),
    [selected, defaultSelected]
  )

  return (
    <View style={[s.c, s.flx_1]}>
      {[...(data ?? []), session].map((contact) => {
        if (!contact) return null

        const value = selected.some((sel) => sel === contact._id)
        return (
          <View key={contact._id.toString()} style={[s.c, s.flx_r, s.jcsb, s.aic]}>
            <Pressable
              style={[s.flx_r, s.aic]}
              onPress={() =>
                navigation.navigate('UserTab', {
                  screen: 'User',
                  params: { user: contact._id },
                })
              }
            >
              <Avatar username={contact.username} size="medium" />
              <Spacer />
              <H5>{contact.username}</H5>
            </Pressable>
            <Pressable
              style={[s.flx_1, s.aife, { borderRadius: 20 }]}
              onPress={() =>
                setSelected((prev) =>
                  value ? prev.filter((sel) => sel !== contact._id) : [...prev, contact._id]
                )
              }
            >
              <Checkbox status={value ? 'checked' : 'unchecked'} />
            </Pressable>
          </View>
        )
      })}
      {/* {isDirty ? (
        <FAB
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          icon={(props) => <Feather {...props} name="check" />}
          onPress={() => {
            ContactSelectEvent.emit(selected)
            navigation.pop()
          }}
        />
      ) : null} */}
    </View>
  )
}
