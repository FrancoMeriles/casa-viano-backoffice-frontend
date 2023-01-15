import '../styles/index.scss'
import type { AppProps } from 'next/app'

/* Fonts */
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/700.css'

/* Contexts */
import LoaderProvider from '@contexts/LoaderProvider'

/* Chakra UI */
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { theme as proTheme } from '@chakra-ui/pro-theme'

export const theme = extendTheme(
  {
    colors: {
      ...proTheme.colors,
      brand: {
        100: '#040419',
        500: '#000054',
      },
    },
    fonts: {
      heading: `'Roboto', sans-serif;`,
      body: `'Roboto', sans-serif`,
    },
  },
  proTheme
)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <LoaderProvider>
        <Component {...pageProps} />
      </LoaderProvider>
    </ChakraProvider>
  )
}
