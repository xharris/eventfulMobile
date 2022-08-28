import Feather from '@expo/vector-icons/Feather'
import { Pressable, View } from 'react-native'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { Button } from '../components/Button'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useContacts } from '../eventfulLib/contact'
import { AreYouSure } from '../libs/dialog'
import { c, radius, s, spacing } from '../libs/styles'

export const ContactsScreen = ({
  navigation,
  route,
}: Eventful.RN.UserStackScreenProps<'Contacts'>) => {
  const { user } = route.params
  const { data, removeContact } = useContacts({ user })

  return (
    <View style={[s.c, s.flx_1]}>
      {data?.map((contact) => (
        <View key={contact._id} style={[s.c, s.flx_r, s.jcsb, s.aic]}>
          <Pressable
            style={[
              s.flx_1,
              s.flx_r,
              s.aic,
              { padding: spacing.small, borderRadius: radius.normal },
            ]}
            onPress={() => navigation.push('User', { user: contact._id })}
            android_ripple={{
              color: c.onOneLight,
            }}
          >
            <Avatar username={contact.username} size="medium" />
            <Spacer />
            <H5>{contact.username}</H5>
          </Pressable>
          <Button
            icon={() => <Feather name="x" color={c.onOneDark} size={s.h6.fontSize} />}
            onPress={() => AreYouSure('Delete contact?', () => removeContact(contact._id))}
          />
        </View>
      ))}
    </View>
  )
}
