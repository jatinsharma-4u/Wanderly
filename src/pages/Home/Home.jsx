import { PageTransition } from '../../components/common/Reveal'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { Hero } from './Hero'
import { Intro } from './Intro'
import { ExploreDestinations } from './ExploreDestinations'
import { FeaturedPackages } from './FeaturedPackages'
import { Experiences } from './Experiences'
import { SpecialOffers, WhyUs, Testimonials, Steps, HomeFaq, Journal, FinalCta } from './Trust'

export default function Home() {
  useDocumentTitle()
  return (
    <PageTransition>
      <Hero />
      <Intro />
      <ExploreDestinations />
      <FeaturedPackages />
      <Experiences />
      <SpecialOffers />
      <WhyUs />
      <Testimonials />
      <Steps />
      <Journal />
      <HomeFaq />
      <FinalCta />
    </PageTransition>
  )
}
