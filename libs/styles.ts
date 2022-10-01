import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  Platform,
  StatusBar,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
export { default as styled } from 'styled-components/native'

const range = <K extends string, T>(len: number, cb: (i: number, len: number) => Record<K, T>) =>
  new Array(len).fill(0).reduce(
    (obj, _, i) => ({
      ...obj,
      ...(cb(i, len) as Record<K, T>),
    }),
    {}
  ) as Record<K, T>

const lerp = (min: number, max: number, pct: number) => min * (1 - pct) + max * pct

export const spacing = {
  small: 2, // large (5)
  normal: 5, // large (10)
  container: 10, // large (15)
  inputPadding: 8,
  controlPadding: 10,
}

export const radius = {
  normal: 5,
  large: 10,
}

export type HeaderSize = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

/**
 * one: use for pretty much all controls and whatever
 *
 * two: use in rare occasions (links, progress bars, highlighting, sliders, switches)
 *
 * surf: component surfaces (cards, sheets, menus)
 *
 * https://material.io/design/color/the-color-system.html#color-theme-creation
 * https://material.io/resources/color/#!/?view.left=0&view.right=0&primary.color=a9b9cc&secondary.color=42d4ec
 * */
export const c = {
  /** primary: frequently used */
  one: '#a9b9cc',
  oneLight: '#dbebff',
  oneDark: '#7a899b',
  /** secondary */
  two: '#4FC3F7', // '#42d4ec',
  twoLight: '#4DD0E1',
  twoDark: '#4FC3F7',
  oneVariant: '#42d4ec',
  twoVariant: '',
  bg: '#FAFAFA', // '#f6f6f6',
  surf: '#FFFFFF',
  err: '#B00020',
  onOneLight: '#263238',
  onOneDark: '#F5F5F5',
  onTwoLight: '#212121',
  onTwoDark: '#ECEFF1',
  onBg: '#000000',
  onSurf: '#000000',
  onErr: '#FFFFFF',
  // regular colors
  red: '#F44336',
}

export const s = StyleSheet.create({
  ...(range(7, (i) => ({
    [`h${i}`]: {
      fontSize: lerp(14, 36, (6 - i) / 6), // large (16, 50)
    },
  })) as Record<HeaderSize, TextStyle>),
  safe: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  flx_r: {
    flexDirection: 'row',
  },
  flx_c: {
    flexDirection: 'column',
  },
  flx_rr: {
    flexDirection: 'row-reverse',
  },
  flx_cr: {
    flexDirection: 'column-reverse',
  },
  flx_0: {
    flex: 0,
  },
  flx_1: {
    flex: 1,
  },
  flx_2: {
    flex: 2,
  },
  flx_3: {
    flex: 3,
  },
  ais: { alignItems: 'stretch' },
  aifs: { alignItems: 'flex-start' },
  aic: { alignItems: 'center' },
  aife: { alignItems: 'flex-end' },
  jcc: { justifyContent: 'center' },
  jcfs: { justifyContent: 'flex-start' },
  jcfe: { justifyContent: 'flex-end' },
  jcsb: { justifyContent: 'space-between' },
  jcsa: { justifyContent: 'space-around' },
  asfs: { alignSelf: 'flex-start' },
  asfe: { alignSelf: 'flex-end' },
  asc: { alignSelf: 'center' },
  ass: { alignSelf: 'stretch' },
  /** container */
  c: {
    padding: spacing.container,
    borderRadius: radius.normal,
  },
  surf: {
    padding: spacing.container,
    borderRadius: radius.normal,
    backgroundColor: c.surf,
  },
  ctrl: {
    padding: spacing.controlPadding,
    borderRadius: radius.normal,
  },
  bold: {
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
})

// WIP
export const useAnimatedValue = (value: number, toValue: number, duration = 2000) => {
  const [v, setV] = useState(value)
  const animatedValue = useRef(new Animated.Value(value)).current
  const animation = useMemo(
    () =>
      Animated.timing(animatedValue, {
        toValue,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    [animatedValue, toValue, duration]
  )

  useEffect(() => {
    animation.start()
  }, [animation])

  useEffect(() => {
    animatedValue.addListener(({ value }) => {
      setV(value)
    })
    return () => {
      animatedValue.removeAllListeners()
    }
  }, [animatedValue])

  return v
}
