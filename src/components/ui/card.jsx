import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return <div className={cn('bg-white rounded-2xl shadow-soft border border-gray-100', className)} {...props} />
}
export function CardHeader({ className, ...props }) {
  return <div className={cn('p-6 border-b border-gray-100', className)} {...props} />
}
export function CardTitle({ className, ...props }) {
  return <h3 className={cn('text-lg font-semibold', className)} {...props} />
}
export function CardContent({ className, ...props }) {
  return <div className={cn('p-6', className)} {...props} />
}
export function CardFooter({ className, ...props }) {
  return <div className={cn('p-6 border-t border-gray-100', className)} {...props} />
}