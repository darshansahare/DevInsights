import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    style={{
      position: 'relative',
      height: '0.375rem',
      width: '100%',
      overflow: 'hidden',
      borderRadius: '9999px',
      backgroundColor: '#0b0d12',
    }}
    className={className}
    {...props}
  >
    <ProgressPrimitive.Indicator
      style={{
        height: '100%',
        width: '100%',
        backgroundColor: '#10b981',
        borderRadius: '9999px',
        transition: 'transform 0.3s ease',
        transform: `translateX(-${100 - (value || 0)}%)`
      }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
