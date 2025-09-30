export default function Page() {
  return (
    <div className='container py-10 max-w-3xl'>
      <h1 className='text-2xl font-semibold mb-6'>Support</h1>
      <p className='text-gray-600 mb-4'>Email support@algotcha.example or use the form below.</p>
      <form className='space-y-3'>
        <input className='w-full h-11 px-4 rounded-xl border border-gray-200' placeholder='Subject' />
        <textarea className='w-full h-36 p-4 rounded-xl border border-gray-200' placeholder='Describe your issue...' />
        <button className='bg-blue-600 text-white rounded-xl h-11 px-6'>Send</button>
      </form>
    </div>
  )
}