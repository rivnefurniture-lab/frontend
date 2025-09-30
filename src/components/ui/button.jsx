import { cn } from '@/lib/utils'

export function Button({ as: Comp = 'button', className, variant='primary', size='md', ...props }) {
  const base = 'inline-flex items-center justify-center rounded-2xl font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2'
  const variants = {
    primary: 'bg-brand text-white hover:bg-blue-700 focus:ring-blue-600',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 focus:ring-gray-300',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
  }
  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-5',
    lg: 'h-12 px-6 text-lg'
  }
  return <Comp className={cn(base, variants[variant], sizes[size], className)} {...props} />
}