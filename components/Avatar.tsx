import { ComponentProps, useMemo } from 'react'
import { Text, View } from 'react-native'
import { c, s, spacing } from '../libs/styles'
import { H6 } from './Header'
import { Spacer } from './Spacer'

interface AvatarProps extends ComponentProps<typeof View> {
  username?: string
  color?: string
  size?: 'small' | 'medium' | 'large'
  // to?: To
}

export const Avatar = ({
  username,
  color = '#CFD8DC',
  size = 'small',
  style,
  ...props
}: AvatarProps) => {
  const sizeDim = useMemo(() => (size === 'small' ? 30 : size === 'medium' ? 40 : 100), [size])
  const fontSize = useMemo(() => (size === 'small' ? 12 : size === 'medium' ? 16 : 32), [size])
  return (
    <View
      {...props}
      style={[
        style,
        s.aic,
        s.jcc,
        {
          backgroundColor: color,
          width: sizeDim,
          height: sizeDim,
          borderRadius: sizeDim / 2,
        },
      ]}
      data-testid="avatar"
    >
      <Text style={{ fontSize }}>{username?.slice(0, 2).toUpperCase() ?? ''}</Text>
    </View>
  )
}

// const AvatarGroupSpan = styled('span', {
//   display: 'inline-block',
//   overflow: 'hidden',
//   '&:not(:first-child)': {
//     marginLeft: -8,
//     mask: 'radial-gradient(circle 10px at 0px 50%,transparent 99%,#fff 100%)',
//     WebkitMask: 'radial-gradient(circle 10px at 0px 50%,transparent 99%,#fff 100%)',
//   },
// })

interface AvatarGroupProps extends AvatarProps {
  backgroundColor?: string
  avatars?: Pick<AvatarProps, 'username' | 'color'>[]
  limit?: number
}

export const AvatarGroup = ({
  backgroundColor = c.bg,
  avatars,
  limit = 2,
  ...props
}: AvatarGroupProps) => (
  <View style={[s.flx_r, s.aic]}>
    <View style={[s.flx_r]}>
      {avatars?.slice(0, limit).map((avatar, a, arr) => (
        <Avatar
          {...props}
          {...avatar}
          key={avatar.username}
          style={{
            marginLeft: -12,
            borderWidth: 1,
            borderColor: backgroundColor,
            zIndex: arr.length - a,
          }}
        />
      ))}
    </View>
    <Spacer size={spacing.small} />
    {avatars && avatars?.length > limit && <H6>{`+${avatars.length - limit}`}</H6>}
  </View>
)
