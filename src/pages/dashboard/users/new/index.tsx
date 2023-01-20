/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'

import {
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'
import { jwtVerify } from 'jose'
import { UserTokenType } from '@app-types/user'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = cookie.parse(context.req.headers.cookie || '')
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )
  return {
    props: {
      user: payload,
    },
  }
}

interface Props {
  user: UserTokenType
}

const NewUser = ({ user }: Props) => {
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()

  const createUser = async (data: any) => {
    setLoadingBtn(true)
    try {
      await service.post('/users/new', data)
      push('/dashboard/users')
    } catch (error) {
      console.log(error)
      setLoadingBtn(false)
    }
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(50, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    email: Yup.string().email().required('Este campo es requerido'),
    password: Yup.string()
      .min(8, 'Debe contener al menos 8 carácteres')
      .required('Este campo es requerido'),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Nuevo Usuario</title>
        <meta name="description" content="Casa Viano - Nuevo Usuario" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Nuevo Usuario</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
            onSubmit={(values) => createUser(values)}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.name && touched.name}>
                    <FormLabel htmlFor="name">Nombre</FormLabel>
                    <Field
                      as={Input}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="name"
                    />
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field
                      as={Input}
                      type="email"
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="email"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <Field
                      as={Input}
                      type="password"
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="password"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button
                    size="lg"
                    isLoading={loadingBtn}
                    loadingText="Subiendo"
                    colorScheme="brand"
                    type="submit"
                  >
                    Crear Usuario
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Content>
      </main>
    </>
  )
}

export default NewUser
