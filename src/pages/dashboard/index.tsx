import Head from 'next/head'

import { GetServerSideProps } from 'next'
import cookie from 'cookie'

import Header from '@components/Header'
import Sidebar from '@components/Sidebar'
import Content from '@components/Content'

import { Box, Heading } from '@chakra-ui/react'
import { jwtVerify } from 'jose'

import { UserTokenType } from '@app-types/user'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = cookie.parse(context.req.headers.cookie || '')
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  )

  return {
    props: {
      user: payload,
    },
  }
}

interface Props {
  user: UserTokenType
}

export default function Home({ user }: Props) {
  console.log(user)
  return (
    <>
      <Head>
        <title>Casa Viano - Dashboard</title>
        <meta name="description" content="Casa Viano - Dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main>
        <Sidebar />
        <Content>
          <Box>
            <Heading>Bienvenido</Heading>
          </Box>
        </Content>
      </main>
    </>
  )
}
