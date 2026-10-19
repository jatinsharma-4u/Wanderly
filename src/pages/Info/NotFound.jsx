import { Lottie } from '../../components/common/Lottie'
import { ButtonLink } from '../../components/common/Button'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import compass from '../../assets/lottie/compass.json'

export default function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="container-x flex min-h-[65vh] flex-col items-center justify-center py-16 text-center">
      <Lottie data={compass} className="size-40" />
      <p className="mt-2 text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-dark">Error 404</p>
      <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)]">
        Looks like you’ve wandered <span className="serif-accent text-gold">off the map</span>
      </h1>
      <p className="mt-2 max-w-md text-[15px] text-muted">The page you’re looking for doesn’t exist or has moved. Let’s get you back on the trail.</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2.5">
        <ButtonLink to="/" arrow>Back to home</ButtonLink>
        <ButtonLink to="/destinations" variant="outline">Explore destinations</ButtonLink>
      </div>
    </section>
  )
}
