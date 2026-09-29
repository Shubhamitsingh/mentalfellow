import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { previewProducts } from '@/content/previewCatalog'
import {
  canRequest,
  cashbackFor,
  defaultSettings,
  isInstagramPost,
  nextId,
  screenCreator,
  walletFrom,
} from '@/features/creators/rules'
import { readJson, writeJson } from '@/utils/storage'

const KEY = 'mf_creator_cashback'
const CreatorContext = createContext(null)

const empty = { profile: null, orders: [], requests: [], notices: [], settings: defaultSettings }

function load() {
  const saved = readJson(KEY, empty)
  return {
    ...empty,
    ...saved,
    settings: { ...defaultSettings, ...saved.settings, categoryPercents: { ...defaultSettings.categoryPercents, ...saved.settings?.categoryPercents } },
  }
}

export function CreatorProvider({ children }) {
  const [state, setState] = useState(load)
  const snapshot = useRef(state)
  snapshot.current = state

  useEffect(() => {
    writeJson(KEY, state)
  }, [state])

  const api = useMemo(() => {
    const notice = (title, body) => ({ id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, title, body, at: Date.now() })
    const save = (next) => {
      snapshot.current = next
      setState(next)
    }

    function apply(input) {
      const screen = screenCreator(input)
      if (!screen.eligible) return screen
      const current = snapshot.current
      const profile = {
        id: `cr-${Date.now().toString(36)}`,
        name: input.name.trim(),
        email: input.email.trim(),
        mobile: input.mobile.replace(/\s/g, ''),
        instagram: input.instagram.replace('@', '').trim(),
        profileUrl: input.profileUrl.trim(),
        followers: Number(input.followers),
        niche: input.niche.trim(),
        city: input.city.trim(),
        about: input.about.trim(),
        exampleUrl: String(input.exampleUrl || '').trim(),
        status: 'pending',
        createdAt: Date.now(),
      }
      save({
        ...current,
        profile,
        notices: [notice('Application received', 'An admin still has to approve this account.'), ...current.notices].slice(0, 30),
      })
      return screen
    }

    function setCreatorStatus(status) {
      const current = snapshot.current
      if (!current.profile) return
      const label = status === 'approved' ? 'Application approved' : status === 'rejected' ? 'Application rejected' : 'Account suspended'
      save({
        ...current,
        profile: { ...current.profile, status },
        notices: [notice(label, `Creator status is now ${status}.`), ...current.notices].slice(0, 30),
      })
    }

    function recordBag(lines) {
      const current = snapshot.current
      if (current.profile?.status !== 'approved') return { ok: false, message: 'An admin has to approve the creator before an order can count.' }
      const items = lines.filter((line) => line.qty > 0 && !line.unavailable).map((line) => ({
        slug: line.slug,
        name: line.name,
        price: line.price,
        qty: line.qty,
        image: line.image,
        department: previewProducts.find((product) => product.slug === line.slug)?.department || 'bags',
      }))
      if (!items.length) return { ok: false, message: 'The bag is empty.' }
      const order = {
        id: nextId(current.orders, 'ORD', 10200),
        creatorId: current.profile.id,
        items,
        amount: items.reduce((sum, item) => sum + item.price * item.qty, 0),
        paymentStatus: 'unpaid',
        shippingStatus: 'placed',
        placedAt: Date.now(),
        deliveredAt: null,
        submitWithinDays: current.settings.submitWithinDays,
        note: 'Recorded on this device. No card was charged.',
      }
      save({
        ...current,
        orders: [order, ...current.orders],
        notices: [notice('Order recorded', `${order.id} is on your cashback list. It is not a paid store order yet.`), ...current.notices].slice(0, 30),
      })
      return { ok: true, id: order.id }
    }

    function setOrder(orderId, patch) {
      const current = snapshot.current
      save({
        ...current,
        orders: current.orders.map((order) => (order.id === orderId ? { ...order, ...patch } : order)),
        requests: patch.shippingStatus === 'returned'
          ? current.requests.map((item) => (item.orderId === orderId && ['approved', 'paid'].includes(item.status)
            ? { ...item, flagged: true, flagReason: 'The order was returned after cashback was approved.' }
            : item))
          : current.requests,
      })
    }

    function submitRequest(orderId, postUrl) {
      const current = snapshot.current
      const order = current.orders.find((item) => item.id === orderId && item.creatorId === current.profile?.id)
      const gate = canRequest(order, current.requests)
      if (!gate.ok) return gate
      if (!isInstagramPost(postUrl)) return { ok: false, message: 'Paste a public Instagram post, reel, or story link.' }
      const quote = cashbackFor(order.items, current.settings)
      if (!quote.eligible) return { ok: false, message: quote.reason }
      const existing = current.requests.find((item) => item.orderId === orderId && item.status === 'needs_correction')
      const request = {
        id: existing?.id || nextId(current.requests, 'CB', 5000),
        orderId,
        creatorId: current.profile.id,
        creatorName: current.profile.name,
        instagram: current.profile.instagram,
        profileUrl: current.profile.profileUrl,
        items: order.items,
        orderAmount: order.amount,
        postUrl: postUrl.trim(),
        amount: quote.amount,
        status: 'pending_review',
        reason: '',
        flagged: false,
        submittedAt: Date.now(),
      }
      const requests = existing
        ? current.requests.map((item) => (item.id === existing.id ? request : item))
        : [request, ...current.requests]
      save({
        ...current,
        requests,
        notices: [notice('Cashback request submitted', `${request.id} is waiting for an admin to open the Instagram link.`), ...current.notices].slice(0, 30),
      })
      return { ok: true, id: request.id }
    }

    function reviewRequest(requestId, decision, reason = '') {
      const current = snapshot.current
      if (decision === 'rejected' && !String(reason).trim()) return { ok: false, message: 'Add a reason for the rejection.' }
      if (decision === 'needs_correction' && !String(reason).trim()) return { ok: false, message: 'Tell the creator what to fix.' }
      const titles = { approved: 'Cashback approved', rejected: 'Cashback rejected', needs_correction: 'Correction needed' }
      save({
        ...current,
        requests: current.requests.map((item) => (item.id === requestId ? { ...item, status: decision, reason: reason.trim(), decidedAt: Date.now() } : item)),
        notices: [notice(titles[decision] || 'Cashback updated', reason.trim() || `${requestId} is ${decision}.`), ...current.notices].slice(0, 30),
      })
      return { ok: true }
    }

    function markPaid(requestId) {
      const current = snapshot.current
      save({
        ...current,
        requests: current.requests.map((item) => (item.id === requestId && item.status === 'approved' && !item.flagged ? { ...item, status: 'paid' } : item)),
      })
    }

    function saveSettings(settings) {
      const current = snapshot.current
      save({ ...current, settings: { ...current.settings, ...settings, categoryPercents: { ...current.settings.categoryPercents, ...settings.categoryPercents } } })
    }

    return { apply, setCreatorStatus, recordBag, setOrder, submitRequest, reviewRequest, markPaid, saveSettings }
  }, [])

  const wallet = useMemo(() => walletFrom(state.requests), [state.requests])
  return <CreatorContext.Provider value={{ ...state, ...api, wallet }}>{children}</CreatorContext.Provider>
}

export function useCreator() {
  const value = useContext(CreatorContext)
  if (!value) throw new Error('useCreator must be used within CreatorProvider')
  return value
}
