import { useEffect, useId, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { Popover, useOutsideClose } from './Popover'
import { cn } from '../../utils/format'

/**
 * Styled listbox replacing native <select>. Button + listbox roles, arrow/Home/End/Enter/Escape keys,
 * closes on outside click, and flips upward when there is no room below.
 * options: [{ value, label, group? }] or plain strings.
 */
export function Select({ value, onChange, options, label, className, buttonClassName, placeholder = 'Select', align = 'left', size = 'md', bare, id: idProp }) {
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: o }))
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const root = useRef(null)
  const btn = useRef(null)
  const list = useRef(null)
  const autoId = useId()
  const id = idProp || autoId
  const selected = opts.find((o) => String(o.value) === String(value))
  useOutsideClose(open, root, () => setOpen(false))

  useEffect(() => {
    if (!open) return
    const idx = Math.max(0, opts.findIndex((o) => String(o.value) === String(value)))
    setActive(idx)
    requestAnimationFrame(() => list.current?.querySelector(`[data-idx="${idx}"]`)?.scrollIntoView({ block: 'nearest' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const choose = (o) => {
    onChange(o.value)
    setOpen(false)
    btn.current?.focus()
  }

  const onKey = (e) => {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return
    const move = (n) => {
      e.preventDefault()
      setActive(n)
      list.current?.querySelector(`[data-idx="${n}"]`)?.scrollIntoView({ block: 'nearest' })
    }
    if (e.key === 'ArrowDown') move(Math.min(opts.length - 1, active + 1))
    else if (e.key === 'ArrowUp') move(Math.max(0, active - 1))
    else if (e.key === 'Home') move(0)
    else if (e.key === 'End') move(opts.length - 1)
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      choose(opts[active])
    } else if (e.key === 'Tab') setOpen(false)
  }

  let lastGroup
  return (
    <div ref={root} className={cn('relative min-w-0', className)}>
      <button
        ref={btn}
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKey}
        className={cn(
          'flex w-full items-center justify-between gap-2 text-left font-medium text-ink outline-none transition',
          !bare && 'rounded-[10px] border border-line bg-white px-3.5 hover:border-gold/50 focus-visible:border-gold focus-visible:ring-4 focus-visible:ring-gold/10',
          !bare && (size === 'sm' ? 'h-10 text-[13px]' : 'h-11 text-[13.5px]'),
          bare && 'text-[14px]',
          open && !bare && 'border-gold ring-4 ring-gold/10',
          buttonClassName,
        )}
      >
        <span className={cn('truncate', !selected && 'font-normal text-faint')}>{selected?.label ?? placeholder}</span>
        <ChevronDown className={cn('size-4 shrink-0 text-faint transition-transform duration-300', open && 'rotate-180 text-gold')} />
      </button>
      <Popover open={open} anchorRef={btn} align={align} role="presentation" popRef={list} className={cn('min-w-full p-1.5', bare && 'min-w-[220px]')}>
        <ul role="listbox" aria-labelledby={id}>
          {opts.map((o, i) => {
            const header = o.group && o.group !== lastGroup
            lastGroup = o.group
            const isSel = String(o.value) === String(value)
            return (
              <li key={`${o.group || ''}${o.value}`} role="presentation">
                {header && <p className="px-3 pb-1 pt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">{o.group}</p>}
                <div
                  role="option"
                  aria-selected={isSel}
                  data-idx={i}
                  onPointerEnter={() => setActive(i)}
                  onClick={() => choose(o)}
                  className={cn(
                    'flex cursor-pointer items-center justify-between gap-3 rounded-[8px] px-3 py-2 text-[13px] transition-colors',
                    i === active ? 'bg-gold-soft text-navy' : 'text-ink-2',
                    isSel && 'font-semibold text-navy',
                  )}
                >
                  <span className="truncate">{o.label}</span>
                  {isSel && <Check className="size-4 shrink-0 text-gold" />}
                </div>
              </li>
            )
          })}
        </ul>
      </Popover>
    </div>
  )
}
