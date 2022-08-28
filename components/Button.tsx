import React, { ComponentProps, ReactNode } from 'react'
import {
  Button as RButton,
  Pressable,
  PressableProps,
  StyleProp,
  Text,
  View,
  ViewProps,
} from 'react-native'
import { c, s, HeaderSize, spacing, radius } from '../libs/styles'
import { Spacer } from './Spacer'
import { Avatar, Button as PaperButton } from 'react-native-paper'
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon'

export const getOnButtonColor = (transparent: boolean) => (transparent ? c.oneDark : c.onOneDark)

type ButtonProps = Omit<ComponentProps<typeof PaperButton>, 'children'> & {
  children?: ComponentProps<typeof PaperButton>['children']
  color?: string
  title?: string
}

export const Button = ({ title, children, style, ...props }: ButtonProps) => (
  <PaperButton {...props} style={[style]}>
    {children ?? title}
  </PaperButton>
)

// export const Button = ({
//   style,
//   color,
//   title,
//   titleSize = 'h5',
//   iconRight,
//   iconLeft,
//   disabled,
//   transparent,
//   outlined,
//   children,
//   ...props
// }: ButtonProps) => (
//   <Button
//     {...props}
//     style={(props) => [
//       {
//         borderWidth: outlined ? 1 : 0,
//         borderColor: c.oneDark,
//         backgroundColor: transparent ? 'transparent' : c.oneDark,
//         borderRadius: radius.normal,
//       },
//       typeof style === 'function' ? style(props) : style,
//     ]}
//     android_ripple={{
//       color: c.oneDark,
//     }}
//     disabled={disabled}
//   >
//     {(props) => (
//       <View
//         style={[
//           s.flx_r,
//           s.aic,
//           s.jcsb,
//           {
//             padding: spacing.controlPadding * 1.5,
//           },
//         ]}
//       >
//         {children ? (
//           typeof children === 'function' ? (
//             children(props)
//           ) : (
//             children
//           )
//         ) : (
//           <View style={[s.flx_r, s.aic, s.jcsb]}>
//             {iconLeft ? iconLeft() : null}
//             {iconLeft && title ? <Spacer /> : null}
//             {title ? (
//               <Text
//                 style={[
//                   s[titleSize],
//                   {
//                     color: transparent ? color ?? c.oneDark : c.onOneDark,
//                     textDecorationLine: disabled ? 'line-through' : undefined,
//                     opacity: disabled ? 0.7 : 1,
//                   },
//                 ]}
//               >
//                 {title}
//               </Text>
//             ) : null}
//           </View>
//         )}
//         {iconRight && title ? <Spacer /> : null}
//         {iconRight ? iconRight() : null}
//       </View>
//     )}
//   </Pressable>
// )
