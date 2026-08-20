export const images = {
  hero:
    'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-hero-private-chef-260813050731.webp',
  privateDinner:
    'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-private-dinner-experience-260813050741.webp',
  mealPrep:
    'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-weekly-meal-prep-260813050736.webp',
  chefWok: '/images/chef-wok-kitchen.jpg',
  dateNight:
    'https://storage.googleapis.com/ployai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-date-night-experience-260814033355.webp',
  chefFlour: '/images/chef-flour-portrait.jpg',
  partiesCelebrations:
    'https://storage.googleapis.com/ployai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-celebration-experience-260814033400.webp',
  corporateEvents: '/images/corporate-events.png',
  vacationChef: '/images/vacation-chef.png',
  nana: 'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-chef-portrait-nana-260813050743.webp',
  youssef:
    'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
  amani: '/images/chef-stephanie.jpg',
  cuisine:
    'https://cdn.ploy.ai/7fa0b0a2-fa30-47e8-b8d1-487f2abe8b69/user/ai-girki-african-cuisine-table-260813050738.webp',
  opportunity: '/images/chef-wok-kitchen.jpg',
} as const

export const navLinks = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#featured-chefs', label: 'Our chefs' },
  { href: '#experiences', label: 'Experiences' },
  { href: '#trust', label: 'Trust & safety' },
] as const

export const experiences = [
  {
    title: 'Private dinner',
    copy: 'Turn your home into a restaurant for the evening.',
    image: images.privateDinner,
  },
  {
    title: 'Weekly meal prep',
    copy: 'Fresh meals prepared around your week and household.',
    image: images.mealPrep,
  },
  {
    title: 'Date night',
    copy: 'Restaurant-quality dining without leaving home.',
    image: images.dateNight,
  },
  {
    title: 'Parties & celebrations',
    copy: 'Birthdays, graduations, anniversaries, and special moments.',
    image: images.partiesCelebrations,
  },
  {
    title: 'Corporate events',
    copy: 'Thoughtful food experiences for teams and businesses.',
    image: images.corporateEvents,
  },
  {
    title: 'Vacation chef',
    copy: 'A private chef for your villa, Airbnb, or group trip.',
    image: images.vacationChef,
  },
] as const

export const chefs = [
  {
    name: 'Chef Nana K.',
    location: 'Accra, Ghana',
    specialties: 'Ghanaian · Continental · Fine dining',
    pricing: 'From GH₵450',
    image: images.nana,
    alt: 'Chef Nana K., private chef in Accra, Ghana',
  },
  {
    name: 'Chef Youssef B.',
    location: 'Casablanca, Morocco',
    specialties: 'Moroccan · North African · Grill',
    pricing: 'Pricing by experience',
    image: images.youssef,
    alt: 'Chef Youssef B., private chef in Casablanca, Morocco',
  },
  {
    name: 'Chef Stephanie K.',
    location: 'Nairobi, Kenya',
    specialties: 'East African · Coastal · Family meals',
    pricing: 'Pricing by experience',
    image: images.amani,
    alt: 'Chef Stephanie K. in Nairobi, Kenya',
  },
] as const

export const cuisines = [
  'Ghanaian',
  'Nigerian',
  'Ethiopian',
  'Senegalese',
  'Kenyan',
  'South African',
  'Moroccan',
  'Ivorian',
  'Cameroonian',
  'Vegan & vegetarian',
] as const

export const trustItems = [
  {
    title: 'Identity-minded profiles',
    copy: 'Girki is designed around chef identity, experience, and transparent profiles.',
    icon: '/images/trust/identity.png',
  },
  {
    title: 'Protected payments',
    copy: 'A clear booking journey with local payment methods and transparent price breakdowns.',
    icon: '/images/trust/payments.png',
  },
  {
    title: 'Quality standards',
    copy: 'Food-safety documentation and chef verification are core to the planned onboarding flow.',
    icon: '/images/trust/quality.png',
  },
  {
    title: 'Human support',
    copy: 'Support for customers and chefs before, during, and after each experience.',
    icon: '/images/trust/support.png',
  },
] as const

export const chefBenefits = [
  'Set your own prices',
  'Create your own menus',
  'Choose when you work',
  'Reach new customers',
  'Receive secure payments',
  'Build your reputation',
] as const

export const footerColumns = [
  {
    title: 'Girki',
    links: ['About', 'How it works', 'Careers', 'Press'],
  },
  {
    title: 'Customers',
    links: ['Find a chef', 'Gift experiences', 'Help center', 'Trust & safety'],
  },
  {
    title: 'Chefs',
    links: ['Become a chef', 'Chef resources', 'Chef login'],
  },
  {
    title: 'Company',
    links: ['Terms', 'Privacy', 'Cookie policy'],
  },
] as const
