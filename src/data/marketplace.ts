import { images } from './images'
import { chefPhotoUrl } from '../lib/media'
import { isChefBookable } from '../lib/feature-flags'

/** Girki launch market — widen cities and `chefs` export when new countries go live. */
export const launchCountry = 'Ghana'

export const cities = [
  { slug: 'accra', name: 'Accra', country: 'Ghana' },
  { slug: 'kumasi', name: 'Kumasi', country: 'Ghana' },
  { slug: 'tema', name: 'Tema', country: 'Ghana' },
  { slug: 'cape-coast', name: 'Cape Coast', country: 'Ghana' },
  { slug: 'takoradi', name: 'Takoradi', country: 'Ghana' },
] as const

export const occasions = [
  { id: 'date-night', label: 'Date night' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'family', label: 'Family gathering' },
  { id: 'friends', label: 'Friends dinner' },
  { id: 'corporate', label: 'Corporate' },
  { id: 'vacation', label: 'Vacation chef' },
  { id: 'other', label: 'Other' },
] as const

export const serviceTypes = [
  {
    id: 'single',
    label: 'Single service',
    copy: 'One chef, one occasion: dinner, lunch, or a celebration at home.',
  },
  {
    id: 'multiple',
    label: 'Multiple services',
    copy: 'Ideal for holidays, villas, and group trips across several days.',
  },
  {
    id: 'weekly',
    label: 'Weekly meal prep',
    copy: 'A chef who cooks around your week and household.',
  },
] as const

export const guestOptions = [
  { id: '2', label: '2 guests' },
  { id: '3-6', label: '3 to 6 guests' },
  { id: '7-12', label: '7 to 12 guests' },
  { id: '13+', label: '13+ guests' },
] as const

export const mealTimes = [
  { id: 'lunch', label: 'Lunch' },
  { id: 'dinner', label: 'Dinner' },
] as const

export const cuisineOptions = [
  'Ghanaian',
  'West African',
  'Continental',
  'Seafood',
  'Vegetarian',
  "Chef's special",
] as const

export const budgetOptions = [
  {
    id: 'casual',
    label: 'Casual',
    copy: 'Warm, generous cooking for connection around the table.',
  },
  {
    id: 'gourmet',
    label: 'Gourmet',
    copy: 'Thoughtful menus designed to impress your guests.',
  },
  {
    id: 'exclusive',
    label: 'Exclusive',
    copy: 'The most refined experience Girki chefs can create.',
  },
] as const

export type Chef = {
  id: string
  name: string
  location: string
  city: string
  lat: number
  lng: number
  specialties: string
  cuisines: string[]
  pricing: string
  rating: number
  services: number
  image: string
  alt: string
  bio: string
  included: string[]
}

