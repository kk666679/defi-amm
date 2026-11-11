export function isWalletProviderMissing(error: unknown): boolean {
  const name = error instanceof Error ? error.name : "";
  const message = typeof error === "string"
    ? error
    : error instanceof Error
      ? error.message
      : "";

  return name === "ProviderNotFoundError" || /provider not found/i.test(message);
}
