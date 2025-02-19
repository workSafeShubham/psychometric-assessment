import * as React from "react"

const Button = React.forwardRef
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' }
>(({ className, variant = 'default', ...props }, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2"
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 bg-blue-600 text-white",
    outline: "border border-input hover:bg-accent hover:text-accent-foreground border-gray-300 hover:bg-gray-100"
  }
  
  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]}`}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
