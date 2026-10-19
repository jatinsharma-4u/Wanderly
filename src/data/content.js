import { avatars } from './reviews'

export const offers = [
  {
    id: 'o1',
    code: 'WANDER10',
    title: 'Flat 10% off your first trip',
    desc: 'New to Wanderly? Take 10% off any domestic package, up to ₹8,000.',
    type: 'percent',
    value: 10,
    maxDiscount: 8000,
    minAmount: 15000,
    validTill: '2026-12-31',
    image: '1589901164570-f9de6556e1c1',
    tag: 'New users',
  },
  {
    id: 'o2',
    code: 'HONEYMOON15',
    title: '15% off honeymoon escapes',
    desc: 'Celebrate together, 15% off all Honeymoon & Luxury packages, up to ₹20,000.',
    type: 'percent',
    value: 15,
    maxDiscount: 20000,
    minAmount: 25000,
    categories: ['Honeymoon', 'Luxury'],
    validTill: '2027-02-28',
    image: '1519307212971-dd9561667ffb',
    tag: 'Couples',
  },
  {
    id: 'o3',
    code: 'WINTER5K',
    title: '₹5,000 off winter getaways',
    desc: 'Flat ₹5,000 off any booking above ₹40,000 for travel between Dec and Feb.',
    type: 'flat',
    value: 5000,
    minAmount: 40000,
    validTill: '2027-01-31',
    image: '1626621341517-bbf3d9990a23',
    tag: 'Seasonal',
  },
  {
    id: 'o4',
    code: 'FAMILY8',
    title: '8% off family holidays',
    desc: 'Kids under 5 travel free plus 8% off all Family packages.',
    type: 'percent',
    value: 8,
    maxDiscount: 12000,
    minAmount: 20000,
    categories: ['Family'],
    validTill: '2027-03-31',
    image: '1597524678053-5e6fef52d8a3',
    tag: 'Family',
  },
]

export const findCoupon = (code) => offers.find((o) => o.code.toLowerCase() === String(code).trim().toLowerCase())

// Returns { ok, discount, message }
export const applyCoupon = (code, amount, category) => {
  const c = findCoupon(code)
  if (!c) return { ok: false, discount: 0, message: 'That code isn’t valid. Try WANDER10.' }
  if (amount < c.minAmount) return { ok: false, discount: 0, message: `Minimum booking of ₹${c.minAmount.toLocaleString('en-IN')} required.` }
  if (c.categories && category && !c.categories.includes(category))
    return { ok: false, discount: 0, message: `Valid only on ${c.categories.join(' & ')} packages.` }
  const raw = c.type === 'percent' ? (amount * c.value) / 100 : c.value
  const discount = Math.min(raw, c.maxDiscount ?? raw)
  return { ok: true, discount, message: `${c.code} applied, you save ₹${Math.round(discount).toLocaleString('en-IN')}`, coupon: c }
}

export const flashDeals = [
  { slug: 'goa-coastal-escape', off: 18, endsIn: 2 },
  { slug: 'kashmir-paradise', off: 14, endsIn: 4 },
  { slug: 'andaman-island-hopper', off: 12, endsIn: 6 },
]

export const experiences = [
  { key: 'Adventure', title: 'Adventure', desc: 'High passes, rapids & treks', image: '1760904652241-36ad6b4e752f', count: 3 },
  { key: 'Honeymoon', title: 'Honeymoon', desc: 'Private villas & sunset dinners', image: '1519307212971-dd9561667ffb', count: 3 },
  { key: 'Family', title: 'Family holidays', desc: 'Easy pace, big smiles', image: '1597524678053-5e6fef52d8a3', count: 3 },
  { key: 'Luxury', title: 'Luxury escapes', desc: 'Palaces, overwater villas', image: '1713186103033-60ff76a7b89d', count: 3 },
  { key: 'Spiritual', title: 'Spiritual journeys', desc: 'Ghats, ashrams & aartis', image: '1627894483216-2138af692e32', count: 1 },
]

export const team = [
  { name: 'Ritu Malhotra', role: 'Founder & CEO', avatar: avatars.meera, bio: '18 years in luxury travel; has visited every Indian state.' },
  { name: 'Aditya Rao', role: 'Head of Experiences', avatar: avatars.vikram, bio: 'Former trek leader who designs our Himalayan routes.' },
  { name: 'Sana Qureshi', role: 'Customer Happiness', avatar: avatars.sneha, bio: 'Leads our 24/7 trip-host team across three time zones.' },
  { name: 'Neel Banerjee', role: 'Partnerships', avatar: avatars.kabir, bio: 'Curates our network of 400+ boutique stays.' },
]

export const faqs = [
  { cat: 'Booking', q: 'How do I book a package?', a: 'Open any package, choose your travel date and travellers, and click “Book now”. Fill in traveller details and confirm, you’ll receive a booking reference instantly and a trip host will call you within 4 working hours.' },
  { cat: 'Booking', q: 'Can I customise a package?', a: 'Absolutely. Every itinerary can be tailored, add nights, upgrade hotels, or swap activities. Use the Custom Trip Planner or mention it in the special requests field while booking.' },
  { cat: 'Booking', q: 'How much advance do I need to pay?', a: 'A 25% advance confirms most domestic trips. The balance is due 21 days before departure. International trips require 40% to process flights and visas.' },
  { cat: 'Payments', q: 'Which payment methods do you accept?', a: 'UPI, all major credit/debit cards, net banking and no-cost EMI on select cards. (Payments are simulated in this demo.)' },
  { cat: 'Payments', q: 'Are there any hidden charges?', a: 'No. Prices include taxes and everything listed under inclusions. Optional add-ons are always shown before you pay.' },
  { cat: 'Cancellation', q: 'What is your cancellation policy?', a: 'Free cancellation up to 30 days before departure (excluding non-refundable components). See our Cancellation & Refund Policy for the full slab.' },
  { cat: 'Cancellation', q: 'How long do refunds take?', a: 'Refunds are initiated within 3 working days and typically reach your account in 5–7 working days depending on your bank.' },
  { cat: 'On trip', q: 'Will someone be available during my trip?', a: 'Yes, every Wanderly traveller gets a dedicated trip host on WhatsApp and phone, 24/7, from booking until you return home.' },
  { cat: 'On trip', q: 'Is travel insurance included?', a: 'Insurance is optional and not included by default. We can add comprehensive cover from ₹399 per person.' },
  { cat: 'Visas', q: 'Do you help with visas?', a: 'Yes. We assist with documentation and appointments for Schengen, UAE, Singapore, Thailand and more. Visa fees are charged at actuals.' },
]

