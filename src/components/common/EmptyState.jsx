import { Lottie } from './Lottie'
import compass from '../../assets/lottie/compass.json'
import { cn } from '../../utils/format'

export function EmptyState({ title, desc, action, className, animation = compass }) {
  return (
    <div className={cn('card flex flex-col items-center px-6 py-12 text-center', className)}>
      <Lottie data={animation} className="size-28" />
      <h3 className="mt-2 text-lg font-semibold">{title}</h3>
      {desc && <p className="mt-1.5 max-w-sm text-[14px] text-muted">{desc}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
