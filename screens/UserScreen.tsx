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

export const UserScreen = ({ navigation, route }: Eventful.RN.StackProps<'User'>) => {
  const { user } = route.params
  const { data } = useUser({ id: user })
  const { session } = useSession()
  const { data: contacts, addContact, removeContact } = useContacts({ user: session?._id })

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
    })
  }, [])

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
        <View style={[s.c, s.jcfs, s.flx_2]}>
          <Button
            onPress={() => navigation.push('Contacts', { user })}
            title="Contacts"
            iconRight={() => (
              <Feather name="chevron-right" color={c.onOneDark} size={s.h5.fontSize} />
            )}
          />
          <Spacer />
          <Button
            disabled
            onPress={() => null}
            title="Settings"
            iconRight={() => (
              <Feather name="chevron-right" color={c.onOneDark} size={s.h5.fontSize} />
            )}
          />
        </View>
      ) : (
        <View style={[s.c, s.flx_2]}>
          <Button
            title={isContact ? 'Remove' : 'Add'}
            iconLeft={() => <Feather name="x" color={c.onOneDark} size={s.h6.fontSize} />}
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
