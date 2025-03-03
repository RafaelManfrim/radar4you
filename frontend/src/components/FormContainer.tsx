import { Flex, FlexProps } from '@chakra-ui/react'

interface FormContainerProps extends FlexProps {}

export function FormContainer(props: FormContainerProps) {
  return (
    <Flex
      as="form"
      gap="4"
      flexDir="column"
      w="100%"
      maxW="108"
      borderWidth={1}
      borderColor="brand.text"
      p="4"
      borderRadius="6px"
      {...props}
    >
      {props.children}
    </Flex>
  )
}
