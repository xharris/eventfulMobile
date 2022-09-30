import { useMemo } from 'react'
import { Avatar } from 'react-native-paper'
import { Eventful } from 'types'

interface UserAvatarProps {
  user?: Eventful.User | null
  size?: 'small' | 'medium' | 'large'
}

export const UserAvatar = ({ user, size: _size = 'small' }: UserAvatarProps) => {
  const size = useMemo(() => (_size === 'small' ? 30 : _size === 'medium' ? 40 : 100), [_size])

  return (
    <Avatar.Text
      label={user?.username.slice(0, 2).toUpperCase() ?? '..'}
      color={'#CFD8DC'}
      size={size}
    />
  )
}
