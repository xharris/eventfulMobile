import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, FAB, TouchableRipple } from 'react-native-paper'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { Button } from '../components/Button'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { TimeInput } from '../components/TimeInput'
import { useContacts } from '../eventfulLib/contact'
import { useEvent } from '../eventfulLib/event'
import { usePlan } from '../eventfulLib/plan'
import { useSession } from '../eventfulLib/session'
import { c, s, spacing } from '../libs/styles'
import { ContactSelectEvent } from './ContactSelect'

export const PlanEditScreen = ({ navigation, route }: Eventful.RN.StackProps<'PlanEditScreen'>) => {
  const { plan: planId } = route.params
  const { data: plan, updatePlan, isFetching, isRefetching } = usePlan({ plan: planId })

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit plan',
    })
  }, [navigation])

  const { errors, setFieldValue, resetForm, values, dirty, submitForm } =
    useFormik<Eventful.API.PlanEdit>({
      initialValues: {
        _id: null,
        ...plan,
        who: plan?.who?.map((user) => user._id) ?? [],
      },
      enableReinitialize: true,
      onSubmit: (values) => {
        updatePlan({
          ...values,
          _id: plan?._id,
        }).then(() => resetForm())
      },
    })

  const { session } = useSession()

  ContactSelectEvent.useListen((users) => {
    setFieldValue('who', users)
  })

  return isFetching && !isRefetching ? (
    <View style={[s.c, s.flx_1]}>
      <ActivityIndicator size="large" />
    </View>
  ) : (
    <View style={[s.c, s.flx_1]}>
      <TextInput
        label="What"
        error={!!errors['what']}
        value={values.what}
        onChangeText={(v) => setFieldValue('what', v)}
      />
      <Spacer />
      <TextInput
        label="Where"
        value={values.location?.address ?? ''}
        onChangeText={(v) => setFieldValue('location.address', v)}
      />
      <Spacer />
      <Button
        onPress={() =>
          navigation.push('ContactSelect', {
            user: session?._id,
            selected: values.who ?? [],
          })
        }
        transparent
        outlined
      >
        <H5 style={{ color: c.oneDark }}>Who</H5>
        <AvatarGroup avatars={values.who?.map((id) => ({ id }))} />
      </Button>
      <Spacer />
      <TimeInput
        // label="When"
        startLabel="Start"
        endLabel="End"
        defaultValue={values.time}
        onChange={(v) => {
          setFieldValue('time', v)
        }}
      />
      {dirty ? (
        <FAB
          style={{ position: 'absolute', margin: 16, right: 0, bottom: 0 }}
          icon={(props) => <Feather {...props} name="save" />}
          onPress={submitForm}
        />
      ) : null}
    </View>
  )
}
