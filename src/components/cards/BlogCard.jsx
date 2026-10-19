import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { Img, Avatar } from '../common/Img'
import { Badge } from '../common/Bits'
import { formatDate, cn } from '../../utils/format'

export function BlogCard({ post, className, large }) {
  return (
    <Link to={`/blog/${post.slug}`} className={cn('group flex flex-col', className)}>
      <div className={cn('relative overflow-hidden rounded-[var(--radius-card)]', large ? 'aspect-[16/10]' : 'aspect-[4/3]')}>
        <Img id={post.cover} alt={post.title} className="absolute inset-0" imgClassName="group-hover:scale-[1.05]" sizes="(max-width: 768px) 100vw, 40vw" />
        <Badge tone="white" className="absolute left-3 top-3">{post.category}</Badge>
      </div>
      <div className="pt-4">
        <h3 className={cn('font-semibold leading-snug transition group-hover:text-gold-dark', large ? 'text-[22px] md:text-[26px]' : 'text-[17px]')}>{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-[14px] leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-3 flex items-center gap-2 text-[12.5px] text-muted">
          <Avatar id={post.author.avatar} name={post.author.name} size={24} className="ring-0" />
          <span className="font-medium text-ink-2">{post.author.name}</span>
          <span>·</span>
          <span>{formatDate(post.date, { day: 'numeric', month: 'short' })}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="size-3" /> {post.readTime} min</span>
        </div>
      </div>
    </Link>
  )
}
