export const currencyFormat = (value: number) => {
  const countryCode = 'es-ES';
  const currency = 'EUR';
  return new Intl.NumberFormat(countryCode, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};
