import Feather from '@expo/vector-icons/Feather'
import { useFormik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Dialog, Divider, Headline, IconButton, List, TextInput, Title } from 'react-native-paper'
import { Eventful } from 'types'
import { Button } from '../components/Button'
import { LoadingView } from '../components/LoadingView'
import { useSnackbar } from '../components/Snackbar'
import { Spacer } from '../components/Spacer'
import { useAccess } from '../eventfulLib/access'
import { useContacts } from '../eventfulLib/contact'
import { useEvents } from '../eventfulLib/event'
import { useSession } from '../eventfulLib/session'
import { useTag } from '../eventfulLib/tag'
import { Agenda } from '../features/Agenda'
import { UserAvatar } from '../features/UserAvatar'
import { extend } from '../libs/log'
import { c, s } from '../libs/styles'
import { ContactSelectEvent } from './ContactSelect'
import { Event } from './EventsScreen'

const log = extend('tagscreen')

export const TagScreen = ({ navigation, route }: Eventful.RN.MainStackScreenProps<'Tag'>) => {
  const { tag } = route.params
  const { data, isFetching, updateTag, refetch, isRefetching } = useTag({ tag })
  const [showTitleEdit, setShowTitleEdit] = useState(false)
  const { dirty, setFieldValue, values, submitForm } = useFormik<Eventful.API.TagEdit>({
    initialValues: {
      name: data?.name ?? '',
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      updateTag(values)
    },
  })
  const { session } = useSession()
  const { data: contacts } = useContacts({ user: session?._id })
  const [memberInvite, setMemberInvite] = useState<Eventful.User[]>([])
  const [memberRemove, setMemberRemove] = useState<Eventful.User[]>([]) // TODO or should this be handled in member list dialog?
  const { data: access, updateAccess } = useAccess()
  const { show } = useSnackbar()

  const canEdit = useMemo(
    () =>
      session?._id === data?.createdBy._id ||
      access?.tags.find((tag) => tag._id === data?._id && tag.canEdit),
    [access, data, session]
  )

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        canEdit ? (
          <Button
            title={data?.name}
            icon={() => (
              <Feather
                name="edit-2"
                size={s.h5.fontSize}
                style={{ color: c.oneDark, opacity: 0.5 }}
              />
            )}
            onPress={() => setShowTitleEdit(true)}
          />
        ) : (
          <Title>{data?.name}</Title>
        ),
    })
  }, [navigation, data, canEdit])

  ContactSelectEvent.useListen((users) => {
    setMemberInvite(
      contacts?.filter(
        (con) => users.some((id) => id === con._id) && !data?.users.some((u) => u._id === con._id)
      ) ?? []
    )
  })

  const canModerate = useMemo(
    () =>
      session?._id === data?.createdBy._id ||
      access?.tags.find((tag) => tag._id === data?._id && tag.canModerate),
    [access, data, session]
  )

  return (
    <LoadingView
      loading={!data || isFetching}
      style={[s.flx_1, s.c]}
      edges={['left', 'right', 'bottom']}
    >
      <View style={[s.flx_1, s.flx_c]}>
        <View style={[s.flx_r, s.aic, s.jcc]}>
          <Title>{`${data?.users.length ?? 1} member${
            (data?.users.length ?? 1) === 1 ? '' : 's'
          }`}</Title>
          {canModerate && session ? (
            <IconButton
              icon={(props) => <Feather {...props} name="user-plus" />}
              onPress={() =>
                navigation.push('ContactSelect', {
                  user: session._id,
                  selected: data?.users.map((u) => u._id) ?? [],
                  showMe: false,
                })
              }
            />
          ) : null}
        </View>
        <Spacer size={10} />
        <Divider />
        <Spacer size={10} />
        <Agenda
          style={[s.flx_1]}
          items={data?.events}
          noTimeHeader="TBD"
          renderItem={(event) => (
            <Event event={event} onPress={() => navigation.push('Event', { event: event._id })} />
          )}
          refreshing={isRefetching}
          onRefresh={() => refetch()}
        />
      </View>
      <Dialog visible={showTitleEdit} onDismiss={() => setShowTitleEdit(false)}>
        <Dialog.Content>
          <TextInput
            label="Tag name"
            value={values.name}
            onChangeText={(v) => setFieldValue('name', v)}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="Cancel" onPress={() => setShowTitleEdit(false)} />
          <Button
            title="Save"
            disabled={!dirty}
            onPress={() => {
              setShowTitleEdit(false)
              submitForm()
            }}
          />
        </Dialog.Actions>
      </Dialog>
      <Dialog visible={!!memberInvite.length} dismissable={false}>
        <Dialog.ScrollArea>
          <Dialog.Title>Invite these contacts?</Dialog.Title>
          <ScrollView style={[s.c]}>
            {memberInvite.map((user) => (
              <List.Item
                key={user._id.toString()}
                title={user.username}
                left={() => <UserAvatar user={user} />}
              />
            ))}
          </ScrollView>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setMemberInvite([])
              }}
            >
              No
            </Button>
            <Button
              onPress={() => {
                if (data) {
                  const members = [...memberInvite]
                  Promise.all(
                    members.map((user) =>
                      updateAccess({
                        ref: data._id,
                        refModel: 'tags',
                        user: user._id,
                        isInvited: true,
                      })
                    )
                  ).then(() =>
                    show({
                      text: `Invite${members.length === 1 ? '' : 's'} sent!`,
                    })
                  )
                  setMemberInvite([])
                }
              }}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog.ScrollArea>
      </Dialog>
    </LoadingView>
  )
}
