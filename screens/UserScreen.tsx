import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Pressable, ScrollView, View } from 'react-native'
import { Eventful } from 'types'
import { Avatar } from '../components/Avatar'
import { H2, H3, H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { useUser } from '../eventfulLib/user'
import { c, s } from '../libs/styles'
import Feather from '@expo/vector-icons/Feather'
import { useSession } from '../eventfulLib/session'
import { useContacts } from '../eventfulLib/contact'
import { AreYouSure } from '../libs/dialog'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import {
  Button,
  Checkbox,
  Dialog,
  IconButton,
  List,
  Menu,
  Portal,
  TextInput,
} from 'react-native-paper'
import { useNavigationState } from '@react-navigation/native'
import { getLogs, logExtend } from '../libs/log'
import { useStorage } from '../libs/storage'
import { useSnackbar } from '../components/Snackbar'
import { useFormik } from 'formik'
import { FEEDBACK, useFeedback } from '../eventfulLib/feedback'

const log = logExtend('USER')

export const UserScreen = ({ navigation, route }: Eventful.RN.UserStackScreenProps<'User'>) => {
  const { user } = route.params
  const { data } = useUser({ id: user.toString() })
  const { session, logOut } = useSession()
  const { data: contacts, addContact, removeContact } = useContacts({ user: session?._id })
  const [devPresses, setDevPresses] = useState(0)
  const [devTimeout, setDevTimeout] = useState<NodeJS.Timeout>()
  const [storage, store] = useStorage()
  const { show } = useSnackbar()
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackTypeVisible, setFeedbackTypeVisible] = useState(false)
  const { sendFeedback } = useFeedback()

  const feedbackForm = useFormik({
    initialValues: {
      type: 'question',
      text: '',
      logs: false,
    },
    onSubmit: async (values, { resetForm }) => {
      setShowFeedback(false)
      let logs = ''
      if (values.logs) {
        logs = (await getLogs()) ?? ''
      }
      sendFeedback({
        ...values,
        logs,
      }).then(() => {
        show({
          text: 'Feedback sent!',
        })
        resetForm()
      })
    },
  })

  const index = useNavigationState((state) => state.index)

  useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerRight: () =>
        index === 0 ? (
          <IconButton
            icon={(props) => <Feather {...props} name="search" />}
            onPress={() => navigation.push('UserSearch')}
          />
        ) : null,
    })
  }, [navigation, index])

  const isContact = useMemo(
    () => (user !== session?._id ? contacts?.some((contact) => contact._id === user) : false),
    [contacts, session, user]
  )

  const clearDevTimeout = useCallback(() => {
    if (devTimeout) {
      clearTimeout(devTimeout)
      setDevTimeout(undefined)
    }
  }, [devTimeout])

  useEffect(() => {
    if (devPresses >= 7) {
      const devMode = !storage?.devMode
      store({ devMode })
      const message = devMode ? 'Dev mode enabled' : 'Dev mode disabled'
      log.info(message)
      show({
        text: message,
      })
      setDevPresses(0)
      setDevTimeout(undefined)
    }
  }, [devPresses, storage])

  return (
    <View style={[s.c, s.flx_c, s.jcsa, s.flx_1]}>
      <View style={[s.flx_r, s.jcsa, s.aic, s.flx_1]}>
        <Pressable
          onPress={() => {
            clearDevTimeout()
            setDevTimeout(
              setTimeout(() => {
                setDevPresses(0)
                setDevTimeout(undefined)
              }, 500)
            )
            setDevPresses((prev) => prev + 1)
          }}
        >
          <Avatar username={data?.username} size="large" />
        </Pressable>
        <H2>{data?.username}</H2>
      </View>
      {user === session?._id ? (
        <View style={[s.flx_c, s.c, s.flx_2, s.jcsb]}>
          <View style={[s.flx_c]}>
            <Button
              mode="outlined"
              onPress={() => navigation.push('Contacts', { user })}
              icon={(props) => <Feather {...props} name="users" />}
            >
              Contacts
            </Button>
            <Spacer />
            <Button
              mode="outlined"
              onPress={() => navigation.push('ReminderEdit', { user })}
              icon={(props) => <Feather {...props} name="bell" />}
            >
              Edit Reminders
            </Button>
            <Spacer />
            {/* <Button
              mode="outlined"
              disabled
              onPress={() => null}
              title="Settings"
              icon={(props) => <Feather {...props} name="settings" />}
            />
            <Spacer /> */}
            {storage?.devMode ? (
              <Button
                mode="outlined"
                onPress={() => navigation.push('Dev')}
                icon={(props) => <Feather {...props} name="code" />}
                color={c.err}
              >
                Dev
              </Button>
            ) : null}
          </View>
          <View style={[s.flx_c]}>
            <Button onPress={() => setShowFeedback(true)}>Send Feedback</Button>
            <Button
              color={c.err}
              onPress={() =>
                AreYouSure('Log out?', () => logOut().then(() => navigation.navigate('Welcome')))
              }
              icon={(props) => <Feather {...props} name="log-out" />}
            >
              Log out
            </Button>
          </View>
        </View>
      ) : (
        <View style={[s.c, s.flx_2]}>
          <Button
            icon={(props) => <Feather {...props} name="x" />}
            onPress={() =>
              isContact
                ? AreYouSure('Delete contact?', () => removeContact(user))
                : addContact(user)
            }
            color={c.err}
          >
            {isContact ? 'Remove' : 'Add'}
          </Button>
        </View>
      )}
      <Portal>
        <Dialog visible={showFeedback} onDismiss={() => setShowFeedback(false)}>
          <Dialog.Title>Send Feedback</Dialog.Title>
          <Dialog.Content>
            <Dialog.ScrollArea>
              <ScrollView>
                <Spacer />
                <Menu
                  visible={feedbackTypeVisible}
                  onDismiss={() => setFeedbackTypeVisible(false)}
                  anchor={
                    <Button onPress={() => setFeedbackTypeVisible(true)} mode="contained">
                      {FEEDBACK[feedbackForm.values.type].label}
                    </Button>
                  }
                >
                  {Object.entries(FEEDBACK).map(([value, info]) => (
                    <Menu.Item
                      key={value}
                      title={info.label}
                      icon={(props) => (
                        <Feather
                          {...props}
                          style={{ opacity: feedbackForm.values.type === value ? 1 : 0 }}
                          name="check"
                        />
                      )}
                      onPress={() => {
                        feedbackForm.setFieldValue('type', value)
                        setFeedbackTypeVisible(false)
                      }}
                    />
                  ))}
                </Menu>
                <Spacer />
                <TextInput
                  label="Feedback"
                  defaultValue={feedbackForm.values.text}
                  onChangeText={(v) => feedbackForm.setFieldValue('text', v)}
                  multiline
                />
                <Spacer />
                <List.Item
                  title="Include logs"
                  right={() => (
                    <Checkbox
                      status={feedbackForm.values.logs ? 'checked' : 'unchecked'}
                      onPress={() => feedbackForm.setFieldValue('logs', !feedbackForm.values.logs)}
                    />
                  )}
                />
              </ScrollView>
            </Dialog.ScrollArea>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowFeedback(false)}>Cancel</Button>
            <Spacer />
            <Button onPress={() => feedbackForm.submitForm()}>Send</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  )
}
