export function track(event, params = {}) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ event, ...params })
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params)
  }
}
