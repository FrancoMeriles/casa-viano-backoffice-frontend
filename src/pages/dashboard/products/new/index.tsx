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
} from '@chakra-ui/react'
import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

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

const NewProduct = () => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [preview, setPreview] = useState<any>()
  const [inputKey, setInputKey] = useState<any>()
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
      console.log('Image size must be of 1MB or less')
    }
  }
  const createPorduct = async (data: any) => {
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
      console.log(error)
    }
  }
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .max(50, 'El nombre es muy largo')
      .required('Este campo es requerido'),
    description: Yup.string()
      .min(4, 'Debe contener al menos 20 carácteres')
      .required('Este campo es requerido'),
    body: Yup.string()
      .min(4, 'Debe contener al menos 20 carácteres')
      .required('Este campo es requerido'),
    is_available: Yup.boolean(),
    condition: Yup.string().required('Este campo es requerido'),
    featured: Yup.boolean(),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Nuevo Producto</title>
        <meta name="description" content="Casa Viano - Nuevo Producto" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
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
              is_available: false,
              condition: '',
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
                  </FormControl>
                  <FormControl maxW="400px">
                    <FormLabel>Imagen Destacada</FormLabel>
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
                  <Button size="lg" colorScheme="brand" type="submit">
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
