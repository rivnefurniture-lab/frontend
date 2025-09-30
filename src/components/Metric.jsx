export default function Metric({ label, value, sub }) {
  return (
    <div className='p-5 rounded-2xl bg-white border border-gray-100 shadow-soft'>
      <p className='text-sm text-gray-500'>{label}</p>
      <p className='text-2xl font-semibold'>{value}</p>
      {sub && <p className='text-xs text-gray-400 mt-1'>{sub}</p>}
    </div>
  )
}