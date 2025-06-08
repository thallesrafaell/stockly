export const formatCurrency =  (value: number, locale: string = "pt-BR", currency: string = "BRL")=> {
  return Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}