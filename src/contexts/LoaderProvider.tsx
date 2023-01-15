/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, useState } from 'react'
import Loader from '@components/Loader'

interface LoaderState {
  show: boolean
}

interface LoaderProviderProps {
  children: React.ReactNode
}

interface LoaderContextInterface {
  state: LoaderState
  setLoaderState: SetLoaderState
}

type SetLoaderState = (_newLoaderState: LoaderState) => void

const initialLoaderState: LoaderState = {
  show: false,
}

export const LoaderContext = createContext<LoaderContextInterface>({
  state: initialLoaderState,
  setLoaderState: () => {},
})

const LoaderProvider: React.FC<LoaderProviderProps> = ({ children }) => {
  const [loaderState, setLoaderState] =
    useState<LoaderState>(initialLoaderState)

  const handleLoaderStateChange: SetLoaderState = (
    newLoaderState: LoaderState
  ) => {
    setLoaderState((oldState) => ({ ...oldState, ...newLoaderState }))
  }
  return (
    <LoaderContext.Provider
      value={{ state: loaderState, setLoaderState: handleLoaderStateChange }}
    >
      {children}

      <Loader />
    </LoaderContext.Provider>
  )
}

export default LoaderProvider
