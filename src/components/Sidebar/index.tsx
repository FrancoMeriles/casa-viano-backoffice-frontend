import { Box, Image, Link } from '@chakra-ui/react'
import { useRouter } from 'next/router'

const Sidebar = () => {
  const { asPath, push } = useRouter()

  const isProductos = asPath.includes('products')
  const isTestimonios = asPath.includes('testimonials')
  const isUsuarios = asPath.includes('users')
  const isContacto = asPath.includes('contact')
  return (
    <Box
      position="fixed"
      top="0"
      padding="20px"
      width="300px"
      height="100vh"
      bg="brand.500"
      display={{
        base: 'none',
        lg: 'inherit',
      }}
    >
      <Image
        onClick={() => push('/dashboard/products')}
        src="/casa-viano.svg"
        alt="Casa Viano"
        w="170px"
        margin="auto"
        cursor="pointer"
      />
      <Box mt="50px" display="flex" flexDirection="column" bg="brand.500">
        <Link
          mt="40px"
          color="white"
          fontWeight="bold"
          fontSize="2xl"
          position="relative"
          onClick={() => {
            push('/dashboard/products')
          }}
        >
          {isProductos && (
            <Box
              w="8px"
              height="34px"
              bg="white"
              left="-19px"
              as="span"
              position="absolute"
              display="inline-block"
            />
          )}
          Productos
        </Link>
        <Link
          mt="20px"
          color="white"
          fontWeight="bold"
          fontSize="2xl"
          position="relative"
          onClick={() => {
            push('/dashboard/testimonials')
          }}
        >
          {isTestimonios && (
            <Box
              w="8px"
              height="34px"
              bg="white"
              left="-19px"
              as="span"
              position="absolute"
              display="inline-block"
            />
          )}
          Testimonios
        </Link>
        <Link
          mt="20px"
          color="white"
          fontWeight="bold"
          fontSize="2xl"
          position="relative"
          onClick={() => {
            push('/dashboard/users')
          }}
        >
          {isUsuarios && (
            <Box
              w="8px"
              height="34px"
              bg="white"
              left="-19px"
              as="span"
              position="absolute"
              display="inline-block"
            />
          )}
          Usuarios
        </Link>
        <Link
          mt="20px"
          color="white"
          fontWeight="bold"
          fontSize="2xl"
          position="relative"
          onClick={() => {
            push('/dashboard/contacts')
          }}
        >
          {isContacto && (
            <Box
              w="8px"
              height="34px"
              bg="white"
              left="-19px"
              as="span"
              position="absolute"
              display="inline-block"
            />
          )}
          Contacto
        </Link>
      </Box>
    </Box>
  )
}

export default Sidebar
