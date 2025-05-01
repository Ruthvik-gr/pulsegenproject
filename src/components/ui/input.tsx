import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-gray-200 placeholder:text-gray-500 selection:bg-primary-700 selection:text-white bg-dark-surface border-dark-border flex h-9 w-full min-w-0 rounded-md border text-gray-200 px-3 py-1 text-base shadow-dark transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-primary-600 focus-visible:ring-primary-600/30 focus-visible:ring-[3px]",
        "aria-invalid:ring-red-700/20 aria-invalid:border-red-700",
        className
      )}
      {...props}
    />
  )
}

export { Input }
