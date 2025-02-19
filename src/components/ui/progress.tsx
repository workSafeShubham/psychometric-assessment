import * as React from "react"

const Progress = React.forwardRef
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: number }
>(({ value = 0, className, ...props }, ref) => (
  <div
    ref={ref}
    className="relative h-4 w-full overflow-hidden rounded-full bg-gray-200"
    {...props}
  >
    <div 
      className="h-full bg-blue-600 transition-all" 
      style={{ width: `${value}%` }}
    />
  </div>
))
Progress.displayName = "Progress"

export { Progress }
