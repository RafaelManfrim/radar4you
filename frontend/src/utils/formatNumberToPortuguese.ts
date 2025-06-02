export function formatNumberToPortuguese(
  number: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat('pt-BR', {
    ...options,
  }).format(number)
}