const allChefs: Chef[] = [
  {
    id: 'ama',
    name: 'Chef Ama Mensah',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.6037,
    lng: -0.187,
    specialties: 'Coastal Ghanaian · Charcoal grills · Sharing plates',
    cuisines: ['Ghanaian', 'Continental', "Chef's special"],
    pricing: 'From GH₵650',
    rating: 4.9,
    services: 38,
    image: chefPhotoUrl('ama'),
    alt: 'Chef Ama Mensah, private chef in Accra, Ghana',
    bio: 'Ama cooks coastal Ghanaian food at home: smoked fish, palm-nut, and charcoal grills served as relaxed sharing plates.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'chidinma',
    name: 'Chef Chidinma Eze',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.56,
    lng: -0.187,
    specialties: 'Owambe classics · Pepper soups · Big tables',
    cuisines: ['Ghanaian', 'West African', "Chef's special"],
    pricing: 'From GH₵560',
    rating: 4.9,
    services: 61,
    image: chefPhotoUrl('chidinma'),
    alt: 'Chef Chidinma Eze, private chef in Accra, Ghana',
    bio: 'Chidinma runs busy celebration kitchens in Accra: generous pots, deep pepper soups, and smoky party rice.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'kwame',
    name: 'Chef Kwame Ofori',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.6037,
    lng: -0.167,
    specialties: 'Fresh pasta · Seasonal produce · Plated courses',
    cuisines: ['Continental', 'Ghanaian', "Chef's special"],
    pricing: 'From GH₵900',
    rating: 4.8,
    services: 52,
    image: chefPhotoUrl('kwame'),
    alt: 'Chef Kwame Ofori, private chef in Accra, Ghana',
    bio: 'Kwame makes fresh pasta at your counter and finishes plates with Ghanaian produce for long, generous dinners.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'yaw',
    name: 'Chef Yaw Darko',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.5557,
    lng: -0.1825,
    specialties: 'Plant-forward · Meal prep · Local grains',
    cuisines: ['Vegetarian', 'Ghanaian', 'Healthy'],
    pricing: 'From GH₵480',
    rating: 4.7,
    services: 23,
    image: chefPhotoUrl('yaw'),
    alt: 'Chef Yaw Darko, private chef in Accra, Ghana',
    bio: 'Yaw cooks bright, plant-forward food built on local grains and vegetables, popular for weekly meal prep.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'sophie',
    name: 'Chef Sophie Laryea',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.6393,
    lng: -0.1624,
    specialties: 'Italian · Wine pairings · Long dinners',
    cuisines: ['Continental', 'Ghanaian', "Chef's special"],
    pricing: 'From GH₵1,200',
    rating: 4.8,
    services: 30,
    image: chefPhotoUrl('sophie'),
    alt: 'Chef Sophie Laryea, private chef in Accra, Ghana',
    bio: 'Sophie cooks generous Italian dinners with a Ghanaian accent: suya-spiced arancini, cocoa tagliatelle, mango panna cotta.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
]

export type MenuCourse = {
  title: string
  note: string
  dishes: string[]
}

export type SampleMenu = {
  id: string
  title: string
  chefId: string
  image: string
  blurb: string
  courses: MenuCourse[]
}

export const sampleMenus: SampleMenu[] = [
  {
    id: 'accra-table',
    title: 'Accra table',
    chefId: 'ama',
    image: images.cuisine,
    blurb: 'A generous Ghanaian dinner built around market produce and coastal fish.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: [
          'Keledos with roasted groundnut relish',
          'Garden greens, smoked fish, palm vinaigrette',
        ],
      },
      {
        title: 'Main',
        note: 'All inclusive',
        dishes: [
          'Grilled red snapper, light light soup, fried plantain, garden salad',
        ],
      },
      {
        title: 'Dessert',
        note: 'Choose 1',
        dishes: ['Cocoa mousse with candied ginger', 'Bofrot with vanilla cream'],
      },
    ],
  },
  {
    id: 'party-jollof',
    title: 'Party jollof night',
    chefId: 'chidinma',
    image: images.privateDinner,
    blurb: 'Generous pots, smoky rice, and the energy of a celebration at home.',
    courses: [
      {
        title: 'Starter',
        note: 'Sharing',
        dishes: ['Pepper soup shots', 'Fried plantain and shito'],
      },
      {
        title: 'Main',
        note: 'All inclusive',
        dishes: ['Party jollof, beef suya, garden salad'],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Puff-puff with honey'],
      },
    ],
  },
  {
    id: 'pasta-supper',
    title: 'Handmade pasta supper',
    chefId: 'kwame',
    image: images.mealPrep,
    blurb: 'Fresh pasta rolled at your counter, finished with Ghanaian produce.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: ['Burrata with roasted garden eggs', 'Seasonal salad, citrus dressing'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Hand-cut tagliatelle, beef ragù',
          'Grilled prawns, lemon butter, herbs',
        ],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Tiramisu'],
      },
    ],
  },
  {
    id: 'osteria-night',
    title: 'Osteria night',
    chefId: 'sophie',
    image: images.dateNight,
    blurb: 'A slower Italian menu for date nights and small celebrations.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: ['Suya-spiced arancini', 'Focaccia, olives, whipped butter'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Cocoa tagliatelle, wild mushrooms',
          'Slow-roast lamb shoulder, herbs',
        ],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Mango panna cotta'],
      },
    ],
  },
  {
    id: 'sunday-family',
    title: 'Sunday family table',
    chefId: 'ama',
    image: images.partiesCelebrations,
    blurb: 'A long table for birthdays, graduations, and the nights you want remembered.',
    courses: [
      {
        title: 'Starter',
        note: 'Sharing',
        dishes: ['Garden egg and smoked mackerel dip', 'Kelewele with groundnut'],
      },
      {
        title: 'Main',
        note: 'All inclusive',
        dishes: ['Jollof, grilled chicken, shito, fried plantain'],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Pineapple and mint', 'Bofrot with lime caramel'],
      },
    ],
  },
  {
    id: 'garden-plate',
    title: 'Garden plate',
    chefId: 'yaw',
    image:
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=80',
    blurb: 'Plant-forward West African cooking that still feels like a feast.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: ['Garden salad, roasted groundnut dressing', 'Kontomire tartlet'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Red red, ripe plantain, avocado',
          'Garden jollof, grilled mushrooms, tomato stew',
        ],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Cocoa and coconut pots'],
      },
    ],
  },
]

