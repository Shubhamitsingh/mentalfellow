import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Input, Textarea } from '@/components/ui/Input'
import { useCreator } from '@/contexts/CreatorContext'
import { canRequest, cashbackFor, CATEGORIES } from '@/features/creators/rules'
import { formatMoney } from '@/utils/format'

const heroShots = [
  { src: '/uploads/model19.png', alt: 'A woman in a red suit and black boots holding a chain-strap bag', fit: 'object-[center_32%]' },
  { src: '/uploads/model21.png', alt: 'A woman in a yellow top holding a blue chain-strap bag', fit: 'object-center' },
  { src: '/uploads/model20.png', alt: 'A woman in red and black sunglasses with a black chain bag', fit: 'object-[center_20%]' },
]

const beats = [
  {
    title: 'Buy',
    body: 'Any piece in the shop. There is no special creator product.',
    image: '/uploads/model5.png',
    alt: 'A woman in yellow holding a blue bag with a chain strap',
  },
  {
    title: 'Post',
    body: 'After it arrives, put it on Instagram and send us the link.',
    image: '/uploads/model1.png',
    alt: 'A woman in red holding a woven black shoulder bag',
  },
  {
    title: 'Cashback',
    body: 'An admin opens the post. If it passes, the amount is added to your wallet.',
    image: '/uploads/model9.png',
    alt: 'A woman in a yellow top and pink sunglasses against a red shutter',
  },
]

