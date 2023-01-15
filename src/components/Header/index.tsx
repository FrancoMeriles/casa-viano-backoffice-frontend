import {
  Box,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Container,
} from '@chakra-ui/react'
import { FaBars } from 'react-icons/fa'
import { BiLogOutCircle } from 'react-icons/bi'
import service from '@services/local'
import useLoader from '@hooks/useLoader'
import { useRouter } from 'next/router'

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setLoaderState } = useLoader()
  const { push } = useRouter()

  const logout = async () => {
    setLoaderState({ show: true })
    try {
      await service.post('/logout')
      push('/login')
    } catch (error) {
      console.log('errores')
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
        Header
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
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>Hola content</DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default Header
