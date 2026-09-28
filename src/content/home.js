import { photo } from '@/content/media'

export const homeContent = {
  hero: {
    eyebrow: 'Mental Fellow',
    title: 'Not made',
    emphasis: 'to fit in.',
    subtitle: 'Turning innovative materials into modern everyday essentials.',
    action: 'Shop the collection',
    slides: [
      { src: '/uploads/model10.png', alt: 'A woman in a lime top and black jacket against a green wall', wide: true },
      { src: '/uploads/model1.png', alt: 'A woman in red holding a woven black shoulder bag' },
      { src: '/uploads/model2.png', alt: 'A woman in red holding a woven black bag by the handle' },
      { src: '/uploads/model4.png', alt: 'Two women in red, one in a black cap and one in sunglasses', wide: true },
      { src: '/uploads/model5.png', alt: 'A woman in yellow holding a blue bag with a chain strap' },
      { src: '/uploads/model9.png', alt: 'A woman in a yellow top and pink sunglasses against a red shutter' },
      { src: '/uploads/model3.png', alt: 'A woman in a lime top tying the front against a green wall', wide: true },
      { src: '/uploads/model6.png', alt: 'A person in a lime hood and brown jacket carrying a red crossbody bag' },
    ],
    href: '/shop',
  },
  doors: [
    {
      label: 'Shop women',
      href: '/women',
      image: '/uploads/model15.jpg',
      alt: 'A woman in a yellow cropped hoodie sitting in the sun',
    },
    {
      label: 'Shop men',
      href: '/men',
      image: '/uploads/model14.png',
      alt: 'A man in a black sleeveless top and sunglasses standing outside',
    },
  ],
  shopByMaterial: [
    {
      label: 'Rice Straw',
      href: '/materials/paddy-rice-waste',
      image: '/uploads/model15.jpg',
      alt: 'A woman in a yellow cropped hoodie',
    },
    {
      label: 'Wheat Straw',
      href: '/materials/wheat-waste',
      image: '/uploads/model14.png',
      alt: 'A man in a black sleeveless top and sunglasses',
    },
    {
      label: 'Banana Fibre',
      href: '/materials/banana-fibre',
      image: '/uploads/model9.png',
      alt: 'A woman in a yellow top and pink sunglasses',
    },
    {
      label: 'Pineapple Fibre',
      href: '/materials/pineapple-fibre',
      image: '/uploads/model5.png',
      alt: 'A woman in yellow holding a blue bag',
    },
    {
      label: 'Recycled Textile',
      href: '/materials/recycled-textile',
      image: '/uploads/model6.png',
      alt: 'A person in a lime hood carrying a red bag',
    },
  ],
  departments: [
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
    eyebrow: 'Our story',
    title: 'Carry it. Wear it. Use it.',
    body: 'We do not stop at a material sample. The work is to turn that material into a product someone actually wants: a sling for the train, a belt that fits, a shoe that can be worn in.',
    image: '/uploads/model4.png',
    alt: 'Two women in red, one in a black cap and one in sunglasses',
  },
  materialNotes: [
    { icon: 'sprout', label: 'Rice straw leather' },
    { icon: 'wheat', label: 'Wheat straw suede' },
    { icon: 'tag', label: 'Named on every piece' },
    { icon: 'bag', label: 'Made to be used' },
  ],
}
