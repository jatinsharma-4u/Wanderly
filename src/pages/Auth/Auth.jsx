import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Sparkles, Star } from 'lucide-react'
import { Img, Avatar } from '../../components/common/Img'
import { Button } from '../../components/common/Button'
import { Field } from '../../components/forms/Field'
import { Modal } from '../../components/common/Modal'
import { Logo } from '../../components/navigation/Logo'
import { useApp } from '../../context/AppContext'
import { useToast } from '../../context/ToastContext'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { avatars } from '../../data/reviews'
import { sleep } from '../../utils/format'

const loginSchema = z.object({
  email: z.string().trim().email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})
const signupSchema = z
  .object({
    name: z.string().trim().min(2, 'Enter your full name'),
    email: z.string().trim().email('Enter a valid email address'),
    phone: z.string().trim().regex(/^[+\d\s-]{10,16}$/, 'Enter a valid mobile number'),
    password: z.string().min(8, 'Use at least 8 characters').regex(/\d/, 'Include at least one number'),
    confirm: z.string(),
    agree: z.literal(true, { message: 'Please accept the terms' }),
  })
  .refine((v) => v.password === v.confirm, { path: ['confirm'], message: 'Passwords don’t match' })

function PasswordInput({ registration, invalid, autoComplete, ...rest }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className="input pr-11" autoComplete={autoComplete} aria-invalid={invalid} {...registration} {...rest} />
      <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-sand" aria-label={show ? 'Hide password' : 'Show password'}>
        {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  )
}

const GoogleMark = () => (
  <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2-1.9 3.2-4.7 3.2-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.7c-1 .7-2.2 1-3.7 1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.8A11 11 0 0 0 12 23z" />
    <path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7.1H2.1a11 11 0 0 0 0 9.8z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7.1l3.7 2.8C6.7 7.3 9.1 5.4 12 5.4z" />
  </svg>
)

