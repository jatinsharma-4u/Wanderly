import { useState } from 'react'
import { img, srcSet, cn } from '../../utils/format'

// Responsive Unsplash image with a soft fade-in over a sand placeholder.
export function Img({ id, alt = '', className, imgClassName, sizes = '(max-width: 768px) 100vw, 50vw', priority, w = 1200, widths, style, position = 'center' }) {
  const [loaded, setLoaded] = useState(false)
  // Only add `relative` when the caller hasn't positioned the frame itself, otherwise it overrides `absolute inset-0`.
  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className || '')
  return (
    <div className={cn(!positioned && 'relative', 'overflow-hidden bg-sand-2', className)} style={style}>
      <img
        src={img(id, w)}
        srcSet={srcSet(id, widths)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: position }}
        className={cn('absolute inset-0 size-full object-cover transition-[opacity,transform] duration-[900ms] ease-[var(--ease-out-quint)]', loaded ? 'opacity-100' : 'opacity-0', imgClassName)}
      />
    </div>
  )
}

export function Avatar({ id, name, size = 40, className }) {
  return (
    <span className={cn('inline-block shrink-0 overflow-hidden rounded-full bg-sand-2 ring-2 ring-white', className)} style={{ width: size, height: size }}>
      {id ? (
        <img src={img(id, size * 2, size * 2)} alt={name || ''} loading="lazy" className="size-full object-cover" />
      ) : (
        <span className="grid size-full place-items-center bg-gold-soft text-[13px] font-semibold text-gold-dark">{name?.[0]}</span>
      )}
    </span>
  )
}
