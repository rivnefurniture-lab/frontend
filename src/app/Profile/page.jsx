import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className='container py-10 max-w-2xl'>
      <Card>
        <CardContent>
          <h1 className='text-2xl font-semibold mb-1'>Profile & Settings</h1>
          <p className='text-gray-600 mb-6'>Manage your personal info, security, and notifications.</p>
          <div className='grid md:grid-cols-2 gap-4'>
            <Input placeholder='Full name' />
            <Input placeholder='Email' type='email' />
            <Input placeholder='Country' />
            <Input placeholder='Phone' />
          </div>
          <Button className='mt-6'>Save</Button>
        </CardContent>
      </Card>
    </div>
  )
}