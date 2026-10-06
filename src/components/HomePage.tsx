import HomeHowItWorks from './HomeHowItWorks'
import HomeFeaturedChefs from './HomeFeaturedChefs'
import HomeCuisine from './HomeCuisine'
import HomeGuestNotes from './HomeGuestNotes'
import HomeMenus from './HomeMenus'
import HomeOccasions from './HomeOccasions'
import HomeDestinations from './HomeDestinations'
import HomeTrust from './HomeTrust'
import HomeBecomeChef from './HomeBecomeChef'
import SiteFooter from './layout/SiteFooter'
import SiteHeader from './layout/SiteHeader'
import HomeAppOrder from './HomeAppOrder'
import HomeChooseMode from './HomeChooseMode'
import HomeHero from './HomeHero'

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-ploy-background-primary text-ploy-text-primary">
      <SiteHeader />

      <main>
        <HomeHero />

        <HomeChooseMode />

        <HomeAppOrder />

        <HomeHowItWorks />

        <HomeOccasions />

        <HomeFeaturedChefs />

        <HomeCuisine />

        <HomeGuestNotes />

        <HomeMenus />

        <HomeDestinations />

        <HomeTrust />

        <HomeBecomeChef />
      </main>

      <SiteFooter />
    </div>
  )
}
