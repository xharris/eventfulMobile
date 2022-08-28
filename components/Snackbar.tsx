import { createContext, ReactNode, useContext, useState } from 'react'
import { Snackbar } from 'react-native-paper'
import { SnackbarProps } from 'react-native-paper/lib/typescript/components/Snackbar'

type ShowSnackbarProps = Omit<SnackbarProps, 'children' | 'visible' | 'theme' | 'onDismiss'> & {
  text: string
}

interface SnackbarContextProps {
  show: (props: ShowSnackbarProps) => void
}

const Context = createContext<SnackbarContextProps>({
  show: () => null,
})

export const useSnackbar = () => useContext(Context)

export const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [props, setProps] = useState<ShowSnackbarProps>()

  const show: SnackbarContextProps['show'] = (options) => setProps(options)

  return (
    <Context.Provider value={{ show }}>
      {children}
      <Snackbar
        duration={2000}
        {...props}
        wrapperStyle={[
          {
            marginBottom: 80,
          },
          props?.wrapperStyle,
        ]}
        visible={!!props}
        onDismiss={() => setProps(undefined)}
      >
        {props?.text}
      </Snackbar>
    </Context.Provider>
  )
}
