import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Sheet({ trigger, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className='relative'>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <div className={cn('fixed inset-0 bg-black/30 transition-opacity', open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none')} onClick={() => setOpen(false)} />
      <div className={cn('fixed top-0 right-0 h-full w-80 bg-white shadow-xl transition-transform', open ? 'translate-x-0' : 'translate-x-full')}>
        <div className='p-4 flex justify-end'><button onClick={() => setOpen(false)} className='text-gray-500'>Close</button></div>
        <div className='p-4'>{children}</div>
      </div>
    </div>
  )
}