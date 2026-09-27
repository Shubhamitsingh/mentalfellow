import { photo } from '@/content/media'

export const homeContent = {
  hero: {
    eyebrow: 'Mental Fellow',
    title: 'Fashion,',
    emphasis: 'reimagined.',
    subtitle: 'Turning innovative materials into modern everyday essentials.',
    action: 'Shop the collection',
    slides: [
      { src: '/uploads/model1.png', alt: 'A woman in red holding a woven black shoulder bag' },
      { src: '/uploads/model2.jpg', alt: 'A woman in black holding a burgundy handbag' },
      { src: '/uploads/model3.png', alt: 'A woman in red holding a woven black bag by the handle' },
      { src: '/uploads/model5.jpg', alt: 'A woman in burgundy holding a black bag and a red bag' },
      { src: '/uploads/model4.jpg', alt: 'A woman holding a burgundy barrel bag' },
      { src: '/uploads/model6.png', alt: 'Two women in red, one in a black cap and one in sunglasses' },
      { src: '/uploads/model7.png', alt: 'A woman in yellow holding a blue bag with a chain strap' },
      { src: '/uploads/model8.png', alt: 'A close-up of a yellow textured handbag' },
      { src: '/uploads/model9.png', alt: 'A person in a yellow jacket and pink sunglasses, seen from behind' },
    ],
    href: '/shop',
  },
  departments: [
    {
      label: 'Shop women',
      href: '/women',
      image: photo('photo-1590874103328-eac38a683ce7', 1200, 1500),
      alt: 'A tote bag held at the side',
    },
    {
      label: 'Shop men',
      href: '/men',
      image: photo('photo-1553062407-98eeb64c6a62', 1200, 1500),
      alt: 'A backpack against a plain wall',
    },
    {
      label: 'Bags',
      href: '/bags',
      image: photo('photo-1584917865442-de89df76afd3', 900, 1100),
      alt: 'A brown leather-like tote',
    },
    {
      label: 'Wallets & accessories',
      href: '/wallets',
      image: photo('photo-1627123424574-724758594e93', 900, 1100),
      alt: 'A slim wallet opened on a table',
    },
    {
      label: 'Footwear',
      href: '/footwear',
      image: photo('photo-1533867617858-e7b97e060509', 900, 1100),
      alt: 'A pair of black derby shoes',
    },
    {
      label: 'Travel',
      href: '/travel',
      image: photo('photo-1547949003-9792a18a2601', 900, 1100),
      alt: 'A travel bag standing on the floor',
    },
  ],
  materialStory: {
    eyebrow: 'Material',
    title: 'Rice straw, made into leather.',
    body: 'Rice straw becomes leather. Wheat straw becomes suede. The finished sheet still has to work as a bag, a wallet, or a travel cube.',
    href: '/materials/paddy-rice-waste',
    action: 'See the leather',
    image: '/materials/rice-straw-leather.png',
    alt: 'A sheet of rice-straw leather beside a bundle of rice straw',
  },
  story: {
    eyebrow: 'The brand',
    title: 'Carry it. Wear it. Use it.',
    body: 'We do not stop at a material sample. The work is to turn that material into a product someone actually wants: a sling for the train, a belt that fits, a shoe that can be worn in.',
  },
}
