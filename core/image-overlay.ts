export function imageOverlay(strength: unknown, fallback = 50): string {
  const n = Number(strength)
  const a =
    Math.min(
      90,
      Math.max(0, Number.isFinite(n) && strength !== '' && strength != null ? n : fallback)
    ) / 100
  const c = (alpha: number) => `rgba(14, 22, 18, ${alpha.toFixed(2)})`
  return `linear-gradient(90deg, ${c(a)} 0%, ${c(a * 0.7)} 45%, ${c(a * 0.3)} 100%)`
}
