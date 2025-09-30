import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import Metric from '@/components/Metric'
import { strategies } from '@/data.mock'
import { motion } from 'framer-motion'

export default function Page() {
  return (
    <div>
      <section className='container pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center'>
        <div>
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{duration:0.5}} className='text-4xl md:text-5xl font-bold leading-tight'>
            Invest in proven <span className='text-blue-600'>trading algorithms</span>
          </motion.h1>
          <p className='mt-4 text-gray-600 max-w-xl'>Discover, compare, and allocate capital across vetted strategies with transparent risk and performance metrics.</p>
          <div className='mt-6 flex gap-3'>
            <Link to='/strategies'><Button size='lg'>Explore strategies</Button></Link>
            <Link to='/auth?mode=signup'><Button size='lg' variant='secondary'>Create account</Button></Link>
          </div>
          <div className='mt-8 grid grid-cols-3 gap-4'>
            <Metric label='Active strategies' value='32' />
            <Metric label='Avg. Sharpe' value='1.45' />
            <Metric label='Investors' value='2,184' />
          </div>
        </div>
        <div className='bg-white p-6 rounded-2xl shadow-soft border border-gray-100'>
          <img src='https://dummyimage.com/800x480/edf2f7/1a202c&text=Performance+Overview' alt='preview' className='rounded-xl w-full'/>
        </div>
      </section>

      <section className='container py-12'>
        <h2 className='text-2xl font-semibold mb-6'>Featured strategies</h2>
        <div className='grid md:grid-cols-3 gap-6'>
          {strategies.map(s => (
            <Link key={s.id} to={`/strategies/${s.id}`} className='block bg-white p-5 rounded-2xl shadow-soft border border-gray-100 hover:-translate-y-0.5 transition'>
              <h3 className='font-semibold'>{s.name}</h3>
              <p className='text-sm text-gray-500'>{s.category}</p>
              <div className='mt-3 flex items-center gap-4 text-sm'>
                <span>⚡ CAGR {s.cagr}%</span>
                <span>📉 MaxDD {s.maxDD}%</span>
                <span>📈 Sharpe {s.sharpe}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}