import { useParams, Link } from 'react-router-dom'
import { strategies } from '@/data.mock'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

export default function Page() {
  const { id } = useParams()
  const s = strategies.find(x => x.id === id)
  if(!s) return <div className='container py-10'>Not found</div>
  return (
    <div className='container py-10'>
      <div className='flex items-start justify-between gap-6 flex-col lg:flex-row'>
        <div className='flex-1 w-full'>
          <h1 className='text-3xl font-bold'>{s.name}</h1>
          <p className='text-gray-600'>{s.category}</p>
          <p className='mt-3 text-gray-700'>{s.description}</p>
          <div className='grid grid-cols-3 gap-4 mt-6'>
            <Stat label='CAGR' value={`${s.cagr}%`} />
            <Stat label='Sharpe' value={s.sharpe} />
            <Stat label='Max Drawdown' value={`${s.maxDD}%`} />
          </div>
          <Card className='mt-6'>
            <CardContent>
              <div className='h-72'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={s.history}>
                    <defs>
                      <linearGradient id='grad' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset='5%' stopColor='#2563eb' stopOpacity={0.5}/>
                        <stop offset='95%' stopColor='#2563eb' stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey='month' hide />
                    <YAxis hide />
                    <Tooltip />
                    <Area type='monotone' dataKey='value' stroke='#2563eb' fill='url(#grad)' strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <aside className='w-full lg:w-96'>
          <Card>
            <CardContent className='p-6'>
              <h3 className='text-lg font-semibold'>Invest</h3>
              <p className='text-sm text-gray-500 mt-1'>Minimum investment: ${s.minInvestment}</p>
              <form className='mt-4 space-y-3'>
                <div>
                  <label className='text-sm text-gray-600'>Amount (USD)</label>
                  <input type='number' className='w-full h-11 px-4 rounded-xl border border-gray-200' placeholder={`>= ${s.minInvestment}`} />
                </div>
                <Button className='w-full'>Allocate</Button>
              </form>
              <p className='text-xs text-gray-500 mt-4'>Past performance does not guarantee future results. Investing involves risk, including loss of principal.</p>
              <div className='mt-4'>
                <Link to='/risk' className='text-blue-600 hover:underline text-sm'>Configure risk controls →</Link>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className='p-4 rounded-xl bg-white border border-gray-100 shadow-soft'>
      <div className='text-sm text-gray-500'>{label}</div>
      <div className='text-xl font-semibold'>{value}</div>
    </div>
  )
}