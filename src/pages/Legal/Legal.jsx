import { NavLink } from 'react-router-dom'
import { PageHeader } from '../../components/common/PageHeader'
import { PageTransition } from '../../components/common/Reveal'
import { useDocumentTitle } from '../../hooks/useDocumentTitle'
import { cn } from '../../utils/format'

const docs = {
  privacy: {
    title: 'Privacy policy',
    updated: '1 October 2026',
    intro: 'Your privacy matters to us. This policy explains what information Wanderly Journeys Pvt. Ltd. (“Wanderly”, “we”) collects, how we use it, and the choices you have.',
    sections: [
      ['Information we collect', ['Contact details you provide, such as name, email, phone number and city.', 'Traveller details needed to make reservations, such as names, ages and ID information.', 'Booking history, preferences and communications with our team.', 'Device and usage data, such as browser type, pages visited and approximate location.']],
      ['How we use your information', ['To create and manage your bookings with hotels, transport providers and guides.', 'To send confirmations, trip updates and support messages.', 'To personalise recommendations and, with your consent, send offers.', 'To improve our website, prevent fraud and meet legal obligations.']],
      ['Sharing your information', ['We share only what is necessary with service partners who deliver your trip (hotels, airlines, transport, local guides).', 'We never sell your personal data.', 'We may disclose information where required by law or to protect our rights.']],
      ['Data retention & security', ['We retain booking records for as long as required by tax and travel regulations.', 'Data is encrypted in transit and access is restricted to authorised staff.']],
      ['Your rights', ['Access, correct or delete your personal information.', 'Withdraw marketing consent at any time from your dashboard or by emailing privacy@wanderly.in.', 'Lodge a complaint with the relevant data protection authority under the Digital Personal Data Protection Act, 2023.']],
      ['Cookies', ['We use essential cookies to keep you signed in and remember preferences, and optional analytics cookies that you can decline.']],
    ],
  },
  terms: {
    title: 'Terms & conditions',
    updated: '1 October 2026',
    intro: 'These terms govern your use of the Wanderly website and any bookings made through it. By making a booking, you agree to these terms.',
    sections: [
      ['Bookings & confirmation', ['A booking is confirmed once the advance payment is received and a booking reference is issued.', 'Prices are per person on twin-sharing basis unless stated otherwise and include applicable GST.', 'Itineraries may be adjusted for weather, road conditions or safety without prior notice; we will offer comparable alternatives.']],
      ['Payments', ['A 25% advance is required for domestic trips and 40% for international trips.', 'The balance is due 21 days before departure. Bookings made within 21 days require full payment.', 'Failure to pay the balance on time may result in cancellation as per our cancellation policy.']],
      ['Traveller responsibilities', ['Carry valid government-issued photo ID for all travellers, and passports/visas for international trips.', 'Inform us of medical conditions that may affect participation, especially for high-altitude trips.', 'Respect local customs, laws and the environment at all times.']],
      ['Liability', ['Wanderly acts as an agent for hotels, transport and activity providers and is not liable for their acts or omissions beyond our reasonable control.', 'We are not responsible for losses due to force majeure events including natural disasters, strikes or government restrictions.']],
      ['Governing law', ['These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.']],
    ],
  },
  cancellation: {
    title: 'Cancellation & refund policy',
    updated: '1 October 2026',
    intro: 'We know plans change. Here is exactly what happens if you need to cancel or modify your trip.',
    table: [
      ['30+ days before departure', 'Full refund (minus non-refundable components)'],
      ['15–29 days before departure', '75% refund of the trip cost'],
      ['7–14 days before departure', '50% refund of the trip cost'],
      ['Less than 7 days / no-show', 'No refund'],
    ],
    sections: [
      ['Date changes', ['Free date changes up to 30 days before departure, subject to availability.', 'Changes within 30 days may incur a fee equal to any supplier charges.']],
      ['Non-refundable components', ['Flight and train tickets, permits, certain festival-period hotels and visa fees are non-refundable once issued.']],
      ['Refund timelines', ['Refunds are initiated within 3 working days of cancellation.', 'Funds typically reach your original payment method within 5–7 working days.']],
      ['Cancellations by Wanderly', ['If we cancel a departure for reasons within our control, you receive a full refund or a free date change, your choice.', 'If cancelled due to force majeure, we offer a credit note valid for 12 months.']],
    ],
  },
}

const nav = [
  ['/privacy', 'Privacy policy'],
  ['/terms', 'Terms & conditions'],
  ['/cancellation-policy', 'Cancellation & refunds'],
]

export default function Legal({ doc }) {
  const d = docs[doc]
  useDocumentTitle(d.title)
  return (
    <PageTransition>
      <PageHeader title={d.title} desc={`Last updated ${d.updated}`} crumbs={[{ label: 'Legal' }, { label: d.title }]} />
      <section className="container-x mt-8 grid gap-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="no-scrollbar -mx-3 sm:-mx-4 flex gap-2 overflow-x-auto px-3 sm:px-4 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:px-0" aria-label="Legal pages">
            {nav.map(([to, label]) => (
              <NavLink key={to} to={to} className={({ isActive }) => cn('shrink-0 rounded-xl px-3.5 py-2.5 text-[14px] font-medium transition', isActive ? 'bg-ink text-white' : 'bg-white text-ink-2 ring-1 ring-line hover:ring-ink/30')}>
                {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="prose-legal card p-5 md:p-9 lg:col-span-9">
          <p className="!text-[16px]">{d.intro}</p>
          {d.table && (
            <div className="mt-6 overflow-hidden rounded-xl border border-line">
              <table className="w-full text-left text-[14px]">
                <thead className="bg-paper text-[12.5px] uppercase tracking-wider text-muted">
                  <tr><th className="px-4 py-3 font-semibold">When you cancel</th><th className="px-4 py-3 font-semibold">Refund</th></tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {d.table.map(([a, b]) => (
                    <tr key={a}><td className="px-4 py-3 font-medium">{a}</td><td className="px-4 py-3 text-ink-2">{b}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {d.sections.map(([h, items], i) => (
            <div key={h}>
              <h2>{i + 1}. {h}</h2>
              <ul>
                {items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ))}
          <h2>Contact</h2>
          <p>Questions about this policy? Email <a href="mailto:legal@wanderly.in" className="font-semibold text-ink underline">legal@wanderly.in</a> or write to Wanderly Journeys Pvt. Ltd., Indiranagar, Bengaluru 560038.</p>
        </div>
      </section>
    </PageTransition>
  )
}
