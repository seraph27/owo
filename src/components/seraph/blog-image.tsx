import * as React from 'react'
import { cn } from '@/lib/utils'

interface BlogImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number
  height?: number
}

export const BlogImage = React.forwardRef<HTMLImageElement, BlogImageProps>(
  ({ className, width = 400, height = 300, ...props }, ref) => {
    return (
      <img
        ref={ref}
        width={width}
        height={height}
        style={{ width: '100%', maxWidth: width, height }}
        className={cn('mx-auto rounded-md border object-cover', className)}
        {...props}
      />
    )
  },
)
BlogImage.displayName = 'BlogImage'