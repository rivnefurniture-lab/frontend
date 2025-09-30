import { cn } from '@/lib/utils'
export function Input({ className, ...props }) {
  return (
    <input
      className={cn('w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500', className)}
      {...props}
    />
  )
}