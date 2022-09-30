import Feather from '@expo/vector-icons/Feather'
import { useEffect } from 'react'
import { View } from 'react-native'
import { IconButton, List, Text } from 'react-native-paper'
import { Eventful } from 'types'
import { LoadingView } from '../components/LoadingView'
import { useAccess } from '../eventfulLib/access'
import { useNotifications } from '../eventfulLib/notification'
import { useSession } from '../eventfulLib/session'
import { extend } from '../libs/log'
import { s } from '../libs/styles'

const log = extend('scrn/notifications')

export const NotificationsScreen = ({
  navigation,
}: Eventful.RN.MainStackScreenProps<'Notifications'>) => {
  const { session } = useSession()
  // const { data } = useNotifications()
  const { data: access, updateAccess } = useAccess({ user: session?._id })

  useEffect(() => {
    log.debug(access)
  }, [access])

  return (
    <LoadingView loading={!access} edges={['left', 'right', 'bottom']}>
      {access?.tags
        .filter((tag) => tag.isInvited && !tag.canView)
        .map((tag) => (
          <List.Item
            key={tag._id.toString()}
            title={tag.tag.name}
            description="Accept invite?"
            right={() => (
              <View style={[s.aic, s.flx_r]}>
                <IconButton
                  icon={(props) => <Feather {...props} name="x" />}
                  onPress={() =>
                    updateAccess({
                      ref: tag.ref,
                      refModel: tag.refModel,
                      user: tag.user,
                      isInvited: false,
                    })
                  }
                />
                <IconButton
                  icon={(props) => <Feather {...props} name="check" />}
                  onPress={() =>
                    updateAccess({
                      ref: tag.ref,
                      refModel: tag.refModel,
                      user: tag.user,
                      canView: true,
                    }).then(() => navigation.push('Tag', { tag: tag.tag._id }))
                  }
                />
              </View>
            )}
          />
        ))}
    </LoadingView>
  )
}
