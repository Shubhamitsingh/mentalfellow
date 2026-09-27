/**
 * Seed taxonomy for a sustainable fashion catalogue.
 * Product types, materials, subcategories, and collections are records, not a closed list.
 * A later admin writes new ones into the database. Storefront pages read whatever is here.
 */

import { photo } from '@/content/media'

export const materialProcess = ['Agricultural waste', 'Material innovation', 'Sustainable material', 'Fashion product']

export const productCreationSteps = [
  { id: 'type', label: 'Product type' },
  { id: 'department', label: 'Department', options: ['men', 'women', 'unisex'] },
  { id: 'category', label: 'Category' },
  { id: 'subcategory', label: 'Subcategory' },
  { id: 'collection', label: 'Collection' },
  { id: 'material', label: 'Material' },
  { id: 'details', label: 'Product information' },
  { id: 'variants', label: 'Variants' },
  { id: 'images', label: 'Images' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'seo', label: 'SEO' },
  { id: 'publish', label: 'Publish' },
]

const sharedFilters = {
  gender: { id: 'gender', param: 'gender', facet: 'genders', label: 'Gender' },
  material: { id: 'material', param: 'material', facet: 'materials', label: 'Material' },
  color: { id: 'color', param: 'color', facet: 'colors', label: 'Colour' },
  price: { id: 'price', label: 'Price' },
  size: { id: 'size', param: 'size', facet: 'sizes', label: 'Size' },
  collection: { id: 'collection', param: 'collection', facet: 'collections', label: 'Collection' },
  stock: { id: 'stock', label: 'Availability' },
}

function filters({ category, extra = [] }) {
  return [
    sharedFilters.gender,
    { id: 'category', param: 'type', facet: 'categories', label: category },
    sharedFilters.material,
    sharedFilters.color,
    sharedFilters.price,
    ...extra,
    sharedFilters.size,
    sharedFilters.collection,
    sharedFilters.stock,
  ]
}

export const productTypes = [
  {
    id: 'bag',
    name: 'Bag',
    filters: filters({
      category: 'Bag type',
      extra: [{ id: 'capacity', param: 'capacity', facet: 'capacities', label: 'Capacity' }],
    }),
    attributes: [
      ['capacity', 'Capacity'],
      ['dimensions', 'Dimensions'],
      ['weight', 'Weight'],
      ['strapType', 'Strap'],
      ['closure', 'Closure'],
      ['hardware', 'Hardware'],
      ['lining', 'Lining'],
      ['pattern', 'Pattern'],
      ['finish', 'Finish'],
    ],
  },
  {
    id: 'wallet',
    name: 'Wallet',
    filters: filters({
      category: 'Wallet type',
      extra: [{ id: 'features', param: 'feature', facet: 'features', label: 'Features' }],
    }),
    attributes: [
      ['cardSlots', 'Card slots'],
      ['cashCompartment', 'Cash compartment'],
      ['coinCompartment', 'Coin compartment'],
      ['dimensions', 'Dimensions'],
      ['closure', 'Closure'],
    ],
  },
  {
    id: 'accessory',
    name: 'Accessory',
    filters: filters({ category: 'Accessory type' }),
    attributes: [
      ['dimensions', 'Dimensions'],
      ['closure', 'Closure'],
      ['hardware', 'Hardware'],
    ],
  },
  {
    id: 'belt',
    name: 'Belt',
    filters: filters({ category: 'Belt type' }),
    attributes: [
      ['width', 'Width'],
      ['buckle', 'Buckle'],
      ['dimensions', 'Length'],
    ],
  },
  {
    id: 'shoe',
    name: 'Shoe',
    filters: filters({ category: 'Shoe type' }),
    attributes: [
      ['upper', 'Upper'],
      ['sole', 'Sole'],
      ['closure', 'Closure'],
      ['fit', 'Fit'],
    ],
  },
  {
    id: 'travel',
    name: 'Travel product',
    filters: filters({
      category: 'Travel type',
      extra: [{ id: 'capacity', param: 'capacity', facet: 'capacities', label: 'Capacity' }],
    }),
    attributes: [
      ['capacity', 'Capacity'],
      ['dimensions', 'Dimensions'],
      ['closure', 'Closure'],
      ['finish', 'Finish'],
    ],
  },
  {
    id: 'custom',
    name: 'Custom product',
    filters: filters({ category: 'Type' }),
    attributes: [
      ['dimensions', 'Dimensions'],
      ['closure', 'Closure'],
    ],
  },
]

