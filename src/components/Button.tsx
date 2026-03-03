import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    isLoading?: boolean; // Show loading spinner and disable button
    showAsHover?: boolean; // Show button in permanent hover state (for docs)
    leftIcon?: ReactNode;  // Icon to display on the left
    rightIcon?: ReactNode; // Icon to display on the right
}

// Spinner component for loading state
const Spinner = ({ className }: { className?: string }) => (
    <svg
        className={`animate-spin ${className}`}
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

const variantStyles: Record<ButtonVariant, { base: string; hover: string; hoverStatic: string; disabled: string }> = {
    primary: {
        base: 'bg-fill-button-primary text-text-button-primary border border-stroke-button-primary',
        hover: 'hover:bg-fill-button-primary-hover hover:border-stroke-button-primary-hover',
        hoverStatic: 'bg-fill-button-primary-hover border-stroke-button-primary-hover text-text-button-primary',
        disabled: 'bg-fill-button-primary-disabled border-stroke-button-primary-disabled text-text-button-primary-disabled cursor-not-allowed',
    },
    secondary: {
        base: 'bg-fill-button-secondary text-text-button-secondary border border-stroke-button-secondary',
        hover: 'hover:bg-fill-button-secondary-hover hover:border-stroke-button-secondary-hover',
        hoverStatic: 'bg-fill-button-secondary-hover border-stroke-button-secondary-hover text-text-button-secondary',
        disabled: 'bg-fill-button-secondary-disabled border-stroke-button-secondary-disabled text-text-button-secondary-disabled cursor-not-allowed',
    },
    tertiary: {
        base: 'bg-fill-button-tertiary text-text-button-tertiary border border-stroke-button-tertiary',
        hover: 'hover:text-text-button-tertiary-hover border border-stroke-button-tertiary',
        hoverStatic: 'text-text-button-tertiary-hover border border-stroke-button-tertiary',
        disabled: 'text-text-button-tertiary-disabled cursor-not-allowed border border-stroke-button-tertiary',
    },
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-[var(--button-padding-x-sm)] py-[var(--button-padding-y-sm)] text-fs-sm leading-lh-md rounded-[var(--button-radius-sm)] h-[var(--button-height-sm)]',
    md: 'px-[var(--button-padding-x-md)] py-[var(--button-padding-y-md)] text-fs-md leading-lh-lg rounded-[var(--button-radius-md)] h-[var(--button-height-md)]',
    lg: 'px-[var(--button-padding-x-lg)] py-[var(--button-padding-y-lg)] text-fs-lg leading-lh-2xl rounded-[var(--button-radius-lg)] h-[var(--button-height-lg)]',
};

// Icon size classes based on button size
const iconSizeStyles: Record<ButtonSize, string> = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
};

// Gap between icon and text
const gapStyles: Record<ButtonSize, string> = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
};

export function Button({
    children,
    variant = 'primary',
    size = 'md',
    disabled = false,
    isLoading = false,
    showAsHover = false,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}: ButtonProps) {
    const styles = variantStyles[variant];
    const isDisabled = disabled || isLoading;

    let stateClasses: string;
    if (isDisabled) {
        stateClasses = styles.disabled;
    } else if (showAsHover) {
        stateClasses = styles.hoverStatic;
    } else {
        stateClasses = `${styles.base} ${styles.hover}`;
    }

    const buttonClasses = [
        'inline-flex items-center justify-center font-regular border',
        sizeStyles[size],
        gapStyles[size],
        stateClasses,
        className,
    ].join(' ');

    const iconClasses = iconSizeStyles[size];

    // Determine what to show in left icon position
    const leftContent = isLoading ? (
        <Spinner className={iconClasses} />
    ) : leftIcon ? (
        <span className={`inline-flex shrink-0 ${iconClasses}`}>{leftIcon}</span>
    ) : null;

    return (
        <button
            className={buttonClasses}
            disabled={isDisabled}
            {...props}
        >
            {leftContent}
            {children}
            {rightIcon && !isLoading && <span className={`inline-flex shrink-0 ${iconClasses}`}>{rightIcon}</span>}
        </button>
    );
}

export default Button;



