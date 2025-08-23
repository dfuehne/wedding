import { cva, type VariantProps } from "class-variance-authority"
import { twMerge } from "tailwind-merge"

const button = cva(
  [
    "justify-center",
    "inline-flex",
    "items-center",
    "rounded-xl",
    "text-center",
    "border",
    "transition-colors",
    "delay-50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-[var(--primary-color)]",       // background = default text color
          "text-[var(--background-color)]",   // text = default background color
          "border-[var(--primary-color)]",
          "hover:enabled:bg-[var(--darker-primary-color)]",  // slightly darker hover bg
        ],
        secondary: [
          "bg-transparent",
          "text-[var(--primary-color)]",  // text uses default text color
          "border-[var(--primary-color)]",
          "hover:enabled:bg-[var(--background-color)]", // hover bg = default background color
          "hover:enabled:text-[var(--primary-color)]",
        ],
      },
      size: {
        sm: ["min-w-20", "h-full", "min-h-10", "text-sm", "py-1.5", "px-4"],
        lg: ["min-w-32", "h-full", "min-h-12", "text-lg", "py-2.5", "px-6"],
      },
      underline: { true: ["underline"], false: [] },
    },
    defaultVariants: {
      intent: "primary",
      size: "lg",
    },
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof button> {
  underline?: boolean
  href: string
}

export function Button({ className, intent, size, underline, ...props }: ButtonProps) {
  return (
    <a className={twMerge(button({ intent, size, underline, className }))} {...props}>
      {props.children}
    </a>
  )
}
