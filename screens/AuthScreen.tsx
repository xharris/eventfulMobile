import { FC, useEffect, useRef, useState } from 'react'
import { TextInputProps, View } from 'react-native'
import { Eventful } from 'types'
import { useSession } from '../eventfulLib/session'
import { s } from '../libs/styles'
import { useFormik } from 'formik'
import { Button } from '../components/Button'
import { TextInput } from '../components/TextInput'
import { Spacer } from '../components/Spacer'

export const AuthScreen = ({ navigation }: Eventful.RN.StackProps<'Auth'>) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [])

  const [isSigningUp, setIsSigningUp] = useState(false)
  const { logIn, signUp } = useSession()
  const { values, handleChange, submitForm } = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirm_password: '',
    },
    onSubmit: (values) => {
      isSigningUp
        ? signUp({ ...values, remember: true })
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Events' }],
              })
            })
            .catch(console.log)
        : logIn({ ...values, remember: true })
            .then(() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Events' }],
              })
            })
            .catch(console.log)
    },
  })

  return (
    <View style={[s.c, s.flx_1, s.flx_c, s.jcsa]}>
      <View style={[s.flx_c, s.jcsa]}>
        {isSigningUp ? (
          <>
            <TextInput
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              autoComplete="username-new"
              textContentType="username"
              autoCapitalize="none"
              autoFocus={true}
            />
            <TextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
              autoComplete="password-new"
              autoCapitalize="none"
              textContentType="newPassword"
            />
            <TextInput
              placeholder="Confirm Password"
              value={values.confirm_password}
              onChangeText={handleChange('confirm_password')}
              secureTextEntry
              autoComplete="password-new"
              autoCapitalize="none"
              textContentType="newPassword"
            />
          </>
        ) : (
          <>
            <TextInput
              placeholder="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              autoComplete="username"
              autoCapitalize="none"
              textContentType="username"
              autoFocus={true}
            />
            <TextInput
              placeholder="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              secureTextEntry
              autoComplete="password"
              autoCapitalize="none"
              textContentType="password"
            />
          </>
        )}
      </View>
      <View style={[s.flx_c, s.jcsa]}>
        <Button title={isSigningUp ? 'Sign up' : 'Log in'} onPress={submitForm} />
        <Spacer size={30} />
        <Button title={!isSigningUp ? 'Sign up instead' : 'Log in instead'} onPress={submitForm} />
      </View>
    </View>
  )
}
