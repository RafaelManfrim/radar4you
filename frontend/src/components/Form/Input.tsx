import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  register?: UseFormRegisterReturn
}

export function Input(props: InputProps) {
  return (
    <ChakraInput
      bgColor="brand.background"
      color="brand.title"
      _placeholder={{ color: 'brand.text' }}
      borderColor="brand.text"
      _focus={{ borderColor: 'brand.primary' }}
      {...props.register}
      {...props}
    />
  )
}