export const materials = [
  {
    slug: 'paddy-rice-waste',
    name: 'Rice Straw Leather',
    source: 'Rice Straw',
    summary: 'Leather made from rice straw gathered in Sonbhadra, Uttar Pradesh.',
    story: 'The straw is collected after the crop is cut. What you hold is the leather finished from that straw.',
    image: '/materials/rice-straw-leather.png',
  },
  {
    slug: 'wheat-waste',
    name: 'Wheat Straw Suede',
    source: 'Wheat Straw',
    summary: 'Suede made from wheat straw, from the same fields as the rice-straw leather.',
    story: 'Wheat straw is the start. The soft face you feel is the suede made from it.',
    image: '/materials/wheat-straw-suede.png',
  },
  {
    slug: 'banana-fibre',
    name: 'Banana Fibre',
    source: 'Banana Fibre',
    summary: 'Fibre taken from the banana plant after the fruit is harvested.',
    image: photo('photo-1603833665858-e61d17a86224', 1400, 1800),
  },
  {
    slug: 'bamboo-fibre',
    name: 'Bamboo Fibre',
    source: 'Bamboo Fibre',
    summary: 'Fibre from bamboo, used here as a feedstock for sheet and textile materials.',
    image: photo('photo-1441974231531-c6227db76b6e', 1400, 1800),
  },
  {
    slug: 'pineapple-fibre',
    name: 'Pineapple Fibre',
    source: 'Pineapple Fibre',
    summary: 'Leaf fibre from pineapple plants, processed into a surface for small leather-goods.',
    image: photo('photo-1550258987-190a2d41a8ba', 1400, 1800),
  },
  {
    slug: 'coconut-waste',
    name: 'Coconut Waste',
    source: 'Coconut Waste',
    summary: 'Husk and shell residue used as a feedstock for a dense, matte material.',
    image: photo('photo-1580984969071-a8da5656c2fb', 1400, 1800),
  },
  {
    slug: 'sugarcane-bagasse',
    name: 'Sugarcane Bagasse',
    source: 'Sugarcane Bagasse',
    summary: 'The fibrous pulp left after juice is pressed from sugarcane.',
    image: photo('photo-1500382017468-9049fed747ef', 1400, 1800),
  },
  {
    slug: 'corn-waste',
    name: 'Corn Waste',
    source: 'Corn Waste',
    summary: 'Stalk and husk residue from corn, held as a future feedstock.',
    image: photo('photo-1551754655-cd27e38d2076', 1400, 1800),
  },
  {
    slug: 'hemp-fibre',
    name: 'Hemp Fibre',
    source: 'Hemp Fibre',
    summary: 'Long hemp fibre, used for structure in larger bags and footwear uppers.',
    image: photo('photo-1441974231531-c6227db76b6e', 1400, 1800),
  },
  {
    slug: 'recycled-textile',
    name: 'Recycled Textile Waste',
    source: 'Recycled Textile Waste',
    summary: 'Fibre reclaimed from textile waste and rebuilt into a usable cloth or sheet.',
    image: photo('photo-1523381210434-271e8be1f52b', 1400, 1800),
  },
  {
    slug: 'recycled-plastic',
    name: 'Recycled Plastic',
    source: 'Recycled Plastic',
    summary: 'Plastic collected for recycling and reformed. Used only where the product needs it.',
    image: photo('photo-1532996122724-e3c354a0b15b', 1400, 1800),
  },
  {
    slug: 'other-agricultural-waste',
    name: 'Other Agricultural Waste',
    source: 'Other Agricultural Waste',
    summary: 'A holding type for agricultural residues that do not fit the named feedstocks.',
    image: photo('photo-1500382017468-9049fed747ef', 1400, 1800),
  },
  {
    slug: 'other-sustainable',
    name: 'Other Sustainable Materials',
    source: 'Other Sustainable Materials',
    summary: 'A holding type for new materials the studio adds after they are documented.',
    image: photo('photo-1542601906990-b4d3fb778b09', 1400, 1800),
  },
]

