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
  Avatar,
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
import { AiOutlineEdit, AiOutlineDelete } from 'react-icons/ai'
import { jwtVerify } from 'jose'

import { UserTokenType, UserType } from '@app-types/user'
import { useRouter } from 'next/router'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/users`, {
      headers: {
        cookie: context.req.headers.cookie,
      },
    })
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
      users: data.users,
    },
  }
}

interface Props {
  user: UserTokenType
  users: UserType[]
}

export default function Users({ user, users }: Props) {
  const [idSelectedUser, setIdSelectedUser] = useState('')
  const [loadingBtn, setLoadingBtn] = useState(false)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef(null)

  const { push } = useRouter()
  const handleDeleteUser = async () => {
    setLoadingBtn(true)
    try {
      await axios.post(`/users/delete/${idSelectedUser}`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseDialog = async () => {
    setIdSelectedUser('')
    onClose()
  }
  return (
    <>
      <Head>
        <title>Casa Viano - Dashboard Usuarios</title>
        <meta name="description" content="Casa Viano - Dashboard Usuarios" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />

      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Usuarios</Heading>
            <Button
              onClick={() => push('/dashboard/users/new')}
              size="lg"
              colorScheme="brand"
              borderRadius="40px"
              _hover={{
                bg: 'white',
                color: 'brand.100',
              }}
            >
              Nuevo Usuario
            </Button>
          </Flex>
          <Flex gap="10px" wrap="wrap">
            {users.map((singleUser) => {
              return (
                <Box key={singleUser._id} textAlign="center" w="230px">
                  <Avatar size="2xl" name={singleUser.name} />
                  <Heading noOfLines={1} fontSize="3xl">
                    {singleUser.name}
                  </Heading>
                  <Box textAlign="center">
                    <IconButton
                      onClick={() =>
                        push(`/dashboard/users/edit/${singleUser._id}`)
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
                      onClick={() => {
                        setIdSelectedUser(singleUser._id)
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
          </Flex>
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Borrar Usuario
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿ Esta seguro que quiere borrar el usuario ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button
                    isLoading={loadingBtn}
                    loadingText="Borrando"
                    colorScheme="red"
                    onClick={handleDeleteUser}
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
