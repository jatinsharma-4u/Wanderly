import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useScroll, useSpring } from 'framer-motion'
import { ChevronLeft, Clock, Share2, Bookmark } from 'lucide-react'
import { PageTransition, Reveal } from '../../components/common/Reveal'
import { Img, Avatar } from '../../components/common/Img'
import { BlogCard } from '../../components/cards/BlogCard'
import { PackageCard } from '../../components/cards/PackageCard'
import { blogPosts, blogBody } from '../../data/content'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { formatDate } from '../../utils/format'
import NotFound from '../Info/NotFound'

const related = { 'first-timers-guide-to-ladakh': 'ladakh-roof-of-the-world', 'kerala-houseboat-etiquette': 'kerala-backwaters-munnar', 'udaipur-in-48-hours': 'royal-udaipur-romance', 'meghalaya-root-bridges': 'meghalaya-living-roots', 'best-beaches-andaman': 'andaman-island-hopper', 'what-to-eat-amritsar': 'golden-triangle-classic' }

export default function BlogPost() {
  const { slug } = useParams()
  const post = blogPosts.find((p) => p.slug === slug)
  useDocumentTitle(post?.title)
  const { catalog } = useApp()
  const toast = useToast()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [saved, setSaved] = useState(false)
  useEffect(() => setSaved(false), [slug])

  if (!post) return <NotFound />
  const body = blogBody(post)
  const pkg = catalog.find((p) => p.slug === related[post.slug])
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3)

  return (
    <PageTransition>
      <motion.div className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gold" style={{ scaleX: progress }} />
      <article>
        <header className="container-x max-w-3xl pt-6 md:pt-10">
          <Link to="/blog" className="inline-flex items-center gap-1 text-[13px] font-medium text-muted hover:text-ink">
            <ChevronLeft className="size-4" /> All stories
          </Link>
          <p className="mt-5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-gold-dark">{post.category}</p>
          <h1 className="mt-2 text-[clamp(1.8rem,4.2vw,3rem)] leading-[1.08] tracking-[-0.035em]">{post.title}</h1>
          <p className="mt-3 text-[16.5px] leading-relaxed text-muted">{post.excerpt}</p>
          <div className="mt-6 flex items-center justify-between gap-3 border-y border-line py-4">
            <div className="flex items-center gap-3">
              <Avatar id={post.author.avatar} name={post.author.name} size={40} className="ring-0" />
              <div className="text-[13px]">
                <p className="font-semibold">{post.author.name}</p>
                <p className="flex items-center gap-1.5 text-muted">{formatDate(post.date)} · <Clock className="size-3" /> {post.readTime} min read</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(window.location.href)
                  } catch {
                    /* ignore */
                  }
                  toast('Link copied')
                }}
                className="grid size-10 place-items-center rounded-full border border-line hover:border-ink/30"
                aria-label="Share article"
              >
                <Share2 className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSaved((s) => !s)
                  toast(saved ? 'Removed from reading list' : 'Saved to reading list', saved ? 'info' : 'success')
                }}
                className="grid size-10 place-items-center rounded-full border border-line hover:border-ink/30"
                aria-label="Save article"
                aria-pressed={saved}
              >
                <Bookmark className={saved ? 'size-4 fill-ink' : 'size-4'} />
              </button>
            </div>
          </div>
        </header>
        <Reveal className="container-x mt-8 max-w-5xl">
          <Img id={post.cover} alt={post.title} className="aspect-[16/9] rounded-[16px]" sizes="(max-width: 1024px) 100vw, 1000px" priority />
        </Reveal>
        <div className="prose-article container-x mt-10 max-w-3xl">
          {body.map((b, i) =>
            b.type === 'h2' ? <h2 key={i}>{b.text}</h2> : b.type === 'quote' ? <blockquote key={i}>{b.text}</blockquote> : <p key={i}>{b.text}</p>,
          )}
        </div>
      </article>

      {pkg && (
        <section className="container-x mt-12 max-w-3xl">
          <div className="rounded-[16px] bg-sand p-4 sm:p-6">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.12em] text-gold-dark">Inspired? Take the trip</p>
            <div className="max-w-sm">
              <PackageCard p={pkg} compact />
            </div>
          </div>
        </section>
      )}

      <section className="container-x pt-20">
        <h2 className="mb-6 text-[22px]">More stories</h2>
        <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {more.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </PageTransition>
  )
}
