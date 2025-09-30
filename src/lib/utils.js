import clsx from 'classnames'

export function cn(...inputs) {
  return clsx(inputs)
}

export async function api(path, opts={}) {
  const res = await fetch(path.startsWith('/api') ? path : `/api${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers||{}) },
    credentials: 'include',
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    method: opts.method || (opts.body ? 'POST' : 'GET')
  })
  if(!res.ok) throw new Error(await res.text())
  return res.json()
}

export function isSubscribed() {
  try { return JSON.parse(localStorage.getItem('subscription')||'{}')?.active === true } catch { return false }
}

export function setSubscribed(plan) {
  localStorage.setItem('subscription', JSON.stringify({ active:true, plan, ts: Date.now() }))
}