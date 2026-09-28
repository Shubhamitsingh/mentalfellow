export const posts = [
  {
    slug: 'rice-straw-leather',
    title: 'Rice straw, finished as leather.',
    category: 'Material',
    date: '2026-09-22',
    excerpt:
      'The grain is taken. What remains is rice straw. We finish that straw as leather, then cut it into a bag, a wallet, or a belt you can actually use.',
    image: '/materials/rice-straw-leather.png',
    alt: 'A sheet of rice-straw leather beside a bundle of rice straw',
    shop: { href: '/materials/paddy-rice-waste', label: 'Shop the leather', line: 'Pieces finished from rice straw.' },
    sections: [
      {
        heading: 'After the grain',
        paragraphs: [
          'The grain is taken. What remains is rice straw. That straw is the start of the leather, not a sample kept beside the finished piece.',
          'We do not treat the straw as a story told after the product is made. The leather is the straw, finished into a sheet that can be cut and stitched.',
        ],
      },
      {
        heading: 'What you hold',
        paragraphs: [
          'The sheet still has to work. A bag needs a strap. A wallet needs a slot a card fits. A belt needs a length that sits at the waist. If it only looks like leather and fails in the hand, it is not in the line.',
          'Hardware, linings, and straps are often a different material. The product page lists them apart from the straw, so the headline does not hide them.',
        ],
      },
      {
        heading: 'Named on the piece',
        paragraphs: [
          'Every piece made from this straw says so, next to the price. You should be able to read the material before you decide to keep it.',
        ],
      },
    ],
  },
  {
    slug: 'wheat-straw-suede',
    title: 'Wheat straw, finished as suede.',
    category: 'Material',
    date: '2026-09-15',
    excerpt:
      'Wheat straw is the second material. The soft face you feel is the suede made from it, cut into pieces meant to be carried and worn.',
    image: '/materials/wheat-straw-suede.png',
    alt: 'Wheat-straw suede beside stalks of wheat',
    shop: { href: '/materials/wheat-waste', label: 'Shop the suede', line: 'Pieces finished from wheat straw.' },
    sections: [
      {
        heading: 'The second straw',
        paragraphs: [
          'Rice straw becomes the leather. Wheat straw becomes the suede. They are not two names for the same sheet. The suede has a soft face. The leather is smooth.',
          'Both start as straw left after the crop is cut. Both leave the workshop as a material that can be made into a product.',
        ],
      },
      {
        heading: 'A soft face, still a product',
        paragraphs: [
          'Suede is easy to admire as a surface and hard to trust as a thing you use. We cut it into the same kinds of pieces as the leather: a sling, a wallet, a travel cube, a shoe.',
          'A sheet on a table is not the product. The product is the one you pick up and take with you.',
        ],
      },
      {
        heading: 'How to tell them apart',
        paragraphs: [
          'The product page names wheat straw when that is what you are holding, and rice straw when the piece is leather. If you are choosing between the two, start with the name, then the hand-feel.',
        ],
      },
    ],
  },
  {
    slug: 'named-on-the-piece',
    title: 'Read the material before you buy.',
    category: 'The shop',
    date: '2026-09-08',
    excerpt:
      'A claim is only useful if you can check it. On every Mental Fellow piece, the straw is written next to the price.',
    image: '/uploads/model4.png',
    imagePosition: 'center 18%',
    alt: 'Two women in red, one in a black cap and one in sunglasses',
    shop: { href: '/shop', label: 'Shop the line', line: 'Every piece names its straw.' },
    sections: [
      {
        heading: 'Next to the price',
        paragraphs: [
          'A claim is only useful if you can check it. Rice straw leather and wheat straw suede are named on the product, in the same place you read the price.',
          'You should not have to open a separate page to learn what the piece is made from. The name is on the piece you are about to buy.',
        ],
      },
      {
        heading: 'What else is in it',
        paragraphs: [
          'A bag is rarely one material all the way through. A lining, a zip, a sole, or a strap can be something else. Those parts are listed apart from the straw.',
          'That split is the point. The headline material stays exact, and the rest of the construction stays visible.',
        ],
      },
      {
        heading: 'The sentence and the object',
        paragraphs: [
          'If we cannot show it on the product page, we do not write it. The object and the sentence should match.',
        ],
      },
    ],
  },
  {
    slug: 'what-the-line-is-for',
    title: 'A bag, a wallet, a belt, a shoe.',
    category: 'The line',
    date: '2026-09-01',
    excerpt:
      'The material is only the start. The line is the things you carry, wear, and pack: bags, wallets, belts, footwear, and travel.',
    image: '/uploads/model6.png',
    imagePosition: 'center 20%',
    alt: 'A model carrying a bag from the Mental Fellow line',
    shop: { href: '/shop', label: 'Shop all', line: 'Bags, wallets, belts, footwear, and travel.' },
    sections: [
      {
        heading: 'Made to be used',
        paragraphs: [
          'We do not stop at a material sample. The work is to turn that sheet into a product someone actually wants: a sling for the day, a belt that fits, a shoe that can be worn in.',
          'The departments are bags, wallets and small accessories, belts, footwear, and travel. That is the line. There is no separate story collection sitting beside it.',
        ],
      },
      {
        heading: 'Start with the job',
        paragraphs: [
          'If you need something for the day, start with bags. If you need a card and a note of cash, start with wallets. Travel is for the pieces that pack, not for a bigger version of a day bag.',
          'Men and women are ways to browse. The material is the same standard on both: the straw is named, and the price includes tax.',
        ],
      },
      {
        heading: 'Then read the straw',
        paragraphs: [
          'Once the job is clear, read which straw it is. Rice straw is the leather. Wheat straw is the suede. Choose the piece the way you would choose any bag or shoe, then check the material the page already states.',
        ],
      },
    ],
  },
]

export function postBySlug(slug) {
  return posts.find((post) => post.slug === slug) ?? null
}

export function postsByDate() {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date))
}

export function formatPostDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
