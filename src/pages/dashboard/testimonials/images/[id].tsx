/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import axios from '@services/local'
import { getErrorUrl } from '@utils/index'
import { jwtVerify } from 'jose'
import cookie from 'cookie'
import { UserTokenType } from '@app-types/user'
import { ImagesType } from '@app-types/products'
import {
  Flex,
  Heading,
  Grid,
  GridItem,
  Image,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Box,
} from '@chakra-ui/react'
import { Formik } from 'formik'
import { BsTrash } from 'react-icons/bs'

import Head from 'next/head'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(
      `/testimonials/${context?.query?.id}/images`
    )
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
  console.log(data)
  return {
    props: {
      testimonial_id: context.query.id,
      images: data.images,
      user: payload,
    },
  }
}

interface Props {
  testimonial_id: string
  user: UserTokenType
  images: ImagesType[]
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

const Index = ({ testimonial_id, user, images }: Props) => {
  console.log(user)
  const [selectedFile, setSelectedFile] = useState<any>()
  const [idSelectedImage, setIdSelectedImage] = useState('')
  const [preview, setPreview] = useState<any>()
  const [inputKey, setInputKey] = useState<any>()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [loadingBtnDelete, setLoadingBtnDelete] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

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

  const handleDeleteImage = async () => {
    setLoadingBtnDelete(true)
    try {
      await axios.post(
        `/testimonials/delete/${testimonial_id}/images/${idSelectedImage}`
      )
      window.location.reload()
    } catch (error) {
      console.log(error)
      setLoadingBtnDelete(false)
    }
  }
  const handleCloseDialog = async () => {
    setIdSelectedImage('')
    onClose()
  }

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
    } else {
      setSelectedFile(undefined)
      console.log('Image size must be of 1MB or less')
    }
  }
  const uploadImage = async (data: any) => {
    console.log(data)
    setLoadingBtn(true)
    try {
      await axios.post(`/testimonials/${testimonial_id}/images/new`, data)
      window.location.reload()
    } catch (error) {
      console.log(error)
      setLoadingBtn(false)
    }
  }
  return (
    <>
      <Head>
        <title>Casa Viano - Editar Imagenes Testimonios</title>
        <meta
          name="description"
          content="Casa Viano - Editar Imagenes Testimonios"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Editar Imágenes</Heading>
          </Flex>
          <Grid templateColumns="repeat(2, 1fr)" gap="10px">
            {images &&
              images.length > 0 &&
              images.map((image) => {
                return (
                  <GridItem
                    key={image._id}
                    colSpan={{
                      base: 2,
                      md: 1,
                    }}
                    position="relative"
                  >
                    <Image
                      height={400}
                      objectFit="cover"
                      src={image.path}
                      alt={image._id}
                    />
                    <IconButton
                      onClick={() => {
                        setIdSelectedImage(image._id)
                        onOpen()
                      }}
                      position="absolute"
                      bottom="3"
                      borderRadius="50px"
                      right="3"
                      bg="gray.100"
                      aria-label="Eliminar"
                      icon={<BsTrash color="red" fontSize="1.25rem" />}
                    />
                  </GridItem>
                )
              })}
          </Grid>
          <Flex
            justifyContent="space-between"
            alignItems="center"
            mt="50px"
            mb="50px"
          >
            <Heading fontSize="4xl">Subir Imágen</Heading>
          </Flex>
          <Formik initialValues={{}} onSubmit={(values) => uploadImage(values)}>
            {({ handleSubmit, setFieldValue }) => (
              <form onSubmit={handleSubmit}>
                {!images ? (
                  <>
                    <FormControl maxW="400px">
                      <FormLabel>Imágen</FormLabel>
                      <Input
                        type="file"
                        name="file"
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
                      isLoading={loadingBtn}
                      loadingText="Subiendo"
                      mt="20px"
                      disabled={!selectedFile}
                      size="lg"
                      colorScheme="brand"
                      type="submit"
                    >
                      Subir Imagen
                    </Button>
                  </>
                ) : (
                  <Box>Necesita borrar la imagen para subir una nueva</Box>
                )}
              </form>
            )}
          </Formik>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Borrar Imagen
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿ Esta seguro que quiere borrar la imagen ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button
                    disabled={loadingBtnDelete}
                    onClick={handleCloseDialog}
                  >
                    Cancelar
                  </Button>
                  <Button
                    isLoading={loadingBtnDelete}
                    loadingText="Borrando"
                    colorScheme="red"
                    onClick={handleDeleteImage}
                    ml={3}
                  >
                    Borrar
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </Content>
      </main>
    </>
  )
}

export default Index
