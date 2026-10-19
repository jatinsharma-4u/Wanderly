import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { Field } from './Field'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { sleep } from '../../utils/format'

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name'),
  email: z.string().trim().email('Enter a valid email'),
  phone: z.string().trim().regex(/^[+\d\s-]{8,16}$/, 'Enter a valid phone number'),
  message: z.string().trim().min(10, 'Tell us a little more (10+ characters)'),
})

export function EnquiryModal({ open, onClose, subject, type = 'Package query' }) {
  const { addEnquiry, user } = useApp()
  const toast = useToast()
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    values: { name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: subject ? `Hi! I’d like to know more about “${subject}”.` : '' },
  })

  const submit = async (data) => {
    await sleep(700)
    addEnquiry({ ...data, subject: subject || 'General enquiry', type })
    toast('Enquiry sent. An expert will call you within 4 hours.')
    reset()
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Send an enquiry" size="md">
      <form onSubmit={handleSubmit(submit)} className="grid gap-4 p-5" noValidate>
        <p className="-mt-1 text-[13.5px] text-muted">Questions about {subject ? <b className="text-ink">{subject}</b> : 'a trip'}? Our travel experts typically reply within minutes on WhatsApp.</p>
        <Field label="Full name" error={errors.name}>
          <input className="input" {...register('name')} aria-invalid={!!errors.name} autoComplete="name" />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email" error={errors.email}>
            <input className="input" type="email" {...register('email')} aria-invalid={!!errors.email} autoComplete="email" />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <input className="input" type="tel" {...register('phone')} aria-invalid={!!errors.phone} autoComplete="tel" placeholder="+91" />
          </Field>
        </div>
        <Field label="Message" error={errors.message}>
          <textarea rows={4} className="input h-auto py-3" {...register('message')} aria-invalid={!!errors.message} />
        </Field>
        <Button type="submit" loading={isSubmitting} className="w-full">
          {isSubmitting ? 'Sending…' : 'Send enquiry'}
        </Button>
      </form>
    </Modal>
  )
}
