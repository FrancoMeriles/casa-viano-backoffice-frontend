import { useContext } from 'react'
import { LoaderContext } from '@contexts/LoaderProvider'

const useLoader = () => {
  const context = useContext(LoaderContext)
  const { state, setLoaderState } = context

  return { loaderState: state, setLoaderState }
}

export default useLoader
