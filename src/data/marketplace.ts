import { images } from './home'

export const cities = [
  { slug: 'accra', name: 'Accra', country: 'Ghana' },
  { slug: 'lagos', name: 'Lagos', country: 'Nigeria' },
  { slug: 'casablanca', name: 'Casablanca', country: 'Morocco' },
  { slug: 'nairobi', name: 'Nairobi', country: 'Kenya' },
  { slug: 'cape-town', name: 'Cape Town', country: 'South Africa' },
  { slug: 'kigali', name: 'Kigali', country: 'Rwanda' },
  { slug: 'abidjan', name: 'Abidjan', country: 'Côte d’Ivoire' },
  { slug: 'dakar', name: 'Dakar', country: 'Senegal' },
  { slug: 'kampala', name: 'Kampala', country: 'Uganda' },
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
  'Nigerian',
  'Moroccan',
  'East African',
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

export const chefs: Chef[] = [
  {
    id: 'nana',
    name: 'Chef Nana K.',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.6037,
    lng: -0.187,
    specialties: 'Ghanaian · Continental · Fine dining',
    cuisines: ['Ghanaian', 'Continental', "Chef's special"],
    pricing: 'From GH₵450',
    rating: 4.9,
    services: 24,
    image: images.nana,
    alt: 'Chef Nana K., private chef in Accra, Ghana',
    bio: 'Nana builds tasting menus around Ghanaian produce, coastal seafood, and the kind of hospitality that makes a home feel like the best table in Accra.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'youssef',
    name: 'Chef Youssef B.',
    location: 'Casablanca, Morocco',
    city: 'Casablanca',
    lat: 33.5731,
    lng: -7.5898,
    specialties: 'Moroccan · North African · Grill',
    cuisines: ['Moroccan', 'Seafood', "Chef's special"],
    pricing: 'Pricing by experience',
    rating: 4.8,
    services: 18,
    image:
      'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Chef Youssef B., private chef in Casablanca, Morocco',
    bio: 'Youssef cooks with fire and spice from the Maghreb: tagines, charcoal grill, and plating that feels like a Casablanca restaurant brought home.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'amani',
    name: 'Chef Stephanie K.',
    location: 'Nairobi, Kenya',
    city: 'Nairobi',
    lat: -1.2921,
    lng: 36.8219,
    specialties: 'East African · Coastal · Family meals',
    cuisines: ['East African', 'Seafood', 'Vegetarian'],
    pricing: 'Pricing by experience',
    rating: 4.8,
    services: 21,
    image: images.amani,
    alt: 'Chef Stephanie K. in Nairobi, Kenya',
    bio: 'Stephanie cooks coastal and highland Kenyan food with a light, seasonal hand, ideal for families, friends, and unhurried Sunday lunches.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'zuri',
    name: 'Chef Zuri M.',
    location: 'Cape Town, South Africa',
    city: 'Cape Town',
    lat: -33.9249,
    lng: 18.4241,
    specialties: 'Cape Malay · Seafood · Wine-country dining',
    cuisines: ['Seafood', 'Continental', "Chef's special"],
    pricing: 'Pricing by experience',
    rating: 4.7,
    services: 16,
    image:
      'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Chef Zuri M., private chef in Cape Town, South Africa',
    bio: 'Zuri brings Cape Malay spice, Atlantic seafood, and wine-country pacing into private homes and villa kitchens.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'kofi',
    name: 'Chef Kofi B.',
    location: 'Accra, Ghana',
    city: 'Accra',
    lat: 5.56,
    lng: -0.2057,
    specialties: 'Plant-forward · Vegetarian · Celebration menus',
    cuisines: ['Vegetarian', 'Ghanaian', 'West African'],
    pricing: 'From GH₵380',
    rating: 4.6,
    services: 12,
    image:
      'https://images.unsplash.com/photo-1600565193348-f74bd3ec5f5c?auto=format&fit=crop&w=1200&q=80',
    alt: 'Chef Kofi B., private chef in Accra, Ghana',
    bio: 'Kofi designs plant-forward Ghanaian menus that still feel abundant, for date nights, birthdays, and thoughtful corporate lunches.',
    included: [
      'Menu design',
      'Grocery sourcing',
      'Cooking and table service',
      'Kitchen cleanup',
    ],
  },
  {
    id: 'ibrahim',
    name: 'Chef Ibrahim S.',
    location: 'Dakar, Senegal',
    city: 'Dakar',
    lat: 14.7167,
    lng: -17.4677,
    specialties: 'Senegalese · Thieboudienne · Coastal feasts',
    cuisines: ['West African', 'Seafood', "Chef's special"],
    pricing: 'Pricing by experience',
    rating: 4.9,
    services: 31,
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1200&q=80',
    alt: 'Chef Ibrahim S., private chef in Dakar, Senegal',
    bio: 'Ibrahim cooks the Atlantic with patience: thieboudienne, grilled fish, and celebration tables that linger long after dessert.',
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
    chefId: 'nana',
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
    id: 'casablanca-grill',
    title: 'Casablanca grill',
    chefId: 'youssef',
    image: images.privateDinner,
    blurb: 'Charcoal-led Moroccan cooking for nights that should feel like a restaurant at home.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: ['Zaalouk with warm khobz', 'Harira, lemon, dates'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Lamb tagine, prunes, toasted almonds, saffron couscous',
          'Chermoula grilled sea bream, preserved lemon, herb salad',
        ],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Orange blossom milk cake, pistachios'],
      },
    ],
  },
  {
    id: 'nairobi-coast',
    title: 'Nairobi coast',
    chefId: 'amani',
    image: images.mealPrep,
    blurb: 'Coastal Kenyan flavors with a calm, family-style rhythm.',
    courses: [
      {
        title: 'Starter',
        note: 'All inclusive',
        dishes: ['Coconut bean salad, mango, chili oil'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Swahili coconut fish, coconut rice, kachumbari',
          'Nyama choma platter, ugali, sukuma wiki',
        ],
      },
      {
        title: 'Dessert',
        note: 'Choose 1',
        dishes: ['Mandazi with cardamom cream', 'Passion fruit posset'],
      },
    ],
  },
  {
    id: 'cape-evening',
    title: 'Cape evening',
    chefId: 'zuri',
    image: images.dateNight,
    blurb: 'A slower Cape Town menu for date nights and small celebrations.',
    courses: [
      {
        title: 'Starter',
        note: 'Choose 1',
        dishes: ['Cape Malay samosa, apricot chutney', 'Cured yellowtail, citrus, fennel'],
      },
      {
        title: 'Main',
        note: 'Choose 1',
        dishes: [
          'Line fish, browned butter, new potatoes, seasonal greens',
          'Bobotie, yellow rice, cucumber salad',
        ],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Malva pudding, crème anglaise'],
      },
    ],
  },
  {
    id: 'celebration-feast',
    title: 'Celebration feast',
    chefId: 'ibrahim',
    image: images.partiesCelebrations,
    blurb: 'A long table for birthdays, graduations, and the nights you want remembered.',
    courses: [
      {
        title: 'Starter',
        note: 'Sharing',
        dishes: ['Yassa chicken bites', 'Pastels, lime, chili'],
      },
      {
        title: 'Main',
        note: 'All inclusive',
        dishes: ['Thieboudienne, grilled vegetables, extra fish for the table'],
      },
      {
        title: 'Dessert',
        note: 'All inclusive',
        dishes: ['Thiéré sweet couscous, mango, toasted coconut'],
      },
    ],
  },
  {
    id: 'garden-plate',
    title: 'Garden plate',
    chefId: 'kofi',
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
    id: 'ama',
    name: 'Ama Boateng',
    date: 'Aug 12, 2026',
    rating: 5,
    city: 'Accra',
    copy: 'Nana cooked a birthday dinner that felt like a restaurant without any of the fuss. The menu was personal, the pacing was perfect, and the kitchen was left better than she found it.',
  },
  {
    id: 'chidi',
    name: 'Amira Benali',
    date: 'Aug 9, 2026',
    rating: 4.8,
    city: 'Casablanca',
    copy: 'We booked Youssef for a date night at home. The lamb tagine was extraordinary, and he was easy to talk to while still giving us the evening to ourselves.',
  },
  {
    id: 'wambui',
    name: 'Wambui Kariuki',
    date: 'Aug 4, 2026',
    rating: 4.7,
    city: 'Nairobi',
    copy: 'Stephanie handled a family lunch with kids, dietary notes, and last-minute guests. Every plate landed, and cleanup was complete before dessert conversations ended.',
  },
  {
    id: 'leila',
    name: 'Leila Ndiaye',
    date: 'Jul 28, 2026',
    rating: 5,
    city: 'Dakar',
    copy: 'Ibrahim’s thieboudienne was the best we have had outside a family kitchen. Guests are still talking about the table, the stories, and the calm way he ran the night.',
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
      if (request.occasion === 'date-night' && chef.id === 'nana') score += 1
      return { chef, score, km }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.km != null && b.km != null && a.km !== b.km) return a.km - b.km
      return b.chef.rating - a.chef.rating
    })

  return scored.slice(0, limit).map((item) => item.chef)
}
