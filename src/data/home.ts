import { images } from './images'

export { images }

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
    video: images.privateDinnerVideo,
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
    video: images.dateNightVideo,
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
    video: images.corporateEventsVideo,
  },
  {
    title: 'Vacation chef',
    copy: 'A private chef for your villa, Airbnb, or group trip.',
    image: images.vacationChef,
  },
] as const

export const cuisines = [
  'Ghanaian',
  'West African',
  'Coastal & seafood',
  'Continental',
  'Vegan & vegetarian',
  'Chef’s tasting menus',
] as const

export const trustItems = [
  {
    title: 'Identity-minded profiles',
    copy: 'Girki is designed around chef identity, experience, and transparent profiles.',
    icon: images.trustIdentity,
  },
  {
    title: 'Protected payments',
    copy: 'A clear booking journey with local payment methods and transparent price breakdowns.',
    icon: images.trustPayments,
  },
  {
    title: 'Quality standards',
    copy: 'Food-safety documentation and chef verification are core to the planned onboarding flow.',
    icon: images.trustQuality,
  },
  {
    title: 'Human support',
    copy: 'Support for customers and chefs before, during, and after each experience.',
    icon: images.trustSupport,
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
