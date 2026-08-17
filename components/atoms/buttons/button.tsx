'use client'

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  icon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    icon,
    children,
    className,
    disabled,
    ...props
  }, ref) => {
    const baseStyles = 'relative inline-flex items-center justify-center font-semibold transition-all duration-300 ease-out rounded-2xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed'

    const sizeStyles = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-7 py-3 text-base',
      lg: 'px-8 py-3.5 text-lg',
    }

    const variantStyles = {
      primary: 'bg-gradient-to-br from-[hsl(240_6%_11%)] to-[hsl(240_4%_14%)] text-[hsl(45_27%_97%)] shadow-[0_8px_24px_hsla(240_6%_11%_/_0.25),inset_0_1px_2px_hsla(255_100%_100%_/_0.15)] hover:shadow-[0_12px_32px_hsla(240_6%_11%_/_0.35),inset_0_1px_2px_hsla(255_100%_100%_/_0.2),inset_0_-2px_8px_hsla(240_6%_11%_/_0.2)] hover:bg-gradient-to-br hover:from-[hsl(240_6%_10%)] hover:to-[hsl(240_4%_13%)]',
      secondary: 'bg-gradient-to-br from-[hsl(36_100%_69%)] to-[hsl(36_90%_64%)] text-[hsl(240_6%_11%)] shadow-[0_8px_24px_hsla(36_100%_69%_/_0.2),inset_0_1px_2px_hsla(255_100%_100%_/_0.25)] hover:shadow-[0_12px_32px_hsla(36_100%_69%_/_0.3),inset_0_1px_2px_hsla(255_100%_100%_/_0.3),inset_0_-2px_8px_hsla(36_100%_69%_/_0.15)] hover:bg-gradient-to-br hover:from-[hsl(36_95%_66%)] hover:to-[hsl(36_90%_64%)]',
      tertiary: 'bg-transparent border-2 border-[hsl(230_10%_88%)] text-[hsl(230_8%_13%)] shadow-[inset_0_1px_2px_hsla(255_100%_100%_/_0.05)] hover:border-[hsl(240_6%_11%)] hover:bg-[hsla(240_6%_11%_/_0.05)] hover:shadow-[0_4px_12px_hsla(240_6%_11%_/_0.1),inset_0_1px_2px_hsla(255_100%_100%_/_0.1)]',
    }

    const hoverScale = !disabled ? 'hover:scale-[1.02] active:scale-[0.97]' : ''

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${hoverScale} ${className || ''}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {/* Shine effect */}
        <span
          className="absolute inset-0 -left-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:left-full transition-all duration-600"
          style={{
            animation: 'none',
            left: '-100%',
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {isLoading && (
            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
          {icon && !isLoading && icon}
          {children}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'
