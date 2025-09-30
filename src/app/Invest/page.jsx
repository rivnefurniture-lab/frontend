import { useState } from 'react'
import { strategies } from '@/data.mock'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Page() {
  const [sid, setSid] = useState('')
  const [amount, setAmount] = useState('')
  const s = strategies.find(x => x.id===sid)

  return (
    <div className='container py-10 max-w-2xl'>
      <Card>
        <CardContent>
          <h1 className='text-2xl font-semibold mb-1'>Invest in a Strategy</h1>
          <p className='text-gray-600 mb-6'>Choose a strategy and amount. You can adjust risk controls later.</p>
          <div className='space-y-4'>
            <Select value={sid} onChange={setSid} placeholder='Select strategy' options={strategies.map(s=>({value:s.id, label:s.name}))} />
            <Input type='number' placeholder='Amount (USD)' value={amount} onChange={e=>setAmount(e.target.value)} />
            {s && <p className='text-sm text-gray-500'>Minimum investment for <strong>{s.name}</strong> is ${s.minInvestment}.</p>}
            <Button className='w-full'>Continue</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}