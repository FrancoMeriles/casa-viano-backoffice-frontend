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
import { ProductsInterface } from '@app-types/products'

import { UserType } from '@app-types/user'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/products`)
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
      products: data.products,
    },
  }
}

interface Props {
  user: UserType
  products: ProductsInterface[]
}

export default function Products({ user, products }: Props) {
  const [idSelectedProduct, setIdSelectedProduct] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const { push } = useRouter()
  console.log(user)
  const handleDeleteProduct = async () => {
    try {
      await axios.post(`/products/delete/${idSelectedProduct}`)
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseDialog = async () => {
    setIdSelectedProduct('')
    onClose()
  }
  return (
    <>
      <Head>
        <title>Casa Viano - Dashboard Productos</title>
        <meta name="description" content="Casa Viano - Dashboard Productos" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Productos</Heading>
            <Button
              onClick={() => push('/dashboard/products/new')}
              size="lg"
              colorScheme="brand"
              borderRadius="40px"
              _hover={{
                bg: 'white',
                color: 'brand.100',
              }}
            >
              Nuevo Producto
            </Button>
          </Flex>

          {products.map((product) => {
            const principalImage = product.images.find(
              (image) => image.principal
            )
            return (
              <Box
                key={product._id}
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
                    src={principalImage?.path}
                    alt={product.slug}
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
                    {product.name}
                  </Heading>
                </Box>
                <Box>
                  <IconButton
                    onClick={() =>
                      push(`/dashboard/products/edit/${product._id}`)
                    }
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Editar"
                    icon={<AiOutlineEdit color="blue.900" fontSize="1.5rem" />}
                  />
                  <IconButton
                    onClick={() =>
                      push(`/dashboard/products/images/${product._id}`)
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
                      setIdSelectedProduct(product._id)
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
                  Borrar Producto
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿ Esta seguro que quiere borrar el producto ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button
                    colorScheme="red"
                    onClick={handleDeleteProduct}
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
