import { useEffect } from 'react'
import { site } from '@/lib/site'

function upsertMeta(attr, key, content) {
  if (!content) return
  let node = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, key)
    document.head.appendChild(node)
  }
  node.setAttribute('content', content)
}

function upsertLink(rel, href) {
  let node = document.head.querySelector(`link[rel="${rel}"]`)
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', rel)
    document.head.appendChild(node)
  }
  node.setAttribute('href', href)
}

export function usePageMeta({ title, description, path }) {
  useEffect(() => {
    const nextTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`
    document.title = nextTitle
    const summary = description || site.description
    upsertMeta('name', 'description', summary)
    upsertMeta('property', 'og:title', nextTitle)
    upsertMeta('property', 'og:description', summary)
    const url = `${window.location.origin}${path || window.location.pathname}`
    upsertMeta('property', 'og:url', url)
    upsertLink('canonical', url)
  }, [title, description, path])
}
