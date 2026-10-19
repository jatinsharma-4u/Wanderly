import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../../components/common/Modal'
import { Button } from '../../components/common/Button'
import { Field } from '../../components/forms/Field'
import { packageCategories } from '../../data/packages'
import { destinations } from '../../data/destinations'
import { slugify } from '../../utils/format'

const schema = z.object({
  title: z.string().trim().min(4, 'Title is too short'),
  destination: z.string().min(1, 'Choose a destination'),
  category: z.string(),
  days: z.coerce.number().int().min(2, 'At least 2 days').max(30, 'Max 30 days'),
  price: z.coerce.number().min(1000, 'Enter a valid price'),
  originalPrice: z.coerce.number().optional(),
  groupSize: z.string().trim().min(1, 'Required'),
  slotsLeft: z.coerce.number().int().min(0).max(99),
  summary: z.string().trim().min(20, 'Write at least 20 characters'),
})

const empty = { title: '', destination: '', category: 'Adventure', days: 5, price: 25000, originalPrice: 29000, groupSize: '2–10', slotsLeft: 10, summary: '' }

export function PackageForm({ open, onClose, initial, onSave }) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: empty })

  useEffect(() => {
    if (open) reset(initial ? { ...empty, ...initial } : empty)
  }, [open, initial, reset])

  const submit = (data) => {
    const d = destinations.find((x) => x.slug === data.destination)
    const base = initial || {
      slug: `${slugify(data.title)}-${Math.floor(Math.random() * 900 + 100)}`,
      rating: 0,
      reviews: 0,
      image: d.image,
      gallery: d.gallery,
      hotel: 'Handpicked hotels',
      transport: 'Private cab',
      meals: 'Breakfast',
      highlights: d.attractions.map((a) => a.name),
      itinerary: Array.from({ length: data.days }, (_, i) => ({ day: i + 1, title: i === 0 ? `Arrive in ${d.name}` : i === data.days - 1 ? 'Departure' : `Explore ${d.name}`, desc: 'Details to be finalised by our trip designers.' })),
      inclusions: ['Hotel stays', 'Daily breakfast', 'Private transfers'],
      exclusions: ['Flights', 'Personal expenses'],
      international: d.country !== 'India',
      tag: 'New',
    }
    onSave({ ...base, ...data, originalPrice: data.originalPrice || undefined, rating: base.rating || 4.5 })
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? 'Edit package' : 'Add new package'}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="pkg-form" loading={isSubmitting}>{initial ? 'Save changes' : 'Create package'}</Button>
        </div>
      }
    >
      <form id="pkg-form" onSubmit={handleSubmit(submit)} noValidate className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Package title" error={errors.title} className="sm:col-span-2">
          <input className="input" {...register('title')} aria-invalid={!!errors.title} />
        </Field>
        <Field label="Destination" error={errors.destination}>
          <select className="input" {...register('destination')} aria-invalid={!!errors.destination}>
            <option value="">Select…</option>
            {destinations.map((d) => (
              <option key={d.slug} value={d.slug}>{d.name}</option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <select className="input" {...register('category')}>
            {packageCategories.filter((c) => c !== 'All').map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Price / person (₹)" error={errors.price}>
          <input className="input" type="number" {...register('price')} aria-invalid={!!errors.price} />
        </Field>
        <Field label="Original price (₹)" optional error={errors.originalPrice}>
          <input className="input" type="number" {...register('originalPrice')} />
        </Field>
        <Field label="Days" error={errors.days}>
          <input className="input" type="number" {...register('days')} aria-invalid={!!errors.days} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Group size" error={errors.groupSize}>
            <input className="input" {...register('groupSize')} />
          </Field>
          <Field label="Slots left" error={errors.slotsLeft}>
            <input className="input" type="number" {...register('slotsLeft')} />
          </Field>
        </div>
        <Field label="Summary" error={errors.summary} className="sm:col-span-2">
          <textarea rows={3} className="input h-auto py-3" {...register('summary')} aria-invalid={!!errors.summary} />
        </Field>
      </form>
    </Modal>
  )
}
