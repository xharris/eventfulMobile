import { useEffect, useMemo } from 'react'
import { View } from 'react-native'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { H2, H3, H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useUser } from '../eventfulLib/user'
import { c, s } from '../libs/styles'
import Feather from '@expo/vector-icons/Feather'
import { useSession } from '../eventfulLib/session'
import { useContacts } from '../eventfulLib/contact'
import { AreYouSure } from '../libs/dialog'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { IconButton } from 'react-native-paper'
import { useNavigationState } from '@react-navigation/native'

export const UserScreen = ({ navigation, route }: Eventful.RN.UserStackScreenProps<'User'>) => {
  const { user } = route.params
  const { data } = useUser({ id: user })
  const { session, logOut } = useSession()
  const { data: contacts, addContact, removeContact } = useContacts({ user: session?._id })

  const index = useNavigationState((state) => state.index)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () =>
        index === 0 ? (
          <IconButton
            icon={(props) => <Feather {...props} name="search" />}
            onPress={() => navigation.push('UserSearch')}
          />
        ) : null,
    })
  }, [navigation, index])

  const isContact = useMemo(
    () => (user !== session?._id ? contacts?.some((contact) => contact._id === user) : false),
    [contacts, session, user]
  )

  return (
    <View style={[s.c, s.flx_c, s.jcsa, s.flx_1]}>
      <View style={[s.flx_r, s.jcsa, s.aic, s.flx_1]}>
        <Avatar username={data?.username} size="large" />
        <H2>{data?.username}</H2>
      </View>
      {user === session?._id ? (
        <View style={[s.flx_c, s.c, s.flx_2, s.jcsb]}>
          <View style={[s.flx_c]}>
            <Button
              mode="outlined"
              onPress={() => navigation.push('Contacts', { user })}
              title="Contacts"
              icon={(props) => <Feather {...props} name="users" />}
            />
            <Spacer />
            <Button
              mode="outlined"
              disabled
              onPress={() => null}
              title="Settings"
              icon={(props) => <Feather {...props} name="settings" />}
            />
          </View>
          <Button
            color={c.err}
            onPress={() =>
              AreYouSure('Log out?', () => logOut().then(() => navigation.navigate('Welcome')))
            }
            title="Log out"
            icon={(props) => <Feather {...props} name="log-out" />}
          />
        </View>
      ) : (
        <View style={[s.c, s.flx_2]}>
          <Button
            title={isContact ? 'Remove' : 'Add'}
            icon={(props) => <Feather {...props} name="x" />}
            onPress={() =>
              isContact
                ? AreYouSure('Delete contact?', () => removeContact(user))
                : addContact(user)
            }
          />
        </View>
      )}
    </View>
  )
}
