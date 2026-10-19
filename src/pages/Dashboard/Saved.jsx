import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition } from '../../components/common/Reveal'
import { SavedGrid } from '../../components/cards/SavedGrid'
import { useApp } from '../../context/AppContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

export default function Saved() {
  useDocumentTitle('Saved trips')
  const { wishlist } = useApp()
  return (
    <PageTransition>
      <PageHeader title="Saved" accent="trips" desc={`${wishlist.length} place${wishlist.length === 1 ? '' : 's'} you’re dreaming about. Saved items stay on this device.`} crumbs={[{ label: 'Saved' }]} />
      <section className="container-x mt-8">
        <SavedGrid />
      </section>
    </PageTransition>
  )
}