export const collections = [
  {
    slug: 'travel',
    name: 'Travel Collection',
    description: 'Bags and small goods for leaving the house for more than a day.',
    image: photo('photo-1553062407-98eeb64c6a62', 1200, 1500),
  },
  {
    slug: 'laptop',
    name: 'Laptop Collection',
    description: 'Sleeves and structured bags that keep a laptop in its own compartment.',
    image: photo('photo-1548036328-c9fa89d128fa', 1200, 1500),
  },
  {
    slug: 'office',
    name: 'Office Collection',
    description: 'Briefs, belts, and shoes with a quieter finish.',
    image: photo('photo-1547949003-9792a18a2601', 1200, 1500),
  },
  {
    slug: 'college',
    name: 'College Collection',
    description: 'Totes and day bags with room for a folder and a bottle.',
    image: photo('photo-1590874103328-eac38a683ce7', 1200, 1500),
  },
  {
    slug: 'gym',
    name: 'Gym Collection',
    description: 'Slings and belt bags that stay on the body.',
    image: photo('photo-1553062407-98eeb64c6a62', 1200, 1500),
  },
  {
    slug: 'wedding',
    name: 'Wedding Collection',
    description: 'Small evening bags with a cleaner edge.',
    image: photo('photo-1566150905458-1bf1fc113f0d', 1200, 1500),
  },
  {
    slug: 'premium',
    name: 'Premium Collection',
    description: 'The tighter constructions in the current line.',
    image: photo('photo-1584917865442-de89df76afd3', 1200, 1500),
  },
  {
    slug: 'luxury',
    name: 'Luxury Collection',
    description: 'Limited runs with a finer surface and smaller hardware.',
    image: photo('photo-1591561954557-26941169b49e', 1200, 1500),
  },
  {
    slug: 'limited',
    name: 'Limited Edition Collection',
    description: 'Short runs. When they are gone, they are not recoloured.',
    image: photo('photo-1590874103328-eac38a683ce7', 1200, 1500),
  },
  {
    slug: 'custom',
    name: 'Custom / Personalized Collection',
    description: 'Products the studio can mark or adjust for an order.',
    image: photo('photo-1627123424574-724758594e93', 1200, 1500),
  },
  {
    slug: 'corporate',
    name: 'Corporate Gift Collection',
    description: 'Small goods that work as a set for a team or a client.',
    image: photo('photo-1606760227091-3dd870d97f1d', 1200, 1500),
  },
]

export const departmentPages = [
  {
    id: 'bags',
    title: 'Bags',
    path: '/bags',
    members: ['bags'],
    description: 'Totes, slings, briefs, and weekenders made from documented materials.',
  },
  {
    id: 'wallets',
    title: 'Wallets & Accessories',
    path: '/wallets',
    members: ['wallets', 'accessories'],
    description: 'Card wallets, key pouches, sleeves, and the smaller things that leave with you.',
  },
  {
    id: 'belts',
    title: 'Belts',
    path: '/belts',
    members: ['belts'],
    description: 'Formal, casual, and fashion belts. Width and length are on the product.',
  },
  {
    id: 'footwear',
    title: 'Footwear',
    path: '/footwear',
    members: ['footwear'],
    description: 'Shoes with a named upper material. Size runs are UK.',
  },
  {
    id: 'travel',
    title: 'Travel',
    path: '/travel',
    members: ['travel'],
    travel: true,
    description: 'The travel edit: weekenders, organisers, passport covers, and luggage tags.',
  },
]

