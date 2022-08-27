import Feather from '@expo/vector-icons/Feather'
import { useNavigationState } from '@react-navigation/native'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { View } from 'react-native'
import { ActivityIndicator, FAB, IconButton, Menu } from 'react-native-paper'
import { Eventful } from 'types'
import { AvatarGroup } from '../components/Avatar'
import { Button } from '../components/Button'
import { H5 } from '../components/Header'
import { Spacer } from '../components/Spacer'
import { TextInput } from '../components/TextInput'
import { TimeInput } from '../components/TimeInput'
import { CATEGORY_INFO, usePlan } from '../eventfulLib/plan'
import { useSession } from '../eventfulLib/session'
import { CATEGORY_ICON } from '../libs/plan'
import { c, s } from '../libs/styles'
import { ContactSelectEvent } from './ContactSelect'

export const PlanEditScreen = ({
  navigation,
  route,
}: Eventful.RN.EventStackScreenProps<'PlanEdit'>) => {
  const { plan: planId } = route.params
  const { data: plan, updatePlan, isFetching, isRefetching } = usePlan({ plan: planId })
  const [menuVisible, setMenuVisible] = useState(false)

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

  const info = useMemo(() => CATEGORY_INFO[values.category ?? plan?.category ?? 0], [plan, values])

  useEffect(() => {
    navigation.setOptions({
      headerTitle: 'Edit plan',
      headerRight: () => (
        <Menu
          visible={menuVisible}
          anchor={
            <IconButton
              icon={CATEGORY_ICON[values.category ?? 0]}
              onPress={() => setMenuVisible(true)}
            />
          }
          onDismiss={() => setMenuVisible(false)}
        >
          {Object.entries(CATEGORY_INFO).map(([key, cat]) => (
            <Menu.Item
              key={key}
              icon={CATEGORY_ICON[parseInt(key)]}
              title={cat.label}
              onPress={() => {
                setMenuVisible(false)
                setFieldValue('category', parseInt(key))
              }}
            />
          ))}
        </Menu>
      ),
    })
  }, [navigation, menuVisible, values])

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
      {info.fields.what ? (
        <TextInput
          label="What"
          error={!!errors['what']}
          value={values.what}
          onChangeText={(v) => setFieldValue('what', v)}
        />
      ) : null}
      <Spacer />
      {info.fields.location ? (
        <TextInput
          label="Where"
          value={values.location?.address ?? ''}
          onChangeText={(v) => setFieldValue('location.address', v)}
        />
      ) : null}
      <Spacer />
      {info.fields.who ? (
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
      ) : null}
      <Spacer />
      {info.fields.time ? (
        <TimeInput
          // label="When"
          startLabel="Start"
          endLabel="End"
          defaultValue={values.time}
          onChange={(v) => {
            setFieldValue('time', v)
          }}
        />
      ) : null}
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
