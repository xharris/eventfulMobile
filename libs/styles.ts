import { StyleSheet, TextStyle, ViewStyle } from 'react-native'
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
  two: '#42d4ec',
  twoLight: '#82ffff',
  twoDark: '#00a2ba',
  oneVariant: '',
  twoVariant: '',
  bg: '#FFFFFF',
  surf: '#FFFFFF',
  err: '#B00020',
  onOneLight: '#263238',
  onOneDark: '#263238',
  onTwoLight: '#212121',
  onTwoDark: '#212121',
  onBg: '#000000',
  onSurf: '#000000',
  onErr: '#FFFFFF',
}

export const s = StyleSheet.create({
  ...(range(6, (i) => ({
    [`h${i}`]: {
      fontSize: lerp(14, 50, (6 - i) / 6),
    },
  })) as Record<'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6', TextStyle>),
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
  flx_1: {
    flex: 1,
  },
  aifs: { alignItems: 'flex-start' },
  aic: { alignItems: 'center' },
  aife: { alignItems: 'flex-end' },
  jcc: { justifyContent: 'center' },
  jcfe: { justifyContent: 'flex-end' },
  jcsb: { justifyContent: 'space-between' },
  jcsa: { justifyContent: 'space-around' },
  asfs: { alignSelf: 'flex-start' },
  asfe: { alignSelf: 'flex-end' },
  asc: { alignSelf: 'center' },
  ass: { alignSelf: 'stretch' },
  /** container */
  c: {
    padding: 15,
  },
})
