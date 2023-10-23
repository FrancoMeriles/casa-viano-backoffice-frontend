/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-children-prop */
import React, { useState, useEffect } from 'react'
import Head from 'next/head'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import axios from '@services/local'
import { getErrorUrl } from '@utils/index'

import useLoader from '@hooks/useLoader'

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
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from '@chakra-ui/react'
import {
  AiOutlineEdit,
  AiOutlineDelete,
  AiOutlinePicture,
} from 'react-icons/ai'
import { jwtVerify } from 'jose'
import { ProductsInterface } from '@app-types/products'

import { UserTokenType } from '@app-types/user'
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
  user: UserTokenType
  products: ProductsInterface[]
}

export default function Products({ user, products }: Props) {
  const [idSelectedProduct, setIdSelectedProduct] = useState('')
  const [listProducts, setListProducts] = useState(products)
  const [noResultsProducts, setNoResultsProducts] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)
  const [query, setQuery] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)

  const { setLoaderState } = useLoader()
  const toast = useToast()
  const handleChange = (event: {
    target: { value: React.SetStateAction<string> }
  }) => setQuery(event.target.value)

  useEffect(() => {
    if (!query) {
      setNoResultsProducts(false)
      setListProducts(products)
    }
  }, [query, products])

  const searchProductsHandler = async () => {
    setLoaderState({ show: true })
    const { data } = await axios.get(`/products/search/${query}`)
    if (data.products && data.products.length > 0) {
      setListProducts(data.products)
    } else {
      setNoResultsProducts(true)
    }
    setLoaderState({ show: false })
  }
  const handleFeaturedProduct = async ({ id, featured }: any) => {
    setLoaderState({ show: true })
    try {
      await axios.post(`/products/edit/${id}`, {
        featured: !featured,
      })
      window.location.reload()
    } catch (error) {
      console.log('err')
      setLoaderState({ show: false })
    }
  }
  const handleAvailableProduct = async ({ id, is_available }: any) => {
    setLoaderState({ show: true })
    try {
      await axios.post(`/products/edit/${id}`, {
        is_available: !is_available,
      })
      window.location.reload()
    } catch (error) {
      console.log('err')
      setLoaderState({ show: false })
    }
  }
  const { push } = useRouter()
  const handleDeleteProduct = async () => {
    setLoadingBtn(true)
    try {
      await axios.post(`/products/delete/${idSelectedProduct}`)
      window.location.reload()
    } catch (error) {
      toast({
        title: 'Hubo un problema al borrar el producto',
        description: 'Por favor intenta nuevamente',
        status: 'error',
        duration: 9000,
        isClosable: true,
      })
      console.log(error)
      setLoadingBtn(false)
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
      <Header user={user} />

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
          <Box mb="20px">
            <InputGroup maxW="400px">
              <Input
                value={query}
                onChange={handleChange}
                placeholder="Buscar producto"
                size="lg"
              />
              <InputRightElement width="6rem">
                <Button
                  height="2.9rem"
                  mt="8px"
                  mr="1px"
                  borderLeftRadius="0px"
                  borderRightRadius="5px"
                  size="lg"
                  colorScheme="brand"
                  onClick={searchProductsHandler}
                >
                  Buscar
                </Button>
              </InputRightElement>
            </InputGroup>
          </Box>
          {listProducts &&
            !noResultsProducts &&
            listProducts.length > 0 &&
            listProducts.map((product) => {
              let principalImage
              if (product.images && product.images.length > 0) {
                principalImage = product.images.find((image) => image.principal)
              }
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
                  position="relative"
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
                      icon={
                        <AiOutlineEdit color="blue.900" fontSize="1.5rem" />
                      }
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
                  <Box top="2" right="2" position="absolute">
                    <Badge
                      cursor="pointer"
                      ml="2"
                      colorScheme="green"
                      fontSize="0.9em"
                      onClick={() =>
                        handleFeaturedProduct({
                          id: product._id,
                          featured: product.featured,
                        })
                      }
                    >
                      {product.featured ? 'Destacado' : 'No destacado'}
                    </Badge>

                    <Badge
                      cursor="pointer"
                      ml="2"
                      colorScheme="purple"
                      fontSize="0.9em"
                      onClick={() =>
                        handleAvailableProduct({
                          id: product._id,
                          is_available: product.is_available,
                        })
                      }
                    >
                      {product.is_available ? 'Disponible' : 'No disponible'}
                    </Badge>
                  </Box>
                </Box>
              )
            })}

          {noResultsProducts && (
            <Heading
              color="gray.500"
              padding="20px"
              textAlign="center"
              size="5xl"
              fontWeight="medium"
            >
              No se encontraron resultados
            </Heading>
          )}
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
                    loadingText="Eliminando"
                    isLoading={loadingBtn}
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
