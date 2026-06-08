import { forwardRef } from 'react'

type Variant = 'primary' | 'outline' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  loading?: boolean
  children: React.ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold text-xs tracking-wide transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary-hover',
  outline: 'border border-primary text-primary hover:bg-primary-subtle',
  ghost:   'text-ink hover:bg-primary-subtle',
  danger:  'bg-danger text-danger-foreground hover:opacity-90',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5',
  md: 'px-6 py-2.5',
  lg: 'px-8 py-3',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', fullWidth = false, loading = false, children, className = '', disabled, ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={props.type ?? 'button'}
      disabled={disabled || loading}
      className={[base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className].filter(Boolean).join(' ')}
      {...props}
    >
      {loading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  ),
)
Button.displayName = 'Button'

export default Button