export function CreatorMarketPage() {
  const creator = useCreator()
  const approved = creator.profile?.status === 'approved'
  const rule = creator.settings.mode === 'fixed'
    ? formatMoney(creator.settings.fixedAmount)
    : creator.settings.mode === 'category'
      ? 'By category'
      : `${creator.settings.percent}%`
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-[#0e9b00]">Creator cashback</p>
          <h1 className="mt-3 max-w-4xl font-sans text-4xl font-medium uppercase leading-tight tracking-[0.12em] md:text-5xl md:tracking-[0.16em]">Buy it. Post it. Get it back.</h1>
          <div className="mt-6 flex gap-3 overflow-x-auto overscroll-x-contain md:mt-8 md:grid md:grid-cols-3 md:gap-4 md:overflow-visible">
            {heroShots.map((shot) => (
              <img
                key={shot.src}
                src={shot.src}
                alt={shot.alt}
                className={`h-[340px] w-[78%] shrink-0 object-cover md:h-[460px] md:w-full ${shot.fit}`}
              />
            ))}
          </div>
          <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-muted md:text-base">
            Shop like everyone else. After delivery, post the piece. An admin checks the reel, then cashback can be yours.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <ButtonLink to={approved ? '/creators/desk' : '/creators/join'} variant="green" className="rounded-lg">
              {approved ? 'My cashback' : 'Become a creator'}
            </ButtonLink>
            <ButtonLink to="/shop" variant="yellow" className="rounded-lg">
              Shop products
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <Container className="py-8 md:py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-4xl md:text-5xl">Three moves</h2>
            <p className="hidden text-sm text-muted sm:block">Current rule · {rule}</p>
          </div>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {beats.map((beat, index) => (
              <li key={beat.title} className="relative min-h-[420px] overflow-hidden rounded-2xl bg-ink md:min-h-[520px]">
                <img src={beat.image} alt={beat.alt} className="absolute inset-0 h-full w-full object-cover object-[center_18%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                <div className="relative flex h-full min-h-[420px] flex-col justify-end p-5 text-paper md:min-h-[520px] md:p-6">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#ffd500]">0{index + 1}</p>
                  <h3 className="mt-2 font-serif text-4xl">{beat.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-paper/85">{beat.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-sm text-muted sm:hidden">Current rule · {rule}</p>
        </Container>
      </section>

      <section className="bg-ink text-paper">
        <Container className="flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:py-12">
          <p className="max-w-xl font-serif text-3xl leading-tight md:text-4xl">Cashback is for the post, after an admin says yes.</p>
          <Link to="/creators/admin" className="text-[11px] uppercase tracking-[0.16em] text-paper/70 underline">
            Admin desk
          </Link>
        </Container>
      </section>
    </>
  )
}

export function CreatorJoinPage() {
  const creator = useCreator()
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', mobile: '', instagram: '', profileUrl: '', followers: '', niche: '', city: '', about: '', exampleUrl: '',
  })

  function set(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function submit(event) {
    event.preventDefault()
    const result = creator.apply(form)
    setError(result.eligible ? '' : result.reasons[0])
  }

  if (creator.profile) {
    return (
      <Container className="max-w-xl py-12">
        <h1 className="font-serif text-5xl">{creator.profile.name}</h1>
        <p className="mt-3 text-sm text-muted">@{creator.profile.instagram} · {creator.profile.followers.toLocaleString('en-IN')} followers · {creator.profile.city}</p>
        <p className="mt-4 text-sm">Status: {creator.profile.status}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{creator.profile.status === 'pending' ? 'An admin still has to approve this application.' : creator.profile.about}</p>
        {creator.profile.status === 'approved' ? <Link to="/creators/desk" className="mt-6 inline-block underline">Open cashback orders</Link> : null}
      </Container>
    )
  }

  return (
    <Container className="max-w-xl py-12">
      <h1 className="font-serif text-5xl">Become a creator</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">Submit your details. An admin approves or rejects the application. Follower count is shown to the admin. It does not approve you by itself.</p>
      <form className="mt-8 grid gap-4" onSubmit={submit}>
        <Input label="Name" name="name" value={form.name} onChange={(event) => set('name', event.target.value)} />
        <Input label="Email" name="email" type="email" value={form.email} onChange={(event) => set('email', event.target.value)} />
        <Input label="Mobile" name="mobile" value={form.mobile} onChange={(event) => set('mobile', event.target.value)} />
        <Input label="Instagram username" name="instagram" value={form.instagram} onChange={(event) => set('instagram', event.target.value)} />
        <Input label="Instagram profile URL" name="profileUrl" value={form.profileUrl} onChange={(event) => set('profileUrl', event.target.value)} />
        <Input label="Follower count" name="followers" inputMode="numeric" value={form.followers} onChange={(event) => set('followers', event.target.value)} />
        <Input label="Category" name="niche" value={form.niche} onChange={(event) => set('niche', event.target.value)} />
        <Input label="City" name="city" value={form.city} onChange={(event) => set('city', event.target.value)} />
        <Textarea label="About your content" name="about" value={form.about} onChange={(event) => set('about', event.target.value)} />
        <Input label="Earlier post link" name="exampleUrl" hint="Optional." value={form.exampleUrl} onChange={(event) => set('exampleUrl', event.target.value)} />
        {error ? <p className="text-sm text-sale">{error}</p> : null}
        <Button type="submit">Submit application</Button>
      </form>
    </Container>
  )
}

export function CreatorDeskPage() {
  const creator = useCreator()
  const [url, setUrl] = useState('')
  const [note, setNote] = useState('')
  if (!creator.profile) {
    return (
      <Container className="py-12">
        <h1 className="font-serif text-4xl">Creator cashback</h1>
        <Link to="/creators/join" className="mt-4 inline-block underline">Become a creator</Link>
      </Container>
    )
  }
  const mine = creator.orders.filter((order) => order.creatorId === creator.profile.id)
  const requests = creator.requests.filter((item) => item.creatorId === creator.profile.id)

  function send(orderId) {
    const result = creator.submitRequest(orderId, url)
    setNote(result.ok ? `${result.id} is waiting for review.` : result.message)
  }

  return (
    <Container className="py-10">
      <p className="text-[11px] uppercase tracking-[0.16em] text-leaf">{creator.profile.status}</p>
      <h1 className="mt-2 font-serif text-5xl">{creator.profile.name}</h1>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <Stat label="Orders" value={String(mine.length)} />
        <Stat label="Pending" value={formatMoney(creator.wallet.pending)} />
        <Stat label="Available" value={formatMoney(creator.wallet.available)} />
        <Stat label="Earned" value={formatMoney(creator.wallet.earned)} />
      </dl>
      <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted">Available balance is a record on this device. It is not a bank payout. Cashback is added only after an admin approves the Instagram post.</p>
      <h2 className="mt-10 font-serif text-3xl">My cashback orders</h2>
      <ul className="mt-4 grid gap-4">
        {mine.length === 0 ? <li className="text-sm text-muted">No orders yet. Shop as usual, then record the bag at checkout.</li> : null}
        {mine.map((order) => {
          const request = requests.find((item) => item.orderId === order.id && item.status !== 'rejected')
          const gate = canRequest(order, creator.requests)
          return (
            <li key={order.id} className="border border-line bg-white p-4">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{order.id}</p>
              <h3 className="mt-1 font-serif text-2xl">{order.items.map((item) => item.name).join(', ')}</h3>
              <p className="mt-2 text-sm">{formatMoney(order.amount)} · {order.paymentStatus} · {order.shippingStatus}</p>
              <p className="mt-1 text-xs text-muted">{order.note}</p>
              {request ? <p className="mt-3 text-sm">Cashback {formatMoney(request.amount)} · {request.status.replaceAll('_', ' ')}{request.reason ? ` · ${request.reason}` : ''}</p> : null}
              {request?.postUrl ? <a className="mt-1 block break-all text-xs underline" href={request.postUrl} target="_blank" rel="noreferrer">{request.postUrl}</a> : null}
              {gate.ok || request?.status === 'needs_correction' ? (
                <form className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={(event) => { event.preventDefault(); send(order.id) }}>
                  <Input label="Instagram post URL" name={`post-${order.id}`} value={url} onChange={(event) => setUrl(event.target.value)} />
                  <Button type="submit" className="md:self-end">Submit cashback request</Button>
                </form>
              ) : !request ? <p className="mt-3 text-xs text-muted">{gate.message}</p> : null}
            </li>
          )
        })}
      </ul>
      {note ? <p className="mt-4 text-sm text-muted">{note}</p> : null}
      <h2 className="mt-10 font-serif text-3xl">Notices</h2>
      <ul className="mt-3 grid gap-2 text-sm">
        {creator.notices.map((item) => <li key={item.id}><span className="font-medium">{item.title}.</span> {item.body}</li>)}
      </ul>
    </Container>
  )
}

export function AdminCashbackPage() {
  const creator = useCreator()
  const [reason, setReason] = useState('')
  const [active, setActive] = useState(creator.requests[0]?.id || '')
  const [message, setMessage] = useState('')
  const selected = creator.requests.find((item) => item.id === active) || creator.requests[0]
  const pendingApps = creator.profile?.status === 'pending' ? 1 : 0
  const pendingReviews = creator.requests.filter((item) => item.status === 'pending_review').length

  function decide(decision) {
    if (!selected) return
    const result = creator.reviewRequest(selected.id, decision, reason)
    setMessage(result.ok ? `${selected.id} updated.` : result.message)
    if (result.ok) setReason('')
  }

  return (
    <Container className="py-10">
      <p className="text-[11px] uppercase tracking-[0.16em] text-leaf">Admin</p>
      <h1 className="mt-2 font-serif text-5xl">Creator cashback</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted">Open the Instagram link yourself. This desk does not read Instagram and it does not pay a bank.</p>
      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
        <Stat label="Applications waiting" value={String(pendingApps)} />
        <Stat label="Reviews waiting" value={String(pendingReviews)} />
        <Stat label="Approved cashback" value={formatMoney(creator.wallet.available)} />
        <Stat label="Rejected" value={formatMoney(creator.wallet.rejected)} />
      </dl>

      <section className="mt-10 border border-line bg-white p-4">
        <h2 className="font-serif text-2xl">Application</h2>
        {creator.profile ? (
          <div className="mt-3 text-sm">
            <p className="font-medium">{creator.profile.name} · @{creator.profile.instagram} · {creator.profile.status}</p>
            <p className="mt-1 text-muted">{creator.profile.followers.toLocaleString('en-IN')} followers · {creator.profile.niche} · {creator.profile.city}</p>
            <a className="mt-1 block underline" href={creator.profile.profileUrl} target="_blank" rel="noreferrer">{creator.profile.profileUrl}</a>
            <p className="mt-2">{creator.profile.about}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={() => creator.setCreatorStatus('approved')} disabled={creator.profile.status === 'approved'}>Approve</Button>
              <Button variant="secondary" onClick={() => creator.setCreatorStatus('rejected')}>Reject application</Button>
              <Button variant="secondary" onClick={() => creator.setCreatorStatus('suspended')}>Suspend</Button>
            </div>
          </div>
        ) : <p className="mt-3 text-sm text-muted">No application on this device.</p>}
      </section>

      <section className="mt-8">
        <h2 className="font-serif text-2xl">Orders</h2>
        <ul className="mt-3 grid gap-3">
          {creator.orders.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 border border-line bg-white p-4 text-sm">
              <span>{order.id} · {order.items.map((item) => item.name).join(', ')} · {formatMoney(order.amount)} · {order.paymentStatus} · {order.shippingStatus}</span>
              <span className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => creator.setOrder(order.id, { paymentStatus: 'paid' })}>Mark paid</Button>
                <Button variant="secondary" onClick={() => creator.setOrder(order.id, { shippingStatus: 'delivered', deliveredAt: Date.now(), submitWithinDays: creator.settings.submitWithinDays })}>Mark delivered</Button>
                <Button variant="secondary" onClick={() => creator.setOrder(order.id, { shippingStatus: 'returned' })}>Return</Button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="font-serif text-2xl">Requests</h2>
          <ul className="mt-3 grid gap-2">
            {creator.requests.map((item) => (
              <li key={item.id}>
                <button type="button" onClick={() => setActive(item.id)} className={`w-full border px-4 py-3 text-left text-sm ${selected?.id === item.id ? 'border-ink bg-white' : 'border-line bg-white'}`}>
                  {item.creatorName} · {item.orderId} · {item.items.map((product) => product.name).join(', ')} · {formatMoney(item.amount)} · {item.status.replaceAll('_', ' ')}
                </button>
              </li>
            ))}
          </ul>
        </div>
        {selected ? (
          <aside className="border border-line bg-white p-4">
            <h2 className="font-serif text-2xl">Review</h2>
            <p className="mt-2 text-sm">{selected.creatorName} · @{selected.instagram}</p>
            <a className="mt-2 block break-all text-sm underline" href={selected.postUrl} target="_blank" rel="noreferrer">Open Instagram post</a>
            <p className="mt-3 text-sm">Order {selected.orderId} · {formatMoney(selected.orderAmount)}</p>
            <p className="mt-1 text-sm">Cashback {formatMoney(selected.amount)}</p>
            {selected.flagged ? <p className="mt-2 text-xs text-sale">{selected.flagReason}</p> : null}
            <Textarea label="Reason" name="reason" value={reason} onChange={(event) => setReason(event.target.value)} />
            <div className="mt-3 grid gap-2">
              <Button onClick={() => decide('approved')}>Approve cashback</Button>
              <Button variant="secondary" onClick={() => decide('needs_correction')}>Needs correction</Button>
              <Button variant="secondary" onClick={() => decide('rejected')}>Reject cashback</Button>
              <Button variant="secondary" onClick={() => creator.markPaid(selected.id)} disabled={selected.status !== 'approved' || selected.flagged}>Mark paid in the ledger</Button>
            </div>
            {message ? <p className="mt-2 text-xs text-muted">{message}</p> : null}
          </aside>
        ) : null}
      </section>

      <SettingsForm />
    </Container>
  )
}

function SettingsForm() {
  const creator = useCreator()
  const [settings, setSettings] = useState(creator.settings)

  function save(event) {
    event.preventDefault()
    creator.saveSettings({
      ...settings,
      percent: Number(settings.percent),
      fixedAmount: Number(settings.fixedAmount),
      maxPerOrder: Number(settings.maxPerOrder),
      minOrderValue: Number(settings.minOrderValue),
      submitWithinDays: Number(settings.submitWithinDays),
    })
  }

  return (
    <form className="mt-10 grid max-w-xl gap-4 border border-line bg-white p-4" onSubmit={save}>
      <h2 className="font-serif text-2xl">Cashback rule</h2>
      <label className="text-sm">
        Rule
        <select className="mt-2 h-12 w-full rounded-lg border border-line bg-white px-3" value={settings.mode} onChange={(event) => setSettings({ ...settings, mode: event.target.value })}>
          <option value="percent">Percent of the order</option>
          <option value="fixed">Fixed amount</option>
          <option value="category">Percent by category</option>
        </select>
      </label>
      <Input label="Percent" name="percent" value={settings.percent} onChange={(event) => setSettings({ ...settings, percent: event.target.value })} />
      <Input label="Fixed amount" name="fixedAmount" value={settings.fixedAmount} onChange={(event) => setSettings({ ...settings, fixedAmount: event.target.value })} />
      <Input label="Maximum per order" name="maxPerOrder" value={settings.maxPerOrder} onChange={(event) => setSettings({ ...settings, maxPerOrder: event.target.value })} />
      <Input label="Minimum order value" name="minOrderValue" value={settings.minOrderValue} onChange={(event) => setSettings({ ...settings, minOrderValue: event.target.value })} />
      <Input label="Days to submit after delivery" name="submitWithinDays" value={settings.submitWithinDays} onChange={(event) => setSettings({ ...settings, submitWithinDays: event.target.value })} />
      <Textarea label="What the post must do" name="contentRequirement" value={settings.contentRequirement} onChange={(event) => setSettings({ ...settings, contentRequirement: event.target.value })} />
      <fieldset>
        <legend className="text-[11px] uppercase tracking-[0.16em]">Eligible categories</legend>
        <p className="mt-1 text-xs text-muted">Leave all off to allow every category.</p>
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          {CATEGORIES.map((category) => (
            <label key={category} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.eligibleCategories.includes(category)}
                onChange={(event) => {
                  const eligibleCategories = event.target.checked
                    ? [...settings.eligibleCategories, category]
                    : settings.eligibleCategories.filter((item) => item !== category)
                  setSettings({ ...settings, eligibleCategories })
                }}
              />
              {category}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit">Save rule</Button>
    </form>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 text-lg">{value}</dd>
    </div>
  )
}
