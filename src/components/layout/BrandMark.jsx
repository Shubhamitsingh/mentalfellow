export function BrandMark({ className = 'h-11 md:h-14' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-leaf ${className}`}
      style={{
        aspectRatio: '1940 / 811',
        WebkitMaskImage: 'url(/uploads/logo/logo.png)',
        maskImage: 'url(/uploads/logo/logo.png)',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
      }}
    />
  )
}
