import Head from 'next/head'
import React, { useState } from 'react'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'
import axios from '@services/local'
import { getErrorUrl } from '@utils/index'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import {
  Heading,
  Flex,
  Button,
  Box,
  Card,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  Text,
  IconButton,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  useDisclosure,
  Tag,
} from '@chakra-ui/react'
import { jwtVerify } from 'jose'
import { useRouter } from 'next/router'

import { UserTokenType } from '@app-types/user'
import { MessageType } from '@app-types/messages'
import { AiOutlineEdit } from 'react-icons/ai'

export const getServerSideProps: GetServerSideProps = async (context) => {
  let data
  try {
    const response = await axios.get(`/messages`)
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
      messages: data.messages,
    },
  }
}

interface Props {
  user: UserTokenType
  messages: MessageType[]
}

export default function Home({ user, messages }: Props) {
  const [idSelectedMessage, setIdSelectedMessage] = useState('')
  const { isOpen, onClose } = useDisclosure()
  // const { isOpen, onOpen, onClose } = useDisclosure()
  const [loadingBtn, setLoadingBtn] = useState(false)
  const cancelRef = React.useRef(null)

  const { push } = useRouter()
  const handleDeleteMessage = async () => {
    setLoadingBtn(true)
    try {
      await axios.post(`/messages/delete/${idSelectedMessage}`)
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  const handleCloseDialog = async () => {
    setIdSelectedMessage('')
    onClose()
  }

  const sliderMessages = messages.filter((message) => message.type === 'slider')
  const whatsappMessages = messages.filter(
    (message) => message.type === 'whatsapp-icon'
  )
  const productMessages = messages.filter(
    (message) => message.type === 'product'
  )

  return (
    <>
      <Head>
        <title>Casa Viano - Dashboard</title>
        <meta name="description" content="Casa Viano - Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header user={user} />

      <main>
        <Sidebar />
        <Content>
          <Flex justifyContent="space-between" alignItems="center" mb="30px">
            <Heading fontSize="4xl">Contactos</Heading>
            {/* <Button
              onClick={() => push('/dashboard/contacts/new')}
              size="lg"
              colorScheme="brand"
              borderRadius="40px"
              _hover={{
                bg: 'white',
                color: 'brand.100',
              }}
            >
              Nuevo Mensaje
            </Button> */}
          </Flex>

          {sliderMessages.length > 0 && (
            <Card bg="#edf2f6">
              <CardHeader>
                <Tag size="lg" variant="solid" colorScheme="blue">
                  Mensaje en slider
                </Tag>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {sliderMessages.map((message) => {
                    return (
                      <Box key={message._id} position="relative">
                        <Heading size="xs">{message.content}</Heading>
                        <Text pt="2" fontSize="sm">
                          {message.phone}
                        </Text>
                        <Box position="absolute" right="0" bottom="0">
                          <IconButton
                            onClick={() =>
                              push(`/dashboard/contacts/edit/${message._id}`)
                            }
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Editar"
                            icon={
                              <AiOutlineEdit
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          />

                          {/* <IconButton
                            onClick={() => {
                              setIdSelectedMessage(message._id)
                              onOpen()
                            }}
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Borrar"
                            ml="10px"
                            icon={
                              <AiOutlineDelete
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          /> */}
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </CardBody>
            </Card>
          )}
          {whatsappMessages.length > 0 && (
            <Card mt="50px" bg="#edf2f6">
              <CardHeader>
                <Tag size="lg" variant="solid" colorScheme="teal">
                  Mensaje en Whatsapp
                </Tag>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {whatsappMessages.map((message) => {
                    return (
                      <Box key={message._id} position="relative">
                        <Heading size="xs">{message.content}</Heading>
                        <Text pt="2" fontSize="sm">
                          {message.phone}
                        </Text>
                        <Box position="absolute" right="0" bottom="0">
                          <IconButton
                            onClick={() =>
                              push(`/dashboard/contacts/edit/${message._id}`)
                            }
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Editar"
                            icon={
                              <AiOutlineEdit
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          />

                          {/* <IconButton
                            onClick={() => {
                              setIdSelectedMessage(message._id)
                              onOpen()
                            }}
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Borrar"
                            ml="10px"
                            icon={
                              <AiOutlineDelete
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          /> */}
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </CardBody>
            </Card>
          )}
          {productMessages.length > 0 && (
            <Card mt="50px" bg="#edf2f6">
              <CardHeader>
                <Tag size="lg" variant="solid" colorScheme="orange">
                  Mensaje en Productos
                </Tag>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing="4">
                  {productMessages.map((message) => {
                    return (
                      <Box key={message._id} position="relative">
                        <Heading size="xs">{message.content}</Heading>
                        <Text pt="2" fontSize="sm">
                          {message.phone}
                        </Text>
                        <Box position="absolute" right="0" bottom="0">
                          <IconButton
                            onClick={() =>
                              push(`/dashboard/contacts/edit/${message._id}`)
                            }
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Editar"
                            icon={
                              <AiOutlineEdit
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          />

                          {/* <IconButton
                            onClick={() => {
                              setIdSelectedMessage(message._id)
                              onOpen()
                            }}
                            as="a"
                            borderRadius="25px"
                            cursor="pointer"
                            aria-label="Borrar"
                            ml="10px"
                            icon={
                              <AiOutlineDelete
                                color="blue.900"
                                fontSize="1.5rem"
                              />
                            }
                          /> */}
                        </Box>
                      </Box>
                    )
                  })}
                </Stack>
              </CardBody>
            </Card>
          )}
          <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={isOpen}
            onClose={onClose}
          >
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogHeader fontSize="lg" fontWeight="bold">
                  Borrar Mensaje
                </AlertDialogHeader>

                <AlertDialogBody>
                  ¿ Esta seguro que quiere borrar el mensaje ?
                </AlertDialogBody>

                <AlertDialogFooter>
                  <Button onClick={handleCloseDialog}>Cancelar</Button>
                  <Button
                    isLoading={loadingBtn}
                    loadingText="Borrando"
                    colorScheme="red"
                    onClick={handleDeleteMessage}
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
