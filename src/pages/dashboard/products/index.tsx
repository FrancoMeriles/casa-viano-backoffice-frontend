import Head from 'next/head'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import axios from '@services/local'
import { getErrorUrl } from '@utils/index'

import { Box, Heading, Image, IconButton, Button, Flex } from '@chakra-ui/react'
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { jwtVerify } from 'jose'
import { ProductsInterface } from '@app-types/products'

import { UserType } from '@app-types/user'

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
  const { payload } = await jwtVerify(token, new TextEncoder().encode('secret'))
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
  console.log(user)
  console.log(products)
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
                    onClick={() => console.log('click')}
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Editar"
                    icon={<AiOutlineEdit color="blue.900" fontSize="1.5rem" />}
                  />
                  <IconButton
                    onClick={() => console.log('click')}
                    as="a"
                    borderRadius="25px"
                    cursor="pointer"
                    aria-label="Borrar"
                    ml="10px"
                    mr="10px"
                    icon={
                      <AiOutlineDelete color="blue.900" fontSize="1.5rem" />
                    }
                  />
                </Box>
              </Box>
            )
          })}
        </Content>
      </main>
    </>
  )
}
