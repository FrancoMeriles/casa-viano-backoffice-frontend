/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
import { BsTrash } from 'react-icons/bs'
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
  Textarea,
  VStack,
  Image,
  IconButton,
  useToast,
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

const NewTestimonial = ({ user }: Props) => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [preview, setPreview] = useState<any>()
  const [inputKey, setInputKey] = useState<any>()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()
  const toast = useToast()

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
      setFieldValue(`images[0].principal`, false)
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
  const createTestimonial = async (data: any) => {
    setLoadingBtn(true)
    try {
      await service.post('/testimonials/new', data)
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
      <Header user={user} />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Nuevo Testimonio</Heading>
          </Flex>
          <Formik
            initialValues={{
              name: '',
              occupation: '',
              comment: '',
            }}
            onSubmit={(values) => createTestimonial(values)}
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

                  <FormControl maxW="400px">
                    <FormLabel>Imagen</FormLabel>
                    <Input
                      type="file"
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
                    size="lg"
                    isLoading={loadingBtn}
                    loadingText="Subiendo"
                    colorScheme="brand"
                    type="submit"
                  >
                    Crear Testimonio
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

export default NewTestimonial
