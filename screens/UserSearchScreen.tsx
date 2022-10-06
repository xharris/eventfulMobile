import Feather from '@expo/vector-icons/Feather'
import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { H5 } from '../components/Header'
import { LoadingView } from '../components/LoadingView'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { useContacts } from '../eventfulLib/contact'
import { useUserSearch } from '../eventfulLib/search'
import { useSession } from '../eventfulLib/session'
import { c, radius, s, spacing } from '../libs/styles'

export const UserSearchScreen = ({
  navigation,
}: Eventful.RN.MainStackScreenProps<'UserSearch'>) => {
  const { data: users, search } = useUserSearch()
  const { session } = useSession()
  const { data: contacts, addContact } = useContacts({ user: session?._id })

  return (
    <LoadingView style={[s.c, s.flx_c]} edges={['left', 'right', 'bottom']}>
      <TextInput label="Search by username" onChangeText={(v) => search(v)} autoCapitalize="none" />
      <Spacer />
      <View style={[s.flx_c]}>
        {users.map((user) => (
          <View key={user._id.toString()} style={[s.c, s.flx_r, s.jcsb, s.aic]}>
            <Pressable
              style={[
                s.flx_1,
                s.flx_r,
                s.aic,
                { padding: spacing.small, borderRadius: radius.normal },
              ]}
              onPress={() => navigation.push('User', { user: user._id })}
              android_ripple={{
                color: c.onOneLight,
              }}
            >
              <Avatar username={user.username} size="medium" />
              <Spacer />
              <H5>{user.username}</H5>
            </Pressable>
            {user._id !== session?._id && !contacts?.some((user2) => user2._id === user._id) ? (
              <Button
                icon={() => <Feather name="x" color={c.onOneDark} size={s.h6.fontSize} />}
                onPress={() => addContact(user._id)}
              />
            ) : null}
          </View>
        ))}
      </View>
    </LoadingView>
  )
}
