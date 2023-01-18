/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
import { useRouter } from 'next/router'
import { getErrorUrl } from '@utils/index'
import { jwtVerify } from 'jose'
import cookie from 'cookie'

import {
  Flex,
  Heading,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import { UserTokenType } from '@app-types/user'
import { TestimonialInterface } from '@app-types/testimonials'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await service.get(`/testimonials/${context?.query?.id}`)
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
      testimonial_id: context.query.id,
      testimonial: data.testimonial,
      user: payload,
    },
  }
}

interface Props {
  testimonial_id: string
  user: UserTokenType
  testimonial: TestimonialInterface
}

const EditTestimonial = ({ testimonial_id, user, testimonial }: Props) => {
  console.log(user)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()

  const updateTestimonial = async (data: any) => {
    setLoadingBtn(true)
    try {
      await service.post(`/testimonials/edit/${testimonial_id}`, data)
      push('/dashboard/testimonials')
    } catch (error) {
      console.log(error)
    }
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(50, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    occupation: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .required('Este campo es requerido'),
    comment: Yup.string()
      .min(4, 'Debe contener al menos 20 carácteres')
      .required('Este campo es requerido'),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Nuevo Testimonio</title>
        <meta name="description" content="Casa Viano - Nuevo Testimonio" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Nuevo Testimonio</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: testimonial.name,
              occupation: testimonial.occupation,
              comment: testimonial.comment,
            }}
            onSubmit={(values) => updateTestimonial(values)}
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
                  <FormControl
                    isInvalid={!!errors.occupation && touched.occupation}
                  >
                    <FormLabel htmlFor="occupation">Ocupación</FormLabel>
                    <Field
                      as={Textarea}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="occupation"
                    />
                    <FormErrorMessage>{errors.occupation}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.comment && touched.comment}>
                    <FormLabel htmlFor="comment">Comentario</FormLabel>
                    <Field
                      as={Textarea}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="comment"
                    />
                    <FormErrorMessage>{errors.comment}</FormErrorMessage>
                  </FormControl>
                  <Button
                    size="lg"
                    isLoading={loadingBtn}
                    loadingText="Actualizando"
                    colorScheme="brand"
                    type="submit"
                  >
                    Actualizando Testimonio
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

export default EditTestimonial
