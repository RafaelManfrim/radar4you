import { z } from 'zod';

/**
 * Zod schema for Brazilian Real currency inputs masked as strings (e.g., "R$ 1.234,56"),
 * parsing into numbers and validating minimum value.
 * Allows empty string for optional fields if needed.
 */

type zCurrencyOptions = {
  message?: string;
  allowEmpty?: boolean;
};

export const zCurrency = (opts?: zCurrencyOptions) => {
  const { message = 'Informe o valor', allowEmpty = false } = opts ?? {};

  return z.preprocess(
    (val) => {
      if (typeof val !== 'string') return undefined;
      const raw = val.replace(/\D/g, '');
      const num = parseFloat(raw) / 100;
      return isNaN(num) ? undefined : num;
    },
    allowEmpty
      ? z.union([
          z.coerce.number({ invalid_type_error: message, required_error: message }),
          z.literal(''),
        ])
      : z.coerce.number({ invalid_type_error: message, required_error: message }).min(0.01, message)
    )
}
