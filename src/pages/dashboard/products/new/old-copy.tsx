/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Head from 'next/head'
import { Formik, Field } from 'formik'
import * as Yup from 'yup'
import service from '@services/local'
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
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: {
      (field: string, value: any, shouldValidate?: boolean | undefined): void
      (arg0: string, arg1: unknown): void
    },
    id: string | number
  ) => {
    // const file: File = (event.target as HTMLInputElement)?.files?.[0]
    const target = event.target as HTMLInputElement
    const file: File = (target.files as FileList)[0]
    if (file?.size / 1024 / 1024 < 1) {
      const base64 = await convertToBase64(file)
      setFieldValue(`images[${id}].code`, base64)
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
    await service.post('/products/new', newData)
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
                      id="name"
                      name="name"
                      type="name"
                      variant="filled"
                      bg="gray.100"
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
                      id="description"
                      name="description"
                      type="description"
                      variant="filled"
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
                      id="body"
                      name="body"
                      type="body"
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
                      id="condition"
                      name="condition"
                      type="condition"
                      size="lg"
                      variant="outline"
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
                            id={`attributes[${id}].key`}
                            name={`attributes[${id}].key`}
                            type={`attributes[${id}].key`}
                            placeholder="Titulo"
                            mr="20px"
                          />
                          <Field
                            flex="2"
                            as={Textarea}
                            id={`attributes[${id}].value`}
                            name={`attributes[${id}].value`}
                            type={`attributes[${id}].value`}
                            placeholder="Descripción"
                          />
                        </Box>
                      </FormControl>
                    )
                  })}
                  <Flex justify="space-between" w="100%" p="20px 0">
                    <FormControl
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormLabel htmlFor="is_available" mb="0">
                        Disponible
                      </FormLabel>
                      <Field
                        as={Switch}
                        id="is_available"
                        name="is_available"
                        type="is_available"
                        size="lg"
                        colorScheme="teal"
                      />
                    </FormControl>
                    <FormControl
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <FormLabel htmlFor="featured" mb="0">
                        Destacado
                      </FormLabel>
                      <Field
                        as={Switch}
                        id="featured"
                        name="featured"
                        type="featured"
                        size="lg"
                        colorScheme="teal"
                      />
                    </FormControl>
                  </Flex>
                  <Flex gap="30px" wrap="wrap">
                    {['0', 1, 2, 3, 4, 5, 6, 7, 8, 9].map((id) => {
                      return (
                        <FormControl key={id} maxW="300px">
                          <FormLabel>Imagen {id}</FormLabel>
                          <Input
                            type="file"
                            name="file"
                            multiple
                            onChange={(event) => {
                              handleFileUpload(event, setFieldValue, id)
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
                          <button
                            onClick={() => {
                              setFieldValue(`images[${id}].code`, '')
                            }}
                          >
                            remove
                          </button>
                          <FormLabel htmlFor="principal" mt="10px">
                            Es principal
                          </FormLabel>
                          <Field
                            as={Switch}
                            name={`images[${id}].principal`}
                            size="lg"
                          />
                        </FormControl>
                      )
                    })}
                  </Flex>
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

{
  /* <FormControl>
                    <FormLabel htmlFor="attribute" mb="0">
                      Atributos
                    </FormLabel>
                    <Box display="flex" mt="20px">
                      <Input
                        value={nameAttribute}
                        type="text"
                        onChange={(e) => setNameAttribute(e.target.value)}
                      />
                      <Button
                        onClick={() => {
                          setAttributes((prevState) => {
                            return [
                              ...prevState,
                              { [`attributes.${nameAttribute}`]: '' },
                            ]
                          })
                          setNameAttribute('')
                        }}
                        size="md"
                        ml="20px"
                        colorScheme="brand"
                      >
                        Crear atributo
                      </Button>
                    </Box>
                    {attributes.map((attribute) => {
                      const name = Object.keys(attribute)[0]
                      const label = name.split('.')[1]
                      return (
                        <Box key={name} mb="20px">
                          <FormLabel htmlFor={name} mb="0">
                            {label}
                          </FormLabel>
                          <Field as={Input} id={name} name={name} size="lg" />
                        </Box>
                      )
                    })}
                   
                  </FormControl> */
}

{
  /* <FormControl>
                    <FormLabel htmlFor="attributes[0]" mb="0">
                      Atributos
                    </FormLabel>
                    <Box display="flex">
                      <Field
                        as={Input}
                        id="attributes[0].key"
                        name="attributes[0].key"
                        type="attributes[0].key"
                        placeholder="Titulo"
                        flex="1"
                        mr="20px"
                      />
                      <Field
                        as={Textarea}
                        id="attributes[0].value"
                        name="attributes[0].value"
                        type="attributes[0].value"
                        placeholder="Descripción"
                        flex="2"
                      />
                    </Box>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="attributes[1]" mb="0">
                      Atributos
                    </FormLabel>
                    <Box display="flex">
                      <Field
                        flex="1"
                        as={Input}
                        id="attributes[1].key"
                        name="attributes[1].key"
                        type="attributes[1].key"
                        placeholder="Titulo"
                        mr="20px"
                      />
                      <Field
                        flex="2"
                        as={Textarea}
                        id="attributes[1].value"
                        name="attributes[1].value"
                        type="attributes[1].value"
                        placeholder="Descripción"
                      />
                    </Box>
                  </FormControl> */
}
