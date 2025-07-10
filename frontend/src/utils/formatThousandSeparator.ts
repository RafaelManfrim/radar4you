export function formatThousandSeparator(value: string) {
  const numericValue = value.replace(/[^\d,]/g, '') // Remove tudo, exceto dígitos e vírgula

  const [integerPart, decimalPart] = numericValue.split(',') // Separa parte inteira e decimal

  if (!integerPart) return ''

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.') // Adiciona pontos na parte inteira

  // Retorna com vírgula e decimais se existirem
  return decimalPart !== undefined
    ? `${formattedInteger},${decimalPart}`
    : formattedInteger
}
