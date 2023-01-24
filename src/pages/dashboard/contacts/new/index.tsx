/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import cookie from 'cookie'
import axios from '@services/local'
import { getErrorUrl, translateTypesMessage } from '@utils/index'

import {
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Textarea,
  Select,
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'
import { jwtVerify } from 'jose'
import { UserTokenType } from '@app-types/user'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/messages/types`)
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
      user: payload,
      types: data.types,
    },
  }
}

interface Props {
  user: UserTokenType
  types: string[]
}

const NewMessage = ({ user, types }: Props) => {
  console.log(types)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()

  const createMessage = async (data: any) => {
    setLoadingBtn(true)
    console.log(data)
    try {
      await service.post('/messages/new', data)
      push('/dashboard/contacts')
    } catch (error) {
      console.log(error)
      setLoadingBtn(false)
    }
  }
  const validationSchema = Yup.object({
    content: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(20, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    phone: Yup.number()
      .typeError('Este campo tiene que ser solo números')
      .required('Este campo es requerido'),
    type: Yup.string().required('Este campo es requerido'),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Nuevo Mensaje</title>
        <meta name="description" content="Casa Viano - Nuevo Mensaje" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Nuevo Mensaje</Heading>
          </Flex>
          <Formik
            initialValues={{
              content: '',
              phone: '',
              type: '',
            }}
            onSubmit={(values) => createMessage(values)}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.phone && touched.phone}>
                    <FormLabel htmlFor="phone">Numero de teléfono</FormLabel>
                    <Field
                      as={Input}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      type="tel"
                      name="phone"
                    />
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.content && touched.content}>
                    <FormLabel htmlFor="content">Mensaje</FormLabel>
                    <Field
                      as={Textarea}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="content"
                    />
                    <FormErrorMessage>{errors.content}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.type && touched.type}>
                    <FormLabel htmlFor="type">Tipo</FormLabel>
                    <Field
                      as={Select}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      bg="white"
                      name="type"
                      size="lg"
                    >
                      <option value="">Seleccionar</option>
                      {types &&
                        types.length > 0 &&
                        types.map((type) => (
                          <option key={type} value={type}>
                            {translateTypesMessage(type)}
                          </option>
                        ))}
                    </Field>
                    <FormErrorMessage>{errors.type}</FormErrorMessage>
                  </FormControl>

                  <Button
                    size="lg"
                    isLoading={loadingBtn}
                    loadingText="Subiendo"
                    colorScheme="brand"
                    type="submit"
                  >
                    Crear Mensaje
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

export default NewMessage
