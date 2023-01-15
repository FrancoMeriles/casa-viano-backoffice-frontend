import { Box, Image } from "@chakra-ui/react";

const Sidebar = () => {
  return (
    <Box
      position="fixed"
      top="0"
      padding="20px"
      width="300px"
      textAlign="center"
      height="100vh"
      bg="brand.500"
      display={{
        base: "none",
        lg: "inherit",
      }}
    >
      <Image src="/casa-viano.svg" alt="Casa Viano" w="170px" margin="auto" />
      Sidebar
    </Box>
  );
};

export default Sidebar;
