export function getMoedaByCurrency(currency: string): string {
  switch (currency) {
    case 'USD':
      return 'Dólar'
    case 'BRL':
      return 'Real'
    default:
      return currency
  }
}
