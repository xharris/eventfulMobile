import messaging from '@react-native-firebase/messaging'
// import firebase from '@react-native-firebase/app'
import { useEffect } from 'react'
import { Eventful } from 'types'
// import config from '../google-services.json'
import { api } from '../eventfulLib/api'

// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     clientId: config.client[0].oauth_client[0].client_id,
//     appId: config.client[0].client_info.mobilesdk_app_id,
//     apiKey: config.client[0].api_key[0].current_key,
//     databaseURL: '',
//     storageBucket: '',
//     messagingSenderId: '',
//     projectId: config.project_info.project_id,
//   })
// }

messaging().setBackgroundMessageHandler(async (msg) => {
  console.log(msg)
})

export const requestPermission = () =>
  messaging()
    .requestPermission()
    .then(
      (status) =>
        status === messaging.AuthorizationStatus.AUTHORIZED ||
        status === messaging.AuthorizationStatus.PROVISIONAL
    )

export const showLocalNotification = (payload: Eventful.NotificationPayload) =>
  new Notification(payload.notification.title ?? '', {
    body: payload.notification.body,
  })

export const useMessaging = () => {
  useEffect(() => {
    messaging()
      .getToken()
      .then((token) => {
        console.log('token', token)
        return api.post('fcm', { token })
      })
      .catch((err) => console.log(err))

    const unsub = messaging().onMessage((payload) => {
      console.log('foreground message', payload)
    })
    return () => {
      unsub()
    }
  }, [])
}
