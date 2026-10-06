/** Design-matching demo content for the chef portal redesign. */

export type DemoBookingStatus = 'Tonight' | 'Confirmed' | 'Pending' | 'Completed'

export type DemoBookingRow = {
  id: string
  date: string
  guest: string
  menu: string
  guests: string
  place: string
  fee: string
  status: DemoBookingStatus
}

export const chefPortalDemo = {
  titles: {
    bookings: { title: 'Bookings', subtitle: 'Requests, confirmed tables and past dinners' },
    detail: { title: 'Booking', subtitle: 'Request GRK-2481 · Amara Okonkwo' },
    calendar: { title: 'Calendar', subtitle: "When you cook, and when you don't" },
    menus: { title: 'Menus', subtitle: 'What guests can book you for' },
    messages: { title: 'Messages', subtitle: 'Guests and Girki support' },
    earnings: { title: 'Earnings', subtitle: "Fees, payouts and what's still to clear" },
    reviews: { title: 'Reviews', subtitle: 'What guests said afterwards' },
    settings: { title: 'Settings', subtitle: 'Profile, booking rules and payouts' },
  },

  badges: {
    bookings: 3,
    messages: 2,
  },

  bookings: [
    {
      id: 'grk-2470',
      date: 'Thu 26 Aug',
      guest: 'Ijeoma Adisa',
      menu: 'Harmattan Tasting',
      guests: '6',
      place: 'Yaba',
      fee: '₦150,000',
      status: 'Tonight',
    },
    {
      id: 'grk-2474',
      date: 'Fri 28 Aug',
      guest: 'Chidi Nwosu',
      menu: 'Sunday Rice Table',
      guests: '10',
      place: 'Surulere',
      fee: '₦240,000',
      status: 'Confirmed',
    },
    {
      id: 'grk-2476',
      date: 'Sat 29 Aug',
      guest: 'Zainab Yusuf',
      menu: 'Coastal Grill',
      guests: '2',
      place: 'Ikeja GRA',
      fee: '₦68,000',
      status: 'Confirmed',
    },
    {
      id: 'grk-2481',
      date: 'Sat 30 Aug',
      guest: 'Amara Okonkwo',
      menu: 'Harmattan Tasting',
      guests: '8',
      place: 'Ikoyi',
      fee: '₦180,000',
      status: 'Pending',
    },
    {
      id: 'grk-2483',
      date: 'Sun 31 Aug',
      guest: 'Tunde Bello',
      menu: 'Sunday Rice Table',
      guests: '4',
      place: 'Lekki Phase 1',
      fee: '₦96,000',
      status: 'Pending',
    },
    {
      id: 'grk-2488',
      date: 'Fri 5 Sep',
      guest: 'Nadia Kamau',
      menu: 'Coastal Grill',
      guests: '12',
      place: 'Victoria Island',
      fee: '₦420,000',
      status: 'Pending',
    },
    {
      id: 'grk-2460',
      date: 'Sat 22 Aug',
      guest: 'Femi Eze',
      menu: 'Suya Board',
      guests: '8',
      place: 'Maryland',
      fee: '₦170,000',
      status: 'Completed',
    },
    {
      id: 'grk-2452',
      date: 'Fri 14 Aug',
      guest: 'Grace Mensah',
      menu: 'Harmattan Tasting',
      guests: '10',
      place: 'Ikoyi',
      fee: '₦260,000',
      status: 'Completed',
    },
  ] satisfies DemoBookingRow[],

  detail: {
    id: 'grk-2481',
    requestLabel: 'Request · GRK-2481',
    guest: 'Amara Okonkwo',
    summary: 'Saturday 30 August · 7:30 PM · 8 guests · Ikoyi, Lagos',
    facts: [
      { k: 'Date', v: 'Saturday 30 August 2026' },
      { k: 'Service', v: 'Arrive 5:00 PM · dinner 7:30 PM' },
      { k: 'Guests', v: '8 seated, one high chair' },
      { k: 'Address', v: '14 Bourdillon Road, Ikoyi' },
      { k: 'Kitchen', v: 'Gas, four burners, no oven' },
      { k: 'Occasion', v: '60th birthday' },
    ],
    notes: {
      from: 'Amara',
      text: "It's my mother's 60th. Eight of us, one pescatarian and one who can't take pepper at all. We'd love the goat to stay on the menu for everyone else. Kitchen is gas, four burners, no oven. Is that workable?",
      tags: ['1 pescatarian', 'No pepper', 'No oven', 'Serveware needed'],
    },
    menuName: 'Harmattan Tasting',
    courses: [
      { course: 'Welcome', dish: 'Chin chin, tamarind cooler', note: 'served on arrival' },
      { course: 'First', dish: 'Smoked catfish pepper soup', note: 'pescatarian as is' },
      { course: 'Second', dish: 'Yam pave, egusi butter', note: '' },
      { course: 'Main', dish: 'Goat shoulder, ata dín dín, jollof rice', note: 'grilled prawn swap × 1' },
      { course: 'Sweet', dish: 'Coconut milk pudding, roasted pineapple', note: '' },
    ],
    payoutLines: [
      { k: 'Menu, 8 × ₦22,500', v: '₦180,000' },
      { k: 'Ingredients (reimbursed)', v: '₦46,000' },
      { k: 'Travel', v: '₦8,000' },
      { k: 'Girki fee, 12%', v: '−₦27,600' },
    ],
    take: '₦180,000',
    takeNote: 'Released 24 hours after the dinner.',
    guestCard: {
      name: 'Amara Okonkwo',
      initials: 'AO',
      meta: '3 dinners booked · joined 2024',
      note: 'You cooked for Amara in March, rated 5 stars.',
    },
    dayCard: {
      text: 'Nothing else booked on 30 August. Travel from Yaba to Ikoyi is about 45 minutes at that hour.',
    },
  },

  calendar: {
    monthLabel: 'August 2026',
    /** Day-of-month → event chip (August 2026 starts Saturday → offset 5 empty cells for Mon-start grid). */
    startOffset: 5,
    daysInMonth: 31,
    events: {
      1: { label: 'Adisa · 6' },
      8: { label: 'Bello · 4' },
      14: { label: 'Nwosu · 10' },
      22: { label: 'Eze · 8' },
      26: { label: 'Adisa · 6', today: true },
      30: { label: 'Okonkwo · 8', pending: true },
    } as Record<number, { label: string; today?: boolean; pending?: boolean }>,
    availability: [
      { day: 'Mon', hours: 'Closed', state: 'Off' as const },
      { day: 'Tue', hours: '5:00 PM – 11:00 PM', state: 'Open' as const },
      { day: 'Wed', hours: '5:00 PM – 11:00 PM', state: 'Open' as const },
      { day: 'Thu', hours: '5:00 PM – 11:00 PM', state: 'Open' as const },
      { day: 'Fri', hours: '4:00 PM – midnight', state: 'Open' as const },
      { day: 'Sat', hours: '12:00 PM – midnight', state: 'Open' as const },
      { day: 'Sun', hours: '12:00 PM – 8:00 PM', state: 'Open' as const },
    ],
    blocked: [
      { when: '12 – 15 Sep', reason: 'Travel, Accra' },
      { when: '2 Oct', reason: 'Family' },
    ],
  },

  menus: {
    summary: '4 menus · 2 published to your profile',
    items: [
      {
        kicker: '5 courses · tasting',
        name: 'Harmattan Tasting',
        status: 'Published' as const,
        blurb:
          'A seated tasting built around dry-season produce: catfish pepper soup, yam pave, goat shoulder. Two hours at the table.',
        courses: '5',
        price: '₦22,500',
        booked: '11 times',
      },
      {
        kicker: 'Family style',
        name: 'Sunday Rice Table',
        status: 'Published' as const,
        blurb:
          'Jollof, ofada, plantain and three proteins set down at once. Built for a long lunch and a full table.',
        courses: '3',
        price: '₦18,000',
        booked: '9 times',
      },
      {
        kicker: 'Outdoor',
        name: 'Coastal Grill',
        status: 'Draft' as const,
        blurb:
          'Whole fish, prawns and corn over open fire, cooked in front of guests. Needs outdoor space.',
        courses: '4',
        price: '₦28,000',
        booked: '3 times',
      },
      {
        kicker: 'Standing',
        name: 'Suya Board',
        status: 'Draft' as const,
        blurb:
          'Skewers, kilishi and dips for parties that stay on their feet. Priced for twelve or more.',
        courses: '2',
        price: '₦12,500',
        booked: '4 times',
      },
    ],
  },

  messages: {
    threads: [
      {
        id: 'amara',
        name: 'Amara Okonkwo',
        time: '2h',
        preview: 'Is that workable without an oven?',
        active: true,
        bookingId: 'grk-2481' as string | undefined,
        bookingMeta: 'Request GRK-2481 · 30 Aug' as string | undefined,
      },
      {
        id: 'tunde',
        name: 'Tunde Bello',
        time: '5h',
        preview: 'Can you do Sunday at 1 instead?',
        active: false,
        bookingId: undefined as string | undefined,
        bookingMeta: undefined as string | undefined,
      },
      {
        id: 'nadia',
        name: 'Nadia Kamau',
        time: 'Mon',
        preview: 'Sent the address for the 5th.',
        active: false,
        bookingId: undefined as string | undefined,
        bookingMeta: undefined as string | undefined,
      },
      {
        id: 'support',
        name: 'Girki support',
        time: '18 Aug',
        preview: 'Your payout for 14 Aug has cleared.',
        active: false,
        bookingId: undefined as string | undefined,
        bookingMeta: undefined as string | undefined,
      },
    ],
    chat: [
      {
        from: 'guest' as const,
        text: "Hi Kemi, booked you for my mother's 60th. Eight of us, one pescatarian, and one who can't take pepper at all.",
        time: '4:12 PM',
      },
      {
        from: 'chef' as const,
        text: "Congratulations to her. Both easy. I'll swap a grilled prawn plate in for the pescatarian and hold the pepper on a separate pot.",
        time: '4:31 PM',
      },
      {
        from: 'guest' as const,
        text: 'One thing: the kitchen is gas, four burners, no oven. Is that workable?',
        time: '5:02 PM',
      },
      {
        from: 'chef' as const,
        text: "Yes, the whole menu runs on the hob. I'll confirm the table today.",
        time: '5:20 PM',
      },
    ],
  },

  earnings: {
    stats: [
      { k: 'August', v: '₦1.24M', note: '6 dinners · 48 covers' },
      { k: 'Clearing', v: '₦380,000', note: 'released Sep 1' },
      { k: 'Average per dinner', v: '₦206,000', note: 'up 12% on July' },
      { k: 'Year to date', v: '₦7.9M', note: '41 dinners' },
    ],
    chart: [
      { month: 'Mar', value: '₦0.82M', h: 59, current: false },
      { month: 'Apr', value: '₦0.64M', h: 46, current: false },
      { month: 'May', value: '₦1.08M', h: 77, current: false },
      { month: 'Jun', value: '₦0.95M', h: 68, current: false },
      { month: 'Jul', value: '₦1.31M', h: 94, current: false },
      { month: 'Aug', value: '₦1.24M', h: 89, current: true },
    ],
    payouts: [
      {
        date: '23 Aug',
        dinner: 'Femi Eze · Suya Board',
        gross: '₦193,200',
        fee: '₦23,200',
        net: '₦170,000',
        status: 'Paid',
      },
      {
        date: '15 Aug',
        dinner: 'Grace Mensah · Harmattan',
        gross: '₦295,500',
        fee: '₦35,500',
        net: '₦260,000',
        status: 'Paid',
      },
      {
        date: '9 Aug',
        dinner: 'Bola Ige · Rice Table',
        gross: '₦204,500',
        fee: '₦24,500',
        net: '₦180,000',
        status: 'Paid',
      },
      {
        date: '1 Sep',
        dinner: 'Ijeoma Adisa · Harmattan',
        gross: '₦170,500',
        fee: '₦20,500',
        net: '₦150,000',
        status: 'Clearing',
      },
      {
        date: '1 Sep',
        dinner: 'Chidi Nwosu · Rice Table',
        gross: '₦272,700',
        fee: '₦32,700',
        net: '₦240,000',
        status: 'Clearing',
      },
    ],
  },

  reviews: {
    average: '4.9',
    total: '38 reviews · all time',
    dist: [
      { star: '5', w: 92, n: '34' },
      { star: '4', w: 11, n: '4' },
      { star: '3', w: 0, n: '0' },
      { star: '2', w: 0, n: '0' },
      { star: '1', w: 0, n: '0' },
    ],
    items: [
      {
        name: 'Femi Eze',
        stars: 5,
        meta: 'Suya Board · 22 Aug',
        text: 'Kemi arrived early, worked around a crowded kitchen and never once made it feel rushed. The kilishi dip disappeared in ten minutes.',
      },
      {
        name: 'Grace Mensah',
        stars: 5,
        meta: 'Harmattan Tasting · 14 Aug',
        text: 'Five courses for ten people out of a domestic hob. Guests are still talking about the yam pave.',
      },
      {
        name: 'Bola Ige',
        stars: 4,
        meta: 'Sunday Rice Table · 9 Aug',
        text: 'Excellent food. We would have liked a little more warning about the smoke from the ofada. Worth opening a window early.',
      },
      {
        name: 'Amara Okonkwo',
        stars: 5,
        meta: 'Harmattan Tasting · 21 Mar',
        text: 'Second time booking Kemi and it will not be the last. She reads a room and paces the table properly.',
      },
    ],
  },

  settings: {
    name: 'Kemi Adeyemi',
    city: 'Lagos',
    radius: '25 km',
    bio: "West African cooking with a tasting-menu spine. Twelve years in restaurant kitchens, four cooking in people's homes.",
    cuisines: ['Nigerian', 'West African', 'Coastal grill'],
    rules: [
      { k: 'Minimum notice', v: '72 hours' },
      { k: 'Smallest table', v: '2 guests' },
      { k: 'Largest table', v: '14 guests' },
      { k: 'Cancellation', v: 'Free up to 48 hours' },
    ],
    payout: {
      bank: 'GTBank ···4417',
      note: 'Payouts land the day after each dinner clears.',
    },
  },
}

export function demoBookingStatusTone(status: DemoBookingStatus) {
  if (status === 'Tonight') return 'bg-portal-accent/18 text-portal-accent'
  if (status === 'Pending') return 'bg-white/6 text-portal-muted ring-1 ring-inset ring-white/14'
  if (status === 'Confirmed') return 'bg-white/8 text-portal-text'
  return 'bg-white/6 text-portal-muted'
}
