import * as React from "react"

const Alert = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'destructive' }
>(({ className, variant = 'default', ...props }, ref) => {
  const variantClasses = {
    default: "bg-blue-50 text-blue-900 border-blue-200",
    destructive: "bg-red-50 text-red-900 border-red-200"
  }
  
  return (
    <div
      ref={ref}
      className={`relative w-full rounded-lg border p-4 ${variantClasses[variant]}`}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className="text-sm"
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }
