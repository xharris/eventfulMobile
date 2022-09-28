import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import { useEffect } from 'react'
import { Pressable, View } from 'react-native'
import { ActivityIndicator, Checkbox, FAB, Headline, Title } from 'react-native-paper'
import { Subheading } from 'react-native-paper'
import { Eventful } from 'types'
import { H5 } from '../components/Header'
import { LoadingView } from '../components/LoadingView'
import { useEvent } from '../eventfulLib/event'
import { TagSelector } from '../features/TagSelector'
import { extend } from '../libs/log'
import { s } from '../libs/styles'

const log = extend('eventsetting')

export const EventSettingScreen = ({
  navigation,
  route,
}: Eventful.RN.EventStackScreenProps<'EventSetting'>) => {
  const { event: eventId } = route.params
  const { data: event, updateEvent } = useEvent({ id: eventId })
  const { dirty, values, setFieldValue, submitForm } = useFormik({
    initialValues: {
      private: event?.private,
      tags: event?.tags?.map((t) => t._id) ?? [],
    },
    enableReinitialize: true,
    onSubmit(v) {
      updateEvent(v)
    },
  })

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Settings',
    })
  }, [navigation, event])

  return (
    <LoadingView loading={!event} style={[s.flx_1, s.c]} edges={['bottom', 'left', 'right']}>
      <TagSelector value={values.tags} onChange={(tags) => setFieldValue('tags', tags)} />
      <Pressable
        style={[s.flx_r, s.aic, s.jcsb]}
        onPress={() => setFieldValue('private', !values.private)}
      >
        <H5>{'Private (invite only)'}</H5>
        <Checkbox status={values.private ? 'checked' : 'unchecked'} />
      </Pressable>
      {dirty ? (
        <FAB
          style={[s.fab]}
          icon={(props) => <Feather {...props} name="save" />}
          onPress={() => submitForm()}
        />
      ) : null}
    </LoadingView>
  )
}
