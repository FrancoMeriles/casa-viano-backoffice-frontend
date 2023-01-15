import { Box } from '@chakra-ui/react'

interface Props {
  children: React.ReactNode
}

const Context = ({ children }: Props) => {
  return (
    <Box
      ml={{
        base: '0',
        lg: '300px',
      }}
      p={{
        base: '10px',
        lg: '30px',
      }}
      bg="gray.200"
    >
      {children}
    </Box>
  )
}

export default Context
