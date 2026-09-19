import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"
import { cn } from "@/lib/utils"

const Avatar = React.forwardRef(({ className, style, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    style={{
      position: 'relative',
      display: 'flex',
      height: '2rem',
      width: '2rem',
      flexShrink: 0,
      overflow: 'hidden',
      borderRadius: '0.5rem',
      ...style,
    }}
    className={className}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef(({ className, style, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    style={{
      aspectRatio: '1 / 1',
      height: '100%',
      width: '100%',
      objectFit: 'cover',
      ...style,
    }}
    className={className}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef(({ className, style, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    style={{
      display: 'flex',
      height: '100%',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#1b202e',
      color: '#cbd5e1',
      fontSize: '0.625rem',
      fontFamily: 'monospace',
      ...style,
    }}
    className={className}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
