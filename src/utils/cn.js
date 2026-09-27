export function cn(...parts) {
  return parts
    .flat()
    .filter((part) => typeof part === 'string' && part.trim())
    .join(' ')
}
