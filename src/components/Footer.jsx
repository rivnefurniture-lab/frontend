import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='mt-16 border-t border-gray-100'>
      <div className='container py-8 text-sm text-gray-600 flex flex-col sm:flex-row gap-2 sm:gap-6 justify-between items-center'>
        <p>© {new Date().getFullYear()} algotcha. All rights reserved.</p>
        <nav className='flex gap-4'>
          <Link href='/about' className='hover:text-gray-900'>About</Link>
          <Link href='/support' className='hover:text-gray-900'>Support</Link>
          <Link href='/faq' className='hover:text-gray-900'>FAQ</Link>
          <Link href='/legal' className='hover:text-gray-900'>Legal</Link>
        </nav>
      </div>
    </footer>
  )
}