export function formatPrice(priceInKurus: number): string {
  return (priceInKurus / 100).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
  });
}
