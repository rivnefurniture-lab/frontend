const faqs = [
  {q:'What is algorithmic investing?', a:'Allocating capital to rules-based strategies rather than discretionary decisions.'},
  {q:'What are the risks?', a:'All investing involves risk, including loss of principal. Past performance is not indicative of future results.'},
  {q:'How are strategies vetted?', a:'We review methodology, backtests, and live performance where available.'},
]
export default function Page() {
  return (
    <div className='container py-10 max-w-3xl'>
      <h1 className='text-2xl font-semibold mb-6'>FAQ</h1>
      <div className='space-y-4'>
        {faqs.map((f,i)=>(
          <div key={i} className='bg-white border border-gray-100 rounded-2xl p-5 shadow-soft'>
            <h3 className='font-semibold'>{f.q}</h3>
            <p className='text-gray-600 mt-1'>{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  )
}