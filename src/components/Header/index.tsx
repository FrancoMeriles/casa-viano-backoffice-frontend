import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Image,
  DrawerBody,
  useDisclosure,
  Container,
  Link,
} from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa'
import { BiLogOutCircle } from 'react-icons/bi'
import service from '@services/local'
import useLoader from '@hooks/useLoader'
import { useRouter } from 'next/router'
import { UserTokenType } from '@app-types/user'

interface Props {
  user: UserTokenType
}

const Header = ({ user }: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setLoaderState } = useLoader()
  const { push, asPath } = useRouter()

  const isProductos = asPath.includes('products')
  const isTestimonios = asPath.includes('testimonials')
  const isUsuarios = asPath.includes('users')
  const isContacto = asPath.includes('contacts')

  const logout = async () => {
    setLoaderState({ show: true })
    try {
      await service.post('/logout')
      push('/login')
    } catch (error) {
      console.log(error)
    }
    setLoaderState({ show: false })
  }
  return (
    <Box
      as="nav"
      zIndex="9"
      role="navigation"
      height="80px"
      display="flex"
      position="sticky"
      top="0"
      bg="gray.100"
      alignItems="center"
      ml={{
        base: '0',
        lg: '300px',
      }}
    >
      <Container
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        display="flex"
      >
        {user.sub}
        <IconButton
          onClick={logout}
          as="a"
          bg="gray.300"
          borderRadius="25px"
          cursor="pointer"
          aria-label="Salir"
          icon={<BiLogOutCircle color="black" fontSize="1rem" />}
        />
        <Box
          display={{
            base: 'block',
            lg: 'none',
          }}
        >
          <IconButton
            onClick={onOpen}
            as="a"
            colorScheme="brand"
            _hover={{
              bg: 'brand.100',
            }}
            size="lg"
            borderRadius="25px"
            cursor="pointer"
            aria-label="Menu"
            icon={<FaBars color="white" fontSize="1.5rem" />}
          />
        </Box>
      </Container>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody display="flex" flexDirection="column" bg="brand.500">
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
                  left="-23px"
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
                  left="-23px"
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
                  left="-23px"
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
                  left="-23px"
                  as="span"
                  position="absolute"
                  display="inline-block"
                />
              )}
              Contactos
            </Link>
          </DrawerBody>
          <DrawerFooter bg="brand.500">
            <Image
              onClick={() => push('/')}
              margin="0 auto"
              src="/casa-viano.svg"
              alt="Casa Viano"
              width="170px"
              cursor="pointer"
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header