export const reviews = [
  {
    id: 'review-1',
    name: 'Nana K.',
    date: 'Aug 12, 2026',
    rating: 5,
    city: 'Accra',
    copy: 'Chef Ama cooked a birthday dinner that felt like a restaurant without any of the fuss. The snapper is still being talked about.',
  },
  {
    id: 'review-2',
    name: 'Dzifa A.',
    date: 'Aug 9, 2026',
    rating: 4.8,
    city: 'Accra',
    copy: 'Felt like a restaurant at home. Every course was explained and the pacing stayed relaxed.',
  },
  {
    id: 'review-3',
    name: 'Kojo B.',
    date: 'Aug 4, 2026',
    rating: 4.7,
    city: 'Accra',
    copy: 'Chidinma fed twenty of us without breaking a sweat. The asun disappeared in minutes.',
  },
  {
    id: 'review-4',
    name: 'Esi O.',
    date: 'Jul 28, 2026',
    rating: 5,
    city: 'Accra',
    copy: 'Yaw’s weekly prep kept our fridge full through Friday. Everything tasted fresh and thoughtful.',
  },
]

export const reviewStats = [
  { label: 'Chef', value: '4.8' },
  { label: 'Food quality', value: '4.9' },
  { label: 'Presentation', value: '4.8' },
  { label: 'Cleanliness', value: '4.9' },
] as const

export const requestStorageKey = 'girki-chef-request'
export const locationStorageKey = 'girki-user-location'

export type UserLocation = {
  lat: number
  lng: number
  city: string
  label: string
}

export type ChefRequest = {
  city: string
  lat?: number
  lng?: number
  occasion: string
  serviceType: string
  guests: string
  mealTime: string
  cuisine: string
  date: string
  budget: string
  restrictions: string
  notes: string
  name: string
  email: string
  phone: string
}

export const emptyRequest: ChefRequest = {
  city: '',
  occasion: '',
  serviceType: '',
  guests: '',
  mealTime: '',
  cuisine: '',
  date: '',
  budget: '',
  restrictions: '',
  notes: '',
  name: '',
  email: '',
  phone: '',
}

export const chefs = allChefs.filter((chef) => chef.location.endsWith(launchCountry))

export function getChef(id: string) {
  return chefs.find((chef) => chef.id === id)
}

export function menusForChef(chefId: string) {
  return sampleMenus.filter((menu) => menu.chefId === chefId)
}

export function distanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthKm = 6371
  const dLat = ((to.lat - from.lat) * Math.PI) / 180
  const dLng = ((to.lng - from.lng) * Math.PI) / 180
  const lat1 = (from.lat * Math.PI) / 180
  const lat2 = (to.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * earthKm * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function matchChefs(request: Partial<ChefRequest>, limit = 3) {
  const requestedCity = request.city?.split(',')[0]?.trim().toLowerCase() ?? ''
  const origin =
    request.lat != null && request.lng != null
      ? { lat: request.lat, lng: request.lng }
      : null

  const scored = chefs
    .filter((chef) => isChefBookable(chef.id))
    .map((chef) => {
      let score = 0
      const km = origin ? distanceKm(origin, chef) : undefined
      if (km != null) {
        if (km <= 40) score += 8
        else if (km <= 120) score += 5
        else if (km <= 400) score += 2
      }
      if (
        requestedCity &&
        (chef.city.toLowerCase() === requestedCity ||
          chef.location.toLowerCase().includes(requestedCity))
      ) {
        score += 4
      }
      if (
        request.cuisine &&
        chef.cuisines.some(
          (cuisine) => cuisine.toLowerCase() === request.cuisine?.toLowerCase(),
        )
      ) {
        score += 3
      }
      return { chef, score, km }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.km != null && b.km != null && a.km !== b.km) return a.km - b.km
      return b.chef.rating - a.chef.rating
    })

  return scored.slice(0, limit).map((item) => item.chef)
}
