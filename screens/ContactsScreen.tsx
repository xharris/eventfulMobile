import Feather from '@expo/vector-icons/Feather'
import React from 'react'
import { View } from 'react-native'
import { IconButton, List } from 'react-native-paper'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { useContacts } from '../eventfulLib/contact'
import { AreYouSure } from '../libs/dialog'
import { s } from '../libs/styles'

export const ContactsScreen = ({
  navigation,
  route,
}: Eventful.RN.MainStackScreenProps<'Contacts'>) => {
  const { user } = route.params
  const { data, removeContact } = useContacts({ user })

  return (
    <View style={[s.c, s.flx_1]}>
      {data?.map((contact) => (
        <List.Item
          key={contact._id.toString()}
          title={contact.username}
          left={(props) => <Avatar username={contact.username} size="medium" />}
          onPress={() => navigation.push('User', { user: contact._id })}
          right={() => (
            <IconButton
              icon={(props) => <Feather {...props} name="x" />}
              onPress={() => AreYouSure('Delete contact?', () => removeContact(contact._id))}
            />
          )}
        />
      ))}
    </View>
  )
}
