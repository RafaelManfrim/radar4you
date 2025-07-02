import { formatCurrencyMask } from "./formatCurrencyMask";

export function formatCurrencyInitial(value: number | undefined | null) {
  if (typeof value !== 'number' || isNaN(value)) return '';
  const raw = Math.round(value * 100).toString(); // transforma em centavos como string
  return formatCurrencyMask(raw);
}