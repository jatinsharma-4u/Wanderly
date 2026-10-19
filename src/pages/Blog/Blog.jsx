import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { BlogCard } from '../../components/cards/BlogCard'
import { EmptyState } from '../../components/common/EmptyState'
import { blogPosts } from '../../data/content'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'

const cats = ['All', ...new Set(blogPosts.map((p) => p.category))]

export default function Blog() {
  useDocumentTitle('Travel journal')
  const [cat, setCat] = useState('All')
  const [q, setQ] = useState('')
  const featured = blogPosts.find((p) => p.featured)
  const list = useMemo(() => {
    const s = q.trim().toLowerCase()
    return blogPosts.filter((p) => (cat === 'All' || p.category === cat) && (!s || `${p.title} ${p.excerpt}`.toLowerCase().includes(s)))
  }, [cat, q])
  const showFeatured = cat === 'All' && !q

  return (
    <PageTransition>
      <PageHeader title="The Wanderly" accent="journal" desc="Guides, itineraries and stories from the road, written by the people who plan your trips." crumbs={[{ label: 'Journal' }]} />

      {showFeatured && featured && (
        <section className="container-x mt-8">
          <Reveal>
            <BlogCard post={featured} large className="md:grid md:grid-cols-2 md:items-center md:gap-8 [&>div:last-child]:md:pt-0" />
          </Reveal>
        </section>
      )}

      <section className="container-x mt-12">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 sm:mx-0 sm:px-0">
            {cats.map((c) => (
              <button key={c} type="button" className="chip" data-active={cat === c} onClick={() => setCat(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="relative md:w-72">
            <Search className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles" className="input-line pl-7" aria-label="Search articles" />
          </div>
        </div>
        {list.length ? (
          <motion.div layout className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.filter((p) => !(showFeatured && p.featured)).map((p) => (
                <motion.div key={p.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <BlogCard post={p} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <EmptyState title="No articles found" desc="Try a different keyword or category." />
        )}
      </section>
    </PageTransition>
  )
}
