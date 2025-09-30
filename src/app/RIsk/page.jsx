import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Page() {
  return (
    <div className='container py-10 max-w-2xl'>
      <Card>
        <CardContent>
          <h1 className='text-2xl font-semibold mb-1'>Risk Management</h1>
          <p className='text-gray-600 mb-6'>Set portfolio-level and per-strategy limits.</p>
          <div className='grid md:grid-cols-2 gap-4'>
            <div>
              <label className='text-sm text-gray-600'>Max daily loss (%)</label>
              <Input type='number' placeholder='e.g., 2' />
            </div>
            <div>
              <label className='text-sm text-gray-600'>Portfolio stop-loss (%)</label>
              <Input type='number' placeholder='e.g., 10' />
            </div>
            <div className='md:col-span-2'>
              <label className='text-sm text-gray-600'>Max per-strategy exposure (%)</label>
              <Input type='number' placeholder='e.g., 40' />
            </div>
          </div>
          <Button className='mt-6'>Save settings</Button>
        </CardContent>
      </Card>
    </div>
  )
}