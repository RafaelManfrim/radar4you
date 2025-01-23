import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps extends ChakraInputProps {
  register?: UseFormRegisterReturn
}

export function Input(props: InputProps) {
  return <ChakraInput bgColor="white" {...props.register} {...props} />
}