const menBags = [
  'Sling Bags', 'Crossbody Bags', 'Shoulder Bags', 'Messenger Bags', 'Chest Bags', 'Belt Bags', 'Phone Slings',
  'Mini Crossbody Bags', 'Briefcases', 'Laptop Bags', 'Office Bags', 'Document Bags', 'Portfolio Cases',
  'Business Backpacks', 'Travel Backpacks', 'Duffel Bags', 'Weekender Bags', 'Travel Bags', 'Duffle Backpacks',
  'Garment Bags', 'Toiletry Bags', 'Travel Organizers', 'Passport Holders', 'Gym Bags', 'Camera Bags',
]
const menWallets = [
  'Bifold Wallets', 'Trifold Wallets', 'Slim Wallets', 'Minimal Wallets', 'Card Wallets', 'Money Clip Wallets',
  'Zip Wallets', 'Long Wallets', 'Passport Wallets', 'Travel Wallets', 'Coin Wallets', 'Business Card Holders',
]
const menBelts = ['Formal Belts', 'Casual Belts', 'Reversible Belts', 'Braided-Style Belts']
const menShoes = [
  'Oxford Shoes', 'Derby Shoes', 'Monk Strap Shoes', 'Double Monk Shoes', 'Formal Lace-Up Shoes', 'Wholecut Shoes',
  'Loafers', 'Penny Loafers', 'Tassel Loafers', 'Driving Loafers', 'Moccasins', 'Casual Sneakers', 'Fashion Sneakers',
  'Slip-On Sneakers', 'Canvas-Style Sneakers', 'Chelsea Boots', 'Chukka Boots', 'Ankle Boots', 'Desert Boots',
  'Lace-Up Boots', 'Work Boots', 'Sandals', 'Slides', 'Slippers', 'Flip-Flops', 'Mules',
]
const womenBags = [
  'Tote Bags', 'Shoulder Bags', 'Crossbody Bags', 'Sling Bags', 'Handbags', 'Satchel Bags', 'Hobo Bags', 'Bucket Bags',
  'Top-Handle Bags', 'Bowling Bags', 'Barrel Bags', 'Baguette Bags', 'Half-Moon Bags', 'Saddle Bags', 'Camera Bags',
  'Box Bags', 'Envelope Bags', 'Flap Bags', 'Mini Bags', 'Micro Bags', 'Convertible Bags', 'Clutches',
  'Envelope Clutches', 'Wristlets', 'Evening Bags', 'Party Bags', 'Bridal Bags', 'Chain Bags', 'Laptop Bags',
  'Work Totes', 'Office Bags', 'College Bags', 'Backpacks', 'Travel Totes', 'Weekender Bags', 'Cosmetic Bags',
  'Makeup Pouches', 'Toiletry Pouches', 'Organizer Pouches', 'Phone Bags', 'Phone Slings', 'Card Pouches',
  'Passport Pouches', 'Jewelry Pouches', 'Drawstring Pouches', 'Coin Purses', 'Belt Bags', 'Waist Bags',
  'Shopping Bags', 'Beach Bags',
]
const womenWallets = [
  'Long Wallets', 'Continental Wallets', 'Zip-Around Wallets', 'Mini Wallets', 'Wristlet Wallets', 'Phone Wallets',
  'Card Holders', 'Key Holders', 'Key Pouches', 'Coin Pouches', 'Passport Covers',
]
const womenBelts = ['Fashion Belts', 'Slim Belts', 'Wide Belts', 'Reversible Belts']
const womenShoes = [
  'Ballet Flats', 'Pointed Flats', 'Slingback Flats', 'Mary Jane Flats', "Women's Loafers", "Women's Moccasins",
  "Women's Mules", 'Casual Sneakers', 'Fashion Sneakers', 'Platform Sneakers', 'Slip-On Sneakers', 'Low-Top Sneakers',
  'High-Top Sneakers', 'Pumps', 'Block Heels', 'Stiletto Heels', 'Kitten Heels', 'Platform Heels', 'Wedges',
  'Slingback Heels', 'Peep-Toe Heels', 'Ankle Boots', 'Chelsea Boots', 'Knee-High Boots', 'Over-the-Knee Boots',
  'Western Boots', 'Fashion Boots', 'Flat Sandals', 'Platform Sandals', 'Heeled Sandals', 'Strappy Sandals',
  'Slide Sandals', 'Gladiator Sandals', 'Wedge Sandals', 'Jutti', 'Mojari', 'Kolhapuri-Style Sandals', 'Embellished Flats',
]
const accessoryTypes = [
  'Card Wallets', 'Card Holders', 'Key Holders', 'Key Pouches', 'Coin Pouches', 'Earbuds Cases', 'Glasses Cases',
  'Passport Covers', 'Luggage Tags', 'Laptop Sleeves', 'Tablet Sleeves', 'Phone Cases', 'Watch Straps', 'Camera Straps',
  'Bag Straps', 'Tech Pouches', 'Cable Organizers',
]
const beltTypes = [
  "Men's Formal Belts", "Men's Casual Belts", "Women's Fashion Belts", 'Slim Belts', 'Wide Belts', 'Reversible Belts',
  'Braided-Style Belts',
]

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const subcategoryMap = new Map()

function addSubcategories(names, meta) {
  for (const name of names) {
    const slug = slugify(name)
    const existing = subcategoryMap.get(slug)
    if (existing) {
      existing.genders = [...new Set([...existing.genders, ...meta.genders])]
    } else {
      subcategoryMap.set(slug, { slug, name, ...meta, genders: [...meta.genders] })
    }
  }
}

