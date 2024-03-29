/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
import { AttributesType } from '@app-types/products'
import { BsTrash } from 'react-icons/bs'
import { useRouter } from 'next/router'

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
  Image,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'
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

const convertToBase64 = (file: Blob) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = (error) => {
      reject(error)
    }
  })
}

interface Props {
  user: UserTokenType
}

const NewProduct = ({ user }: Props) => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [preview, setPreview] = useState<any>()
  const [inputKey, setInputKey] = useState<any>()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const toast = useToast()

  const { push } = useRouter()

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: {
      (field: string, value: any, shouldValidate?: boolean | undefined): void
      (arg0: string, arg1: unknown): void
    }
  ) => {
    // const file: File = (event.target as HTMLInputElement)?.files?.[0]
    const target = event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]

    if (!file || file.length === 0) {
      setSelectedFile(undefined)
      return
    }

    setSelectedFile(file)

    if (file?.size / 1024 / 1024 < 1) {
      const base64 = await convertToBase64(file)
      setFieldValue(`images[0].code`, base64)
      setFieldValue(`images[0].principal`, true)
    } else {
      setSelectedFile(undefined)
      console.log('Image size must be of 1MB or less')
      toast({
        title: 'Imagen muy pesada',
        description: 'El peso debe ser menos de 1MB',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
    }
  }
  const createPorduct = async (data: any) => {
    setLoadingBtn(true)
    const emptyAttributes = data.attributes.filter(
      (attribute: AttributesType) => attribute.key && attribute.value
    )
    const newData = {
      ...data,
      attributes: emptyAttributes,
    }
    try {
      await service.post('/products/new', newData)
      push('/dashboard/products')
    } catch (error) {
      console.log('akiiii')
      console.log(error.response.data)
      toast({
        title: 'Error al crear el producto, revisar los campos faltantes',
        description: error?.response?.data?.data?.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      setLoadingBtn(false)
    }
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(50, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    description: Yup.string().min(4, 'Debe contener al menos 20 carácteres'),
    body: Yup.string().min(4, 'Debe contener al menos 20 carácteres'),
    is_available: Yup.boolean().required('Este campo es requerido'),
    condition: Yup.string().required('Este campo es requerido'),
    featured: Yup.boolean().required('Este campo es requerido'),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Nuevo Producto</title>
        <meta name="description" content="Casa Viano - Nuevo Producto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Nuevo Producto</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: '',
              description: '',
              body: '',
              condition: '',
              is_available: false,
              featured: false,
              attributes: [
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
                { key: '', value: '' },
              ],
            }}
            onSubmit={(values) => createPorduct(values)}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, errors, touched, setFieldValue }) => (
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
                    />
                    <FormErrorMessage>{errors.featured}</FormErrorMessage>
                  </FormControl>
                  <FormControl maxW="400px">
                    <FormLabel>Imagen Destacada</FormLabel>
                    <Input
                      type="file"
                      accept="image/jpeg"
                      name="file"
                      multiple
                      key={inputKey || ''}
                      onChange={(event) => {
                        handleFileUpload(event, setFieldValue)
                      }}
                      sx={{
                        '::file-selector-button': {
                          height: 10,
                          padding: 0,
                          mr: 4,
                          background: 'none',
                          border: 'none',
                          fontWeight: 'bold',
                        },
                      }}
                    />
                    {selectedFile && (
                      <>
                        <Image
                          mt="15px"
                          borderRadius="5px"
                          src={preview}
                          alt="Preview"
                          position="relative"
                        />

                        <IconButton
                          onClick={() => {
                            setInputKey(Math.random().toString(36))
                            setFieldValue(`images[0]`, null)
                            setSelectedFile(undefined)
                          }}
                          position="absolute"
                          bottom="3"
                          borderRadius="50px"
                          right="3"
                          bg="gray.100"
                          aria-label="Eliminar"
                          icon={<BsTrash color="red" fontSize="1.25rem" />}
                        />
                      </>
                    )}
                  </FormControl>
                  <Button
                    disabled={!selectedFile}
                    isLoading={loadingBtn}
                    loadingText="Subiendo"
                    size="lg"
                    colorScheme="brand"
                    type="submit"
                  >
                    Crear Producto
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

export default NewProduct
