import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Spinner, Box } from '@chakra-ui/react'

import useLoader from '@hooks/useLoader'

const Loader = () => {
  const router = useRouter()

  const { loaderState, setLoaderState } = useLoader()

  useEffect(() => {
    const handleStart = () => setLoaderState({ show: true })

    const handleComplete = () => setLoaderState({ show: false })

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  })

  return (
    <>
      {loaderState.show && (
        <Box
          position="fixed"
          zIndex="9999"
          top="0"
          bottom="0"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="whiteAlpha.800"
        >
          <Spinner />
        </Box>
      )}
    </>
  )
}

export default Loader
