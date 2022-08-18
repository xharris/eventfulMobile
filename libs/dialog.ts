import { Alert, AlertButton } from 'react-native'

export const AreYouSure = (message: string, onYes: AlertButton['onPress']) =>
  Alert.alert('Are you sure?', message, [
    {
      text: 'Cancel',
      onPress: () => null,
    },
    {
      text: 'Yes',
      onPress: onYes,
    },
  ])
