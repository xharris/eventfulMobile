import { FC } from 'react'
import { Text, TextProps } from 'react-native'
import { s } from '../libs/styles'

export const H1: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h1]} />
export const H2: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h2]} />
export const H3: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h3]} />
export const H4: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h4]} />
export const H5: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h5]} />
export const H6: FC<TextProps> = ({ style, ...props }) => <Text {...props} style={[style, s.h6]} />
