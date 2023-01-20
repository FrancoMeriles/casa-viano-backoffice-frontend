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
import { UserTokenType, UserType } from '@app-types/user'
import { getErrorUrl } from '@utils/index'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await service.get(`/users/${context?.query?.id}`, {
      headers: {
        cookie: context.req.headers.cookie,
      },
    })
    data = response.data
  } catch (err) {
    return {
      redirect: {
        destination: getErrorUrl(err),
      },
      props: {},
    }
  }
  const { token } = cookie.parse(context.req.headers.cookie || '')
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )
  return {
    props: {
      user_id: context.query.id,
      user: data.user,
      userToken: payload,
    },
  }
}

interface Props {
  user_id: string
  userToken: UserTokenType
  user: UserType
}

const NewUser = ({ user, user_id, userToken }: Props) => {
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()

  const editUser = async (data: any) => {
    setLoadingBtn(true)
    try {
      await service.post(`/users/edit/${user_id}`, data)
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
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Editar Usuario</title>
        <meta name="description" content="Casa Viano - Editar Usuario" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={userToken} />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Editar Usuario</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: user.name,
              email: user.email,
            }}
            onSubmit={(values) => editUser(values)}
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
                  <Button
                    size="lg"
                    isLoading={loadingBtn}
                    loadingText="Actualizando"
                    colorScheme="brand"
                    type="submit"
                  >
                    Editar Usuario
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
