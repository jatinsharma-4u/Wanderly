import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { demoUser, seedBookings, seedEnquiries } from '../data/bookings'
import { packages as seedPackages } from '../data/packages'
import { generateBookingId } from '../utils/format'

const AppContext = createContext(null)
const KEY = 'wanderly:v1'

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

export function AppProvider({ children }) {
  const initial = useMemo(load, [])
  const [user, setUser] = useState(initial.user ?? null)
  const [wishlist, setWishlist] = useState(initial.wishlist ?? ['ladakh', 'udaipur', 'kerala-backwaters-munnar'])
  const [bookings, setBookings] = useState(initial.bookings ?? seedBookings)
  const [catalog, setCatalog] = useState(initial.catalog ?? seedPackages.map((p) => ({ ...p, active: true })))
  const [enquiries, setEnquiries] = useState(initial.enquiries ?? seedEnquiries)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ user, wishlist, bookings, catalog, enquiries }))
    } catch {
      /* storage unavailable, state stays in memory */
    }
  }, [user, wishlist, bookings, catalog, enquiries])

  const login = useCallback((data = {}) => {
    const next = data.email && data.email !== demoUser.email
      ? { ...demoUser, id: 'u-new', name: data.name || data.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), email: data.email, phone: data.phone || '', tier: 'Explorer', points: 500, memberSince: new Date().toISOString() }
      : demoUser
    setUser(next)
    return next
  }, [])

  const logout = useCallback(() => setUser(null), [])
  const updateProfile = useCallback((patch) => setUser((u) => ({ ...u, ...patch })), [])

  const toggleWish = useCallback((id) => {
    let added = false
    setWishlist((w) => {
      added = !w.includes(id)
      return added ? [...w, id] : w.filter((x) => x !== id)
    })
    return added
  }, [])

  const createBooking = useCallback(
    (data) => {
      const booking = {
        id: generateBookingId(),
        userId: user?.id ?? 'guest',
        status: 'confirmed',
        stage: 0,
        createdAt: new Date().toISOString().slice(0, 10),
        ...data,
      }
      setBookings((b) => [booking, ...b])
      return booking
    },
    [user],
  )

  const updateBooking = useCallback((id, patch) => setBookings((b) => b.map((x) => (x.id === id ? { ...x, ...patch } : x))), [])
  const cancelBooking = useCallback((id) => updateBooking(id, { status: 'cancelled' }), [updateBooking])

  const savePackage = useCallback((pkg) => {
    setCatalog((c) => (c.some((p) => p.slug === pkg.slug) ? c.map((p) => (p.slug === pkg.slug ? { ...p, ...pkg } : p)) : [{ ...pkg, active: true }, ...c]))
  }, [])
  const removePackage = useCallback((slug) => setCatalog((c) => c.filter((p) => p.slug !== slug)), [])

  const addEnquiry = useCallback((e) => {
    const enquiry = { id: `EN-${1043 + Math.floor(Math.random() * 900)}`, date: new Date().toISOString().slice(0, 10), status: 'new', ...e }
    setEnquiries((x) => [enquiry, ...x])
    return enquiry
  }, [])
  const updateEnquiry = useCallback((id, patch) => setEnquiries((x) => x.map((e) => (e.id === id ? { ...e, ...patch } : e))), [])

  const resetDemo = useCallback(() => {
    setBookings(seedBookings)
    setCatalog(seedPackages.map((p) => ({ ...p, active: true })))
    setEnquiries(seedEnquiries)
  }, [])

  const value = {
    user, login, logout, updateProfile,
    wishlist, toggleWish,
    bookings, createBooking, updateBooking, cancelBooking,
    catalog, savePackage, removePackage,
    enquiries, addEnquiry, updateEnquiry,
    resetDemo,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
