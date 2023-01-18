import React, { useState } from 'react'
import Head from 'next/head'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import axios from '@services/local'
import { getErrorUrl } from '@utils/index'

import {
  Box,
  Heading,
  Image,
  IconButton,
  Button,
  Flex,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogBody,
  useDisclosure,
} from '@chakra-ui/react'
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePicture,
} from 'react-icons/ai'
import { jwtVerify } from 'jose'
import { TestimonialInterface } from '@app-types/testimonials'

import { UserTokenType } from '@app-types/user'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/testimonials`)
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
      testimonials: data.testimonials,
    },
  }
}

interface Props {
  user: UserTokenType
  testimonials: TestimonialInterface[]
}

export default function Testimonials({ user, testimonials }: Props) {
  const [idSelectedTestimonial, setIdSelectedTestimonial] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const { push } = useRouter()
  console.log(user)
  const handleDeleteTestimonial = async () => {
    setLoadingBtn(true)
    try {
      await axios.post(`/testimonials/delete/${idSelectedTestimonial}`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseDialog = async () => {
    setIdSelectedTestimonial('')
    onClose()
  }
  return (
    <>
      <Head>
        <title>Casa Viano - Dashboard Testimonials</title>
        <meta
          name="description"
          content="Casa Viano - Dashboard Testimonials"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Testimonios</Heading>
            <Button
              onClick={() => push('/dashboard/testimonials/new')}
              size="lg"
              colorScheme="brand"
              borderRadius="40px"
              _hover={{
                bg: 'white',
                color: 'brand.100',
              }}
            >
              Nuevo Testimonio
            </Button>
          </Flex>

          {testimonials.map((testimonial) => {
            return (
              <Box
                key={testimonial._id}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                bg="gray.100"
                boxShadow="xs"
                mb="20px"
                borderRadius="10px"
              >
                <Box display="flex" alignItems="center">
                  <Image
                    src={testimonial.image?.path}
                    alt={testimonial._id}
                    height="150px"
                    width="200px"
                    objectFit="cover"
                    borderTopLeftRadius="10px"
                    borderBottomLeftRadius="10px"
                  />
                  <Heading
                    maxW="600px"
                    fontSize="2xl"
                    fontWeight="normal"
                    lineHeight="30px"
                    ml="20px"
                    noOfLines={3}
                  >
                    {testimonial.name}
                  </Heading>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      push(`/dashboard/testimonials/edit/${testimonial._id}`)
                    }
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Editar"
                    icon={<AiOutlineEdit color="blue.900" fontSize="1.5rem" />}
                  />
                  <IconButton
                    onClick={() =>
                      push(`/dashboard/testimonials/images/${testimonial._id}`)
                    }
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Borrar"
                    icon={
                      <AiOutlinePicture color="blue.900" fontSize="1.5rem" />
                    }
                  />
                  <IconButton
                    onClick={() => {
                      setIdSelectedTestimonial(testimonial._id)
                      onOpen()
                    }}
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Borrar"
                    mr="10px"
                    icon={
                      <AiOutlineDelete color="blue.900" fontSize="1.5rem" />
                    }
                  />
                </Box>
              </Box>
            )
          })}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Borrar Testimonio
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿ Esta seguro que quiere borrar el testimonio ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button
                    isLoading={loadingBtn}
                    loadingText="Borrando"
                    colorScheme="red"
                    onClick={handleDeleteTestimonial}
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
