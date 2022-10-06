import React, { ComponentProps, useMemo } from 'react'
import { View } from 'react-native'
import { Avatar, Text } from 'react-native-paper'
import { Eventful } from 'types'
import { Spacer } from '../components/Spacer'
import { c, s, spacing } from '../libs/styles'

interface UserAvatarProps extends Omit<ComponentProps<typeof Avatar.Text>, 'size' | 'label'> {
  user?: Eventful.User | null
  size?: 'small' | 'medium' | 'large'
}

export const UserAvatar = ({ user, size: _size = 'small', ...props }: UserAvatarProps) => {
  const size = useMemo(() => (_size === 'small' ? 18 : _size === 'medium' ? 32 : 100), [_size])

  return (
    <Avatar.Text
      {...props}
      label={user?.username.slice(0, 2).toUpperCase() ?? '..'}
      color={'#CFD8DC'}
      size={size}
    />
  )
}

interface UserAvatarGroupProps extends UserAvatarProps {
  backgroundColor?: string
  avatars?: UserAvatarProps[]
  limit?: number
}

export const UserAvatarGroup = ({
  backgroundColor = c.bg,
  avatars,
  limit = 2,
  ...props
}: UserAvatarGroupProps) => (
  <View style={[s.flx_r, s.aic]}>
    <View style={[s.flx_r]}>
      {avatars?.slice(0, limit).map((avatar, a, arr) => (
        <UserAvatar
          {...props}
          {...avatar}
          key={(avatar.user?._id.toString() ?? avatar.user?.username ?? a).toString()}
          style={{
            marginLeft: -12,
            // borderWidth: 1,
            // borderColor: backgroundColor,
            zIndex: arr.length - a,
          }}
        />
      ))}
    </View>
    <Spacer size={spacing.small} />
    {avatars && avatars?.length > limit && <Text>{`+${avatars.length - limit}`}</Text>}
  </View>
)
