import { site } from '@/lib/site'

export const pages = {
  about: {
    title: 'About',
    description: 'What Mental Fellow sells, and how the shop works.',
    lead: 'Mental Fellow is the name on the finished pieces.',
    paragraphs: [
      'The line is bags, wallets, small accessories, belts, footwear, and travel goods. Rice straw is what I turn into leather. Wheat straw is what I turn into suede. Those are the only two materials. The leather is smooth. The suede has a soft face.',
      'I care more about a bag you pick up every morning than a sample that stays in a workshop.',
      'I sell direct, and tax is already included in the price. Each product states which straw it is made from. If a strap or lining is a different material, that is written on the page too. I will not make a claim I cannot show you.',
    ],
    more: { href: '/our-story', label: 'Read the story' },
  },
  'our-story': {
    title: 'Our story',
    description: 'How Mental Fellow finishes rice straw as leather and wheat straw as suede.',
    lead: 'The piece starts where the harvest ends.',
    paragraphs: [
      'The grain is taken. Rice straw and wheat straw remain. We finish the first as leather and the second as suede, then cut them into bags, wallets, belts, shoes, and travel pieces.',
      'A sheet is not the product. The product is something you carry, wear, and use: a sling for the day, a belt that sits cleanly, a shoe you can walk in.',
      'Every piece names its material. If a strap, lining, or sole is something else, that is written beside it. The claim stays as exact as the object.',
    ],
    more: { href: '/about', label: 'About the shop' },
  },
  careers: {
    title: 'Careers',
    description: 'Roles at Mental Fellow.',
    paragraphs: [
      'We are a small team. When we hire, it is for people who care about cloth, fit, and clear writing.',
      'Open roles are posted here when they exist. If you do not see one, you can still write to hello@mentalfellow.store with a short note and a link to your work.',
    ],
  },
  shipping: {
    title: 'Shipping',
    description: 'Delivery times, fees, and what free shipping means at Mental Fellow.',
    lead: 'We ship across India. The fee and the delivery window are clear before you pay.',
    paragraphs: [],
    sections: [
      {
        title: 'Where we deliver',
        paragraphs: [
          'Orders are delivered to pincodes inside India. We do not ship outside the country yet. Enter your pincode on the product page for an estimate. Checkout is where the address and the fee are confirmed.',
        ],
      },
      {
        title: 'What shipping costs',
        paragraphs: [
          `Orders of ₹${site.freeShippingThreshold} and above ship free. Below that, a flat fee of ₹${site.shippingFee} is added. The bag shows an estimate. Checkout calculates the fee again, and that is the amount you pay.`,
          'The same fee applies to prepaid orders and to cash on delivery, when cash on delivery is offered at checkout. We do not add a separate platform charge.',
        ],
      },
      {
        title: 'When an order leaves',
        paragraphs: [
          'Most orders are packed in 1–2 working days, Monday to Saturday, not counting public holidays. If a prepaid order and a cash-on-delivery order are both waiting, the prepaid order is packed first.',
        ],
      },
      {
        title: 'How long it takes',
        paragraphs: [
          'After the parcel leaves, most pincodes receive it in 3–6 days. That window is a guide. Weather, public holidays, and the courier’s route can add time. If a delay is already clear, we write to you.',
          'A product page can show its own estimate when the piece needs a little longer to finish. That note overrides the usual 3–6 days for that piece only.',
        ],
      },
      {
        title: 'Tracking',
        paragraphs: [
          'You receive a tracking link by email when the parcel is handed to the courier. We are not tied to one courier. You can also follow an order from the track-order page with the order number and the email used at checkout.',
        ],
      },
      {
        title: 'More than one piece',
        paragraphs: [
          'If two pieces in the same order cannot leave together, we may send them in separate parcels. You get a tracking link for each one, and you are not charged shipping a second time.',
        ],
      },
      {
        title: 'Address and delivery attempts',
        paragraphs: [
          'Check the name, phone, and address before you pay. After the parcel has left, the courier usually cannot change the address.',
          'If nobody is home or the address is incomplete, the courier tries again. If it still cannot be delivered, the parcel comes back to us and we contact you about sending it out again.',
        ],
      },
      {
        title: 'If a parcel is late or damaged',
        paragraphs: [
          `If the expected date has passed and tracking has not moved, write to ${site.contactEmail} with your order number.`,
          'If the parcel arrives damaged, or the piece is not what you ordered, write to the same address as soon as you open it. Include the order number and photos of the piece and the packaging. We will replace it or refund it.',
        ],
      },
      {
        title: 'Returns and exchanges',
        paragraphs: [
          `Unused pieces, with tags, can be returned or exchanged within ${site.exchangeWindowDays} days of delivery. The full rules sit on the returns and exchange pages.`,
        ],
      },
    ],
    links: [
      { href: '/returns', label: 'Returns and refunds' },
      { href: '/exchange', label: 'Exchanges' },
      { href: '/track-order', label: 'Track an order' },
    ],
  },
  returns: {
    title: 'Returns and refunds',
    description: 'How returns and refunds work at Mental Fellow.',
    paragraphs: [
      'Unworn items with tags can be returned within 7 days of delivery. The piece should be in the condition we sent it, including the label.',
      'Refunds go back to the original payment method after the return reaches us and passes a quick quality check. Prepaid refunds typically show in 5–7 working days after approval. Cash on delivery is refunded to the bank account you share on the return form.',
      'Sale items can be returned unless a piece is marked final sale on its product page. Earrings and other pierced jewellery, when we stock them, are not returnable for hygiene.',
    ],
  },
  exchange: {
    title: 'Exchanges',
    description: 'Size and product exchanges at Mental Fellow.',
    paragraphs: [
      'You can exchange a size or a colour within 7 days of delivery, as long as the piece is unworn and the new variant is in stock.',
      'Start the request from your order. If we can fulfil the new size, we ship it once the original is picked up or received. If we cannot, we refund you.',
      'Exchanges are one per item. A second change is treated as a return and a new order.',
    ],
  },
  cancellation: {
    title: 'Cancellation',
    description: 'When a Mental Fellow order can be cancelled.',
    paragraphs: [
      'You can cancel an order until it is packed. Once it is shipped, cancel the delivery with the courier if the option is still open, or refuse the parcel and we will treat it as a return.',
      'Prepaid cancellations are refunded to the original method. If the parcel already left, shipping charged by the courier may be deducted when the business rules say so.',
      'Delivered orders cannot be cancelled. Use the return window instead.',
    ],
  },
  privacy: {
    title: 'Privacy',
    description: 'What Mental Fellow stores about you, and why.',
    paragraphs: [
      'We store the details needed to run an order: name, phone, email, address, and what you bought. Payment card numbers are handled by the payment gateway. We do not keep them.',
      'Wishlist, bag, and recently viewed pieces may be stored on your device if you are browsing as a guest, and on your account once you sign in.',
      'We do not sell personal data. Analytics, if enabled later, will load only after a consent choice. Write to hello@mentalfellow.store to ask for a copy of your data or to delete an account.',
    ],
  },
  terms: {
    title: 'Terms',
    description: 'The terms for shopping at Mental Fellow.',
    paragraphs: [
      'By placing an order you confirm the pieces, sizes, and address are correct, and that you are buying for personal use. Prices on the product page can change, but a confirmed order keeps the price you paid.',
      'Title in the goods passes to you when the parcel is delivered. Until then, risk stays with us except where a courier event is outside our control and we have already handed the parcel over with a valid tracking number.',
      'These terms are governed by the laws of India. If a clause is unenforceable, the rest still stands.',
    ],
  },
}

export const faqs = [
  {
    question: 'How do I choose a size?',
    answer:
      'Shoes and belts have a size chart on the product page. Bags and wallets are one size, with dimensions and capacity listed in the material story. Between shoe sizes, take the larger UK size.',
  },
  {
    question: 'When is shipping free?',
    answer: 'Orders of ₹999 and above ship free inside India. The bag shows an estimate. Checkout confirms the final fee.',
  },
  {
    question: 'Can I exchange a size?',
    answer: 'Yes, within 7 days of delivery, if the new size is in stock and the piece is unworn with tags.',
  },
  {
    question: 'Do you take cash on delivery?',
    answer: 'When it is enabled, cash on delivery follows a minimum, a maximum, and pincode rules set by the store. The checkout page only offers it when those rules pass.',
  },
  {
    question: 'How do reviews work?',
    answer: 'Only people who bought the piece can leave a verified review. Reviews stay pending until they are approved.',
  },
]
