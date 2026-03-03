import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

// ── Types ────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    isLoading?: boolean;
    showAsHover?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    /** Merge props onto the immediate child instead of rendering a <button> */
    asChild?: boolean;
}

// ── Spinner ──────────────────────────────────────────────────────

const Spinner = ({ className }: { className?: string }) => (
    <svg
        className={cn('animate-spin', className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
    >
        <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
        />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
    </svg>
);

// ── Token-mapped variant styles ──────────────────────────────────

const variantStyles: Record<
    ButtonVariant,
    { base: string; hover: string; hoverStatic: string; disabled: string }
> = {
    primary: {
        base: 'bg-fill-button-primary text-text-button-primary border border-stroke-button-primary',
        hover: 'hover:bg-fill-button-primary-hover hover:border-stroke-button-primary-hover',
        hoverStatic:
            'bg-fill-button-primary-hover border-stroke-button-primary-hover text-text-button-primary',
        disabled:
            'bg-fill-button-primary-disabled border-stroke-button-primary-disabled text-text-button-primary-disabled cursor-not-allowed',
    },
    secondary: {
        base: 'bg-fill-button-secondary text-text-button-secondary border border-stroke-button-secondary',
        hover: 'hover:bg-fill-button-secondary-hover hover:border-stroke-button-secondary-hover',
        hoverStatic:
            'bg-fill-button-secondary-hover border-stroke-button-secondary-hover text-text-button-secondary',
        disabled:
            'bg-fill-button-secondary-disabled border-stroke-button-secondary-disabled text-text-button-secondary-disabled cursor-not-allowed',
    },
    tertiary: {
        base: 'bg-fill-button-tertiary text-text-button-tertiary border border-stroke-button-tertiary',
        hover: 'hover:text-text-button-tertiary-hover border border-stroke-button-tertiary',
        hoverStatic:
            'text-text-button-tertiary-hover border border-stroke-button-tertiary',
        disabled:
            'text-text-button-tertiary-disabled cursor-not-allowed border border-stroke-button-tertiary',
    },
};

// ── Token-mapped size styles ─────────────────────────────────────

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-[var(--button-padding-x-sm)] py-[var(--button-padding-y-sm)] text-fs-sm leading-lh-md rounded-[var(--button-radius-sm)] h-[var(--button-height-sm)]',
    md: 'px-[var(--button-padding-x-md)] py-[var(--button-padding-y-md)] text-fs-md leading-lh-lg rounded-[var(--button-radius-md)] h-[var(--button-height-md)]',
    lg: 'px-[var(--button-padding-x-lg)] py-[var(--button-padding-y-lg)] text-fs-lg leading-lh-2xl rounded-[var(--button-radius-lg)] h-[var(--button-height-lg)]',
};

const iconSizeStyles: Record<ButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
};

const gapStyles: Record<ButtonSize, string> = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
};

// ── Component ────────────────────────────────────────────────────

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            children,
            variant = 'primary',
            size = 'md',
            disabled = false,
            isLoading = false,
            showAsHover = false,
            leftIcon,
            rightIcon,
            asChild = false,
            className,
            ...props
        },
        ref,
    ) => {
        const Comp = asChild ? Slot : 'button';
        const styles = variantStyles[variant];
        const isDisabled = disabled || isLoading;

        const stateClasses = isDisabled
            ? styles.disabled
            : showAsHover
              ? styles.hoverStatic
              : `${styles.base} ${styles.hover}`;

        const iconClasses = iconSizeStyles[size];

        const leftContent = isLoading ? (
            <Spinner className={iconClasses} />
        ) : leftIcon ? (
            <span className={cn('inline-flex shrink-0', iconClasses)}>{leftIcon}</span>
        ) : null;

        const rightContent =
            rightIcon && !isLoading ? (
                <span className={cn('inline-flex shrink-0', iconClasses)}>{rightIcon}</span>
            ) : null;

        return (
            <Comp
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center font-normal border transition-colors',
                    sizeStyles[size],
                    gapStyles[size],
                    stateClasses,
                    className,
                )}
                disabled={isDisabled}
                {...props}
            >
                {leftContent}
                <Slottable>{children}</Slottable>
                {rightContent}
            </Comp>
        );
    },
);

Button.displayName = 'Button';
export default Button;