export default function Auth({ mode }) {
  const isLogin = mode === 'login'
  useDocumentTitle(isLogin ? 'Sign in' : 'Create account')
  const { login } = useApp()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const redirect = params.get('redirect') || '/dashboard'
  const [forgot, setForgot] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema),
    defaultValues: isLogin ? { email: '', password: '', remember: true } : { name: '', email: '', phone: '', password: '', confirm: '', agree: false },
  })

  const onSubmit = async (data) => {
    await sleep(900)
    const u = login(data)
    toast(isLogin ? `Welcome back, ${u.name.split(' ')[0]}!` : `Account created, welcome, ${u.name.split(' ')[0]}!`)
    navigate(redirect, { replace: true })
  }

  const demo = async () => {
    setDemoLoading(true)
    await sleep(600)
    const u = login()
    toast(`Signed in as ${u.name} (demo)`)
    navigate(redirect, { replace: true })
  }

  return (
    <div className="container-x py-6 md:py-10">
      <div className="grid overflow-hidden rounded-[16px] border border-line bg-white lg:grid-cols-2">
        <div className="relative hidden min-h-[640px] lg:block">
          <Img id={isLogin ? '1589901164570-f9de6556e1c1' : '1586359716568-3e1907e4cf9f'} alt="" className="absolute inset-0" sizes="50vw" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/20" />
          <div className="absolute left-8 top-8">
            <Logo light />
          </div>
          <div className="absolute inset-x-8 bottom-8 text-white">
            <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map((i) => <Star key={i} className="size-4 fill-[#d3ebf9] text-[#d3ebf9]" />)}</div>
            <p className="mt-3 max-w-md text-[22px] font-medium leading-snug">“Wanderly planned every detail of our honeymoon. We just had to show up and fall in love with Udaipur.”</p>
            <div className="mt-4 flex items-center gap-3">
              <Avatar id={avatars.rohan} size={40} />
              <div className="text-[13px]">
                <p className="font-semibold">Rohan & Ishita</p>
                <p className="text-white/70">Royal Udaipur Romance · 2026</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col justify-center px-5 py-8 sm:px-10 md:px-14 lg:py-12">
          <h1 className="text-[28px] md:text-[32px]">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-1.5 text-[14.5px] text-muted">{isLogin ? 'Sign in to manage trips, saved places and bookings.' : 'Join 48,000+ travellers. Get member-only fares and 500 welcome points.'}</p>

          <div className="mt-6 grid grid-cols-2 gap-2.5">
            <Button variant="outline" onClick={() => toast('Social sign-in is simulated in this demo', 'info')}>
              <GoogleMark /> Google
            </Button>
            <Button variant="outline" onClick={demo} loading={demoLoading}>
              <Sparkles className="size-4 text-gold" /> Demo account
            </Button>
          </div>
          <div className="my-6 flex items-center gap-3 text-[12px] text-faint">
            <span className="h-px flex-1 bg-line" /> or with email <span className="h-px flex-1 bg-line" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
            {!isLogin && (
              <Field label="Full name" error={errors.name}>
                <input className="input" autoComplete="name" {...register('name')} aria-invalid={!!errors.name} />
              </Field>
            )}
            <Field label="Email" error={errors.email}>
              <input className="input" type="email" autoComplete="email" placeholder="you@email.com" {...register('email')} aria-invalid={!!errors.email} />
            </Field>
            {!isLogin && (
              <Field label="Mobile number" error={errors.phone}>
                <input className="input" type="tel" autoComplete="tel" placeholder="+91" {...register('phone')} aria-invalid={!!errors.phone} />
              </Field>
            )}
            <Field label="Password" error={errors.password} hint={!isLogin ? 'At least 8 characters with a number' : undefined}>
              <PasswordInput registration={register('password')} invalid={!!errors.password} autoComplete={isLogin ? 'current-password' : 'new-password'} />
            </Field>
            {!isLogin && (
              <Field label="Confirm password" error={errors.confirm}>
                <PasswordInput registration={register('confirm')} invalid={!!errors.confirm} autoComplete="new-password" />
              </Field>
            )}
            {isLogin ? (
              <div className="flex items-center justify-between text-[13.5px]">
                <label className="flex cursor-pointer items-center gap-2">
                  <input type="checkbox" {...register('remember')} className="size-4 accent-[var(--color-ink)]" /> Remember me
                </label>
                <button type="button" onClick={() => setForgot(true)} className="font-semibold text-gold-dark hover:underline">
                  Forgot password?
                </button>
              </div>
            ) : (
              <div>
                <label className="flex cursor-pointer items-start gap-2 text-[13.5px] text-ink-2">
                  <input type="checkbox" {...register('agree')} className="mt-0.5 size-4 accent-[var(--color-ink)]" />
                  <span>
                    I agree to the <Link to="/terms" className="font-semibold underline">Terms</Link> and <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link>
                  </span>
                </label>
                {errors.agree && <p className="mt-1.5 text-[12.5px] font-medium text-danger" role="alert">{errors.agree.message}</p>}
              </div>
            )}
            <Button type="submit" size="lg" className="mt-1 w-full" loading={isSubmitting}>
              {isLogin ? 'Sign in' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-[14px] text-muted">
            {isLogin ? 'New to Wanderly? ' : 'Already have an account? '}
            <Link to={isLogin ? '/signup' : '/login'} className="font-semibold text-ink underline underline-offset-4">
              {isLogin ? 'Create an account' : 'Sign in'}
            </Link>
          </p>
          <p className="mt-3 text-center text-[12px] text-faint">Demo only, any email and password will work. No data leaves your browser.</p>
        </motion.div>
      </div>

      <Modal open={forgot} onClose={() => { setForgot(false); setResetSent(false) }} title="Reset your password" size="sm">
        <div className="p-5">
          {resetSent ? (
            <div className="text-center">
              <p className="font-semibold">Check your inbox</p>
              <p className="mt-1 text-[14px] text-muted">If an account exists for {resetEmail}, a reset link is on its way (simulated).</p>
              <Button className="mt-5 w-full" onClick={() => { setForgot(false); setResetSent(false) }}>Done</Button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (!/^\S+@\S+\.\S+$/.test(resetEmail)) return toast('Enter a valid email', 'error')
                setResetSent(true)
              }}
            >
              <p className="text-[14px] text-muted">Enter the email linked to your account and we’ll send you a reset link.</p>
              <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" className="input mt-4" placeholder="you@email.com" aria-label="Email" />
              <Button type="submit" className="mt-4 w-full">Send reset link</Button>
            </form>
          )}
        </div>
      </Modal>
    </div>
  )
}