addSubcategories(menBags, { department: 'bags', productType: 'bag', genders: ['men'] })
addSubcategories(womenBags, { department: 'bags', productType: 'bag', genders: ['women'] })
addSubcategories(menWallets, { department: 'wallets', productType: 'wallet', genders: ['men'] })
addSubcategories(womenWallets, { department: 'wallets', productType: 'wallet', genders: ['women'] })
addSubcategories(accessoryTypes, { department: 'accessories', productType: 'accessory', genders: ['unisex'] })
addSubcategories(menBelts, { department: 'belts', productType: 'belt', genders: ['men'] })
addSubcategories(womenBelts, { department: 'belts', productType: 'belt', genders: ['women'] })
addSubcategories(beltTypes, { department: 'belts', productType: 'belt', genders: ['unisex'] })
addSubcategories(menShoes, { department: 'footwear', productType: 'shoe', genders: ['men'] })
addSubcategories(womenShoes, { department: 'footwear', productType: 'shoe', genders: ['women'] })

export const subcategories = [...subcategoryMap.values()]

function subcategoryBySlug(slug) {
  return subcategoryMap.get(slug) || null
}

export function materialBySlug(slug) {
  return materials.find((item) => item.slug === slug) || null
}

export function collectionBySlug(slug) {
  return collections.find((item) => item.slug === slug) || null
}

export function productTypeById(id) {
  return productTypes.find((item) => item.id === id) || null
}

export function departmentPage(id) {
  return departmentPages.find((item) => item.id === id) || null
}

export { subcategoryBySlug }

function linksFor(names, gender) {
  return names.map((name) => {
    const slug = slugify(name)
    const query = gender ? `?gender=${gender}` : ''
    return { label: name, href: `/category/${slug}${query}` }
  })
}

function pack(title, names, gender, size = 10) {
  const rows = linksFor(names, gender)
  const columns = []
  for (let index = 0; index < rows.length; index += size) {
    columns.push({
      key: `${title}-${index}`,
      title: index === 0 ? title : '',
      links: rows.slice(index, index + size),
    })
  }
  return columns
}

const travelNames = [
  'Travel Backpacks', 'Duffel Bags', 'Weekender Bags', 'Travel Bags', 'Garment Bags', 'Toiletry Bags',
  'Travel Organizers', 'Passport Holders', 'Travel Totes', 'Cosmetic Bags', 'Luggage Tags', 'Passport Covers',
  'Passport Wallets',
]

export const menus = {
  men: {
    columns: [
      ...pack("Men's bags", menBags, 'men', 9),
      ...pack("Men's wallets", menWallets, 'men', 12),
      ...pack("Men's belts", menBelts, 'men', 8),
      ...pack("Men's footwear", menShoes, 'men', 10),
    ],
  },
  women: {
    columns: [
      ...pack("Women's bags", womenBags, 'women', 10),
      ...pack("Women's wallets", womenWallets, 'women', 12),
      ...pack("Women's belts", womenBelts, 'women', 8),
      ...pack("Women's footwear", womenShoes, 'women', 10),
    ],
  },
  bags: {
    columns: [...pack("Men's bags", menBags, 'men', 9), ...pack("Women's bags", womenBags, 'women', 10)],
  },
  wallets: {
    columns: [
      ...pack("Men's wallets", menWallets, 'men', 12),
      ...pack("Women's wallets", womenWallets, 'women', 12),
      ...pack('Accessories', accessoryTypes, null, 9),
    ],
  },
  belts: {
    columns: pack('Belts', [...menBelts, ...womenBelts.filter((name) => name !== 'Reversible Belts')], null, 8),
  },
  footwear: {
    columns: [...pack("Men's footwear", menShoes, 'men', 10), ...pack("Women's footwear", womenShoes, 'women', 10)],
  },
  travel: {
    columns: pack('Travel', travelNames, null, 8),
  },
}

export function filtersForProducts(products, hide = []) {
  const typeIds = [...new Set(products.map((product) => product.productType))]
  const lists = (typeIds.length ? typeIds : productTypes.map((item) => item.id))
    .map((id) => productTypeById(id)?.filters || [])
    .filter((list) => list.length)
  const hidden = new Set(hide)
  const ordered = []
  const labels = new Map()
  for (const list of lists) {
    for (const field of list) {
      if (hidden.has(field.id)) continue
      if (!labels.has(field.id)) {
        labels.set(field.id, field.label)
        ordered.push(field)
      } else if (labels.get(field.id) !== field.label) {
        labels.set(field.id, field.id === 'category' ? 'Type' : field.label)
        const index = ordered.findIndex((item) => item.id === field.id)
        if (index >= 0) ordered[index] = { ...ordered[index], label: labels.get(field.id) }
      }
    }
  }
  return ordered
}

export const genderLabels = { men: 'Men', women: 'Women', unisex: 'Unisex' }
