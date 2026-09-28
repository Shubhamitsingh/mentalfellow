import { collections, menus } from '@/content/taxonomy'

export const site = {
  name: 'Mental Fellow',
  logo: '/uploads/logo/logo.png',
  tagline: 'Fashion, reimagined.',
  description:
    'Mental Fellow turns innovative materials, including agricultural-waste and recycled feedstocks, into bags, wallets, belts, footwear, and travel goods.',
  locale: 'en-IN',
  currency: 'INR',
  freeShippingThreshold: 999,
  shippingFee: 79,
  exchangeWindowDays: 7,
  announcement: {
    enabled: true,
    message: 'Free shipping above ₹999',
    href: '/shipping',
  },
  contactEmail: 'hello@mentalfellow.store',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
    { label: 'Facebook', href: 'https://facebook.com' },
  ],
}

export const primaryNav = [
  { id: 'shop', label: 'Shop', href: '/shop' },
  { id: 'men', label: 'Men', href: '/men', menu: 'men' },
  { id: 'women', label: 'Women', href: '/women', menu: 'women' },
  { id: 'bags', label: 'Bags', href: '/bags', menu: 'bags' },
  { id: 'wallets', label: 'Wallets & Accessories', href: '/wallets', menu: 'wallets' },
  { id: 'belts', label: 'Belts', href: '/belts', menu: 'belts' },
  { id: 'footwear', label: 'Footwear', href: '/footwear', menu: 'footwear' },
  { id: 'travel', label: 'Travel', href: '/travel', menu: 'travel' },
  { id: 'collections', label: 'Collections', href: '/collections', menu: 'collections' },
  { id: 'blog', label: 'Blog', href: '/blog' },
]

export { collections, menus }

export const popularSearches = ['sling', 'wallet', 'belt', 'travel', 'derby', 'rice straw']

export const footerColumns = [
  {
    title: 'Shop',
    links: [
      { label: 'Shop', href: '/shop' },
      { label: 'Men', href: '/men' },
      { label: 'Women', href: '/women' },
      { label: 'Bags', href: '/bags' },
      { label: 'Wallets & Accessories', href: '/wallets' },
      { label: 'Belts', href: '/belts' },
      { label: 'Footwear', href: '/footwear' },
      { label: 'Travel', href: '/travel' },
    ],
  },
  {
    title: 'Materials',
    links: [
      { label: 'Materials', href: '/materials' },
      { label: 'Sustainability', href: '/sustainability' },
      { label: 'Collections', href: '/collections' },
      { label: 'New Arrivals', href: '/new-arrivals' },
      { label: 'Offers', href: '/offers' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Track Order', href: '/track-order' },
      { label: 'Size Guide', href: '/size-guide' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Our Story', href: '/our-story' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]

export function collectionBySlug(slug) {
  return collections.find((item) => item.slug === slug) ?? null
}
