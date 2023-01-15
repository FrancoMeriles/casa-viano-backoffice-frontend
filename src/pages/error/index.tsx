import { FC } from 'react'
import Head from 'next/head'
import { GetServerSideProps } from 'next'

import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
} from '@chakra-ui/react'

export const getServerSideProps: GetServerSideProps = async (req) => {
  return {
    props: { query: req.query },
  }
}

interface Props {
  query: {
    url: string
    method: string
    data: string
  }
}

const index: FC<Props> = ({ query }) => {
  return (
    <>
      <Head>
        <title>Casa Viano</title>
        <meta name="description" content="Casa Viano" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          width="100%"
          height="100vh"
          bg="gray.100"
          flexDirection="column"
        >
          <Alert status="error" maxW="900px">
            <AlertIcon />
            <AlertTitle>
              Hubo un error al obtener informacion de la página
            </AlertTitle>
            <AlertDescription>
              Comparte esta informacion al equipo de IT
            </AlertDescription>
          </Alert>
          <Box
            mt="20px"
            as="pre"
            wordBreak="break-word"
            whiteSpace="pre-wrap"
            maxWidth="900px"
          >
            {JSON.stringify(query, null, 2)}
          </Box>
        </Box>
      </main>
    </>
  )
}

export default index
