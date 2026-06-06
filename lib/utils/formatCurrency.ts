export type Currency = "XOF" | "USD" | "EUR";

const LOCALE_BY_CURRENCY: Record<Currency, string> = {
  XOF: "fr-FR",
  USD: "en-US",
  EUR: "fr-FR",
};

/**
 * Format a monetary amount. XOF (FCFA) amounts are expressed in whole francs;
 * USD/EUR amounts are expressed in cents (smallest unit) like Stripe.
 */
export function formatCurrency(amount: number, currency: Currency = "XOF"): string {
  if (currency === "XOF") {
    const value = new Intl.NumberFormat(LOCALE_BY_CURRENCY.XOF).format(amount);
    return `${value} FCFA`;
  }
  return new Intl.NumberFormat(LOCALE_BY_CURRENCY[currency], {
    style: "currency",
    currency,
  }).format(amount / 100);
}
