import { useMemo, useState } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { Accordion } from '../../components/common/Accordion'
import { EmptyState } from '../../components/common/EmptyState'
import { ButtonLink } from '../../components/common/Button'
import { faqs } from '../../data/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const cats = ['All', ...new Set(faqs.map((f) => f.cat))]

export default function FAQ() {
  useDocumentTitle('FAQs')
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('All')
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return faqs.filter((f) => (cat === 'All' || f.cat === cat) && (!s || `${f.q} ${f.a}`.toLowerCase().includes(s)))
  }, [q, cat])

  return (
    <PageTransition>
      <PageHeader title="Frequently asked" accent="questions" desc="Everything about booking, payments, cancellations and life on the road with Wanderly." crumbs={[{ label: 'FAQs' }]} />
      <section className="container-x mt-8 grid gap-8 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-8">
          <div className="relative">
            <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions, e.g. refund, visa, EMI" className="input-line pl-7" aria-label="Search FAQs" />
          </div>
          <div className="no-scrollbar -mx-3 mt-4 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            {cats.map((c) => (
              <button key={c} type="button" className="chip" data-active={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="mt-6">
            {list.length ? (
              <Accordion key={`${cat}-${q}`} items={list} defaultOpen={q ? 0 : -1} />
            ) : (
              <EmptyState title="No answers found" desc={`Nothing matched “${q}”. Our team can answer directly.`} action={<ButtonLink to="/contact">Ask a question</ButtonLink>} />
            )}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <Reveal className="sticky top-24 rounded-[16px] bg-navy p-6 text-white">
            <MessageCircle className="size-8 text-[#d3ebf9]" />
            <h2 className="mt-4 text-[20px] !text-white">Still have questions?</h2>
            <p className="mt-1.5 text-[14px] text-white/70">Chat with a travel expert, average response time is under 5 minutes.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <ButtonLink to="/contact" variant="white">Contact us</ButtonLink>
              <ButtonLink to="/track" variant="glass">Track booking</ButtonLink>
            </div>
          </Reveal>
        </aside>
      </section>
    </PageTransition>
  )
}