export const blogPosts = [
  {
    slug: 'first-timers-guide-to-ladakh',
    title: 'A first-timer’s guide to Ladakh: acclimatise, explore, repeat',
    excerpt: 'Altitude, permits, packing and the perfect 7-day route, everything we wish we knew before our first trip to the roof of the world.',
    category: 'Guides',
    cover: '1581793745862-99fde7fa73d2',
    author: { name: 'Aditya Rao', avatar: avatars.vikram },
    date: '2026-09-18',
    readTime: 8,
    featured: true,
  },
  {
    slug: 'kerala-houseboat-etiquette',
    title: 'The slow joy of a Kerala houseboat, and how to choose one',
    excerpt: 'Premium vs deluxe, shared vs private, one night or two? Our backwater experts answer the questions every traveller asks.',
    category: 'Experiences',
    cover: '1593693397690-362cb9666fc2',
    author: { name: 'Sana Qureshi', avatar: avatars.sneha },
    date: '2026-08-30',
    readTime: 6,
  },
  {
    slug: 'udaipur-in-48-hours',
    title: 'Udaipur in 48 hours: palaces, lakes and rooftop dinners',
    excerpt: 'A perfectly paced two-day plan for the City of Lakes, with our favourite heritage stays and sunset spots.',
    category: 'Itineraries',
    cover: '1615836245337-f5b9b2303f10',
    author: { name: 'Ritu Malhotra', avatar: avatars.meera },
    date: '2026-08-12',
    readTime: 5,
  },
  {
    slug: 'meghalaya-root-bridges',
    title: 'Walking on living roots: the bridges of Meghalaya',
    excerpt: 'How Khasi communities grew bridges over centuries, and how to trek to the double-decker at Nongriat responsibly.',
    category: 'Culture',
    cover: '1593813738953-fb3c93e0769d',
    author: { name: 'Neel Banerjee', avatar: avatars.kabir },
    date: '2026-07-22',
    readTime: 7,
  },
  {
    slug: 'best-beaches-andaman',
    title: '7 Andaman beaches that live up to the photos',
    excerpt: 'From Radhanagar’s sunsets to Neil Island’s rock bridges, the islands’ best sand, ranked by our team.',
    category: 'Guides',
    cover: '1586359716568-3e1907e4cf9f',
    author: { name: 'Sana Qureshi', avatar: avatars.sneha },
    date: '2026-06-28',
    readTime: 5,
  },
  {
    slug: 'what-to-eat-amritsar',
    title: 'What to eat in Amritsar: a 24-hour food trail',
    excerpt: 'Kulchas at dawn, langar at noon, phirni at midnight. A day of eating your way around the holy city.',
    category: 'Food',
    cover: '1767114915989-c6ab3c8fc42e',
    author: { name: 'Aditya Rao', avatar: avatars.vikram },
    date: '2026-06-02',
    readTime: 4,
  },
]

export const blogBody = (post) => [
  { type: 'p', text: `${post.excerpt} In this guide we share what our trip hosts have learned from hundreds of journeys, the practical details that turn a good holiday into an unforgettable one.` },
  { type: 'h2', text: 'When to go' },
  { type: 'p', text: 'Timing changes everything. Shoulder seasons bring thinner crowds, softer light and better hotel rates, while peak months guarantee open roads and clear skies. We always recommend building one buffer day into your plan for weather or simple rest.' },
  { type: 'quote', text: 'The best trips leave room for the unplanned, a chai stop that turns into an afternoon.' },
  { type: 'h2', text: 'How to plan your days' },
  { type: 'p', text: 'Keep mornings for the headline sights before the crowds arrive, and leave afternoons loose for wandering, cafés and local markets. Travel days should be short wherever possible; scenic drives are part of the experience, not just the commute.' },
  { type: 'p', text: 'If you are travelling with family or older parents, choose stays with ground-floor rooms and plan no more than one major activity per day. For couples, one splurge experience, a private boat ride, a sunset dinner, tends to become the trip’s defining memory.' },
  { type: 'h2', text: 'What to pack' },
  { type: 'p', text: 'Layers beat bulk. A light down jacket, comfortable walking shoes, a reusable bottle and a basic medical kit cover most Indian itineraries. Carry printed and digital copies of your ID, and keep some cash for smaller towns where cards may not work.' },
  { type: 'h2', text: 'Travel responsibly' },
  { type: 'p', text: 'Choose locally owned stays, hire local guides and carry your waste back from fragile places. Small choices add up, and they make for richer, more personal encounters along the way.' },
]

export const stats = [
  { value: 48000, suffix: '+', label: 'Happy travellers' },
  { value: 12, suffix: ' yrs', label: 'Crafting journeys' },
  { value: 120, suffix: '+', label: 'Destinations' },
  { value: 4.9, suffix: '/5', label: 'Average rating', decimals: 1 },
]
