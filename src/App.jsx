import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import MainLayout, { ScrollManager } from './layouts/MainLayout'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { PageLoader } from './components/common/PageLoader'

const Home = lazy(() => import('./pages/Home/Home'))
const Destinations = lazy(() => import('./pages/Destinations/Destinations'))
const DestinationDetail = lazy(() => import('./pages/Destinations/DestinationDetail'))
const Packages = lazy(() => import('./pages/Packages/Packages'))
const PackageDetail = lazy(() => import('./pages/Packages/PackageDetail'))
const Planner = lazy(() => import('./pages/Booking/Planner'))
const Booking = lazy(() => import('./pages/Booking/Booking'))
const Confirmation = lazy(() => import('./pages/Booking/Confirmation'))
const TrackBooking = lazy(() => import('./pages/Booking/TrackBooking'))
const Auth = lazy(() => import('./pages/Auth/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Saved = lazy(() => import('./pages/Dashboard/Saved'))
const Offers = lazy(() => import('./pages/Info/Offers'))
const About = lazy(() => import('./pages/Info/About'))
const Contact = lazy(() => import('./pages/Info/Contact'))
const FAQ = lazy(() => import('./pages/Info/FAQ'))
const NotFound = lazy(() => import('./pages/Info/NotFound'))
const Blog = lazy(() => import('./pages/Blog/Blog'))
const BlogPost = lazy(() => import('./pages/Blog/BlogPost'))
const Legal = lazy(() => import('./pages/Legal/Legal'))
const Admin = lazy(() => import('./pages/Admin/Admin'))

export default function App() {
  useSmoothScroll()
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="destinations" element={<Destinations />} />
            <Route path="destinations/:slug" element={<DestinationDetail />} />
            <Route path="packages" element={<Packages />} />
            <Route path="packages/:slug" element={<PackageDetail />} />
            <Route path="planner" element={<Planner />} />
            <Route path="booking/:slug" element={<Booking />} />
            <Route path="booking/confirmation/:id" element={<Confirmation />} />
            <Route path="track" element={<TrackBooking />} />
            <Route path="login" element={<Auth key="login" mode="login" />} />
            <Route path="signup" element={<Auth key="signup" mode="signup" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="saved" element={<Saved />} />
            <Route path="offers" element={<Offers />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="privacy" element={<Legal doc="privacy" />} />
            <Route path="terms" element={<Legal doc="terms" />} />
            <Route path="cancellation-policy" element={<Legal doc="cancellation" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </>
  )
}
