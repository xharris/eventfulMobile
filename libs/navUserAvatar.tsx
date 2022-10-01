import Feather from '@expo/vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import React, { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { IconButton } from 'react-native-paper'
import { Eventful } from 'types'
import { Spacer } from '../components/Spacer'
import { useSession } from '../eventfulLib/session'
import { UserAvatar } from '../features/UserAvatar'
import { s } from './styles'

export const useNavUserAvatar = <T extends keyof Eventful.RN.MainStackParamList>() => {
  const { session } = useSession()
  const navigation = useNavigation<Eventful.RN.MainStackScreenProps<T>['navigation']>()

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={[s.flx_r, s.aic]}>
          {session ? (
            <IconButton
              icon={(props) => <Feather {...props} name="bell" />}
              onPress={() =>
                navigation.push('Notifications', {
                  user: session._id,
                })
              }
            />
          ) : null}
          <Spacer size={15} />
          <Pressable onPress={() => session && navigation.push('User', { user: session._id })}>
            <UserAvatar user={session} size="medium" />
          </Pressable>
        </View>
      ),
    })
  }, [navigation, session])
}
