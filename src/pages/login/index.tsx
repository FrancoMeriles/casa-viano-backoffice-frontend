import { useState } from 'react'
import { Formik, Field } from 'formik'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  VStack,
  Stack,
  Heading,
  useBreakpointValue,
} from '@chakra-ui/react'
import * as Yup from 'yup'
import service from '@services/local'
import Head from 'next/head'

type LoginType = {
  email: string
  password: string
}

export default function App() {
  const [loadingBtn, setLoadingBtn] = useState(false)
  const { push } = useRouter()

  const loginHandler = async (input: LoginType) => {
    setLoadingBtn(true)
    try {
      const response = await service.post('/login', {
        ...input,
      })
      console.log(response)
      return push('/dashboard')
    } catch (error) {
      console.log('errorsssss')
      console.log(error)
    }
  }
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Debe ser un email válido')
      .required('Este campo es requerido'),
    password: Yup.string()
      .min(5, 'Debe contener al menos 5 carácteres')
      .required('Este campo es requerido'),
  })
  return (
    <>
      <Head>
        <title>Casa Viano - Backoffice</title>
        <meta name="description" content="Casa Viano Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        bg="gray.100"
        align="center"
        flexDirection="column"
        justify="center"
        h="100vh"
      >
        <Stack spacing="6">
          <Stack spacing={{ base: '2', md: '3' }} textAlign="center">
            <Heading
              size={useBreakpointValue({ base: 'xs', md: 'sm' })}
              mb="40px"
            >
              Ingresar a Casa Viano
            </Heading>
          </Stack>
        </Stack>

        <Box bg="white" p={6} rounded="md" width="400px">
          <Formik
            initialValues={{
              email: '',
              password: '',
            }}
            onSubmit={(values) => loginHandler(values)}
            validationSchema={validationSchema}
          >
            {({ handleSubmit, errors, touched }) => (
              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="flex-start">
                  <FormControl isInvalid={!!errors.email && touched.email}>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Field
                      as={Input}
                      borderColor="gray.100"
                      id="email"
                      name="email"
                      type="email"
                      variant="filled"
                    />
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl
                    isInvalid={!!errors.password && touched.password}
                  >
                    <FormLabel htmlFor="password">Contraseña</FormLabel>
                    <Field
                      as={Input}
                      borderColor="gray.100"
                      id="password"
                      name="password"
                      type="password"
                      variant="filled"
                    />
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Box as="br" />
                  <Button
                    size="lg"
                    variant="primary"
                    type="submit"
                    width="full"
                    isLoading={loadingBtn}
                  >
                    Ingresar
                  </Button>
                </VStack>
              </form>
            )}
          </Formik>
        </Box>
      </Flex>
    </>
  )
}
