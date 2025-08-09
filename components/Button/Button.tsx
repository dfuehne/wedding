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
          "bg-[rgb(122,82,85)]",       // background = default text color
          "text-[rgb(247,242,237)]",   // text = default background color
          "border-[rgb(122,82,85)]",
          "hover:enabled:bg-[rgb(100,70,75)]",  // slightly darker hover bg
        ],
        secondary: [
          "bg-transparent",
          "text-[rgb(122,82,85)]",  // text uses default text color
          "border-[rgb(122,82,85)]",
          "hover:enabled:bg-[rgb(247,242,237)]", // hover bg = default background color
          "hover:enabled:text-[rgb(122,82,85)]",
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
