/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { GetServerSideProps } from 'next'
import axios from '@services/local'
import { getErrorUrl } from '@utils/index'
import { jwtVerify } from 'jose'
import cookie from 'cookie'
import { UserType } from '@app-types/user'
import { ProductsInterface } from '@app-types/products'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import { AttributesType } from '@app-types/products'

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
  Select,
  Switch,
  Box,
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/product/${context?.query?.id}`)
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
      product_id: context.query.id,
      product: data.product,
      user: payload,
    },
  }
}

interface Props {
  product_id: string
  user: UserType
  product: ProductsInterface
}

const Index = ({ product_id, user, product }: Props) => {
  console.log(user)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const createPorduct = async (data: any) => {
    setLoadingBtn(true)

    const emptyAttributes = data.attributes.filter(
      (attribute: AttributesType) => attribute.key && attribute.value
    )
    const newData = {
      ...data,
      attributes: emptyAttributes,
    }
    await axios.post(`/products/edit/${product_id}`, newData)
    window.location.reload()
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(70, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    description: Yup.string()
      .min(20, 'Debe contener al menos 20 carácteres')
      .required('Este campo es requerido'),
    body: Yup.string()
      .min(20, 'Debe contener al menos 20 carácteres')
      .required('Este campo es requerido'),
    is_available: Yup.boolean(),
    condition: Yup.string().required('Este campo es requerido'),
    featured: Yup.boolean(),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Editar Producto</title>
        <meta name="description" content="Casa Viano - Editar Producto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Editar Producto</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: product.name,
              description: product.description,
              body: product.body,
              is_available: product.is_available,
              condition: product.condition,
              attributes: product.attributes,
              featured: product.featured,
            }}
            onSubmit={(values) => createPorduct(values)}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, errors, touched, values }) => (
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
                    isInvalid={!!errors.description && touched.description}
                  >
                    <FormLabel htmlFor="description">Descripción</FormLabel>
                    <Field
                      as={Textarea}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="description"
                    />
                    <FormErrorMessage>{errors.description}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.body && touched.body}>
                    <FormLabel htmlFor="body">Resumen</FormLabel>
                    <Field
                      as={Textarea}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      name="body"
                    />
                    <FormErrorMessage>{errors.body}</FormErrorMessage>
                  </FormControl>

                  <FormControl
                    isInvalid={!!errors.condition && touched.condition}
                  >
                    <FormLabel htmlFor="condition">Condición</FormLabel>
                    <Field
                      as={Select}
                      borderColor="gray.100"
                      _hover={{
                        bg: 'white',
                      }}
                      bg="white"
                      name="condition"
                      size="lg"
                    >
                      <option value="">Seleccionar</option>
                      <option value="new">Nuevo</option>
                      <option value="used">Usado</option>
                    </Field>
                    <FormErrorMessage>{errors.condition}</FormErrorMessage>
                  </FormControl>

                  {['0', 1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
                    return (
                      <FormControl key={id}>
                        <FormLabel htmlFor={`attributes[${id}]`} mb="0">
                          Atributos
                        </FormLabel>
                        <Box display="flex">
                          <Field
                            flex="1"
                            as={Input}
                            name={`attributes[${id}].key`}
                            placeholder="Titulo"
                            mr="20px"
                          />
                          <Field
                            flex="2"
                            as={Textarea}
                            name={`attributes[${id}].value`}
                            placeholder="Descripción"
                          />
                        </Box>
                      </FormControl>
                    )
                  })}
                  <FormControl>
                    <FormLabel htmlFor="is_available" mb="0">
                      Producto disponible
                    </FormLabel>
                    <Field
                      as={Switch}
                      name="is_available"
                      size="lg"
                      colorScheme="teal"
                      isChecked={values.is_available}
                    />
                  </FormControl>
                  <FormControl pt="20px" pb="20px">
                    <FormLabel htmlFor="featured" mb="0">
                      Producto destacado
                    </FormLabel>
                    <Field
                      as={Switch}
                      name="featured"
                      size="lg"
                      colorScheme="teal"
                      isChecked={values.featured}
                    />
                  </FormControl>
                  <Button
                    size="lg"
                    colorScheme="brand"
                    type="submit"
                    isLoading={loadingBtn}
                  >
                    Actualizar Producto
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

export default Index
