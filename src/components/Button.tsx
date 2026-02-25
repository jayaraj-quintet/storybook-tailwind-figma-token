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
        base: 'bg-button-primary-fill text-button-primary-text border border-button-primary-stroke',
        hover: 'hover:bg-button-primary-fill-hover hover:border-button-primary-stroke-hover',
        hoverStatic: 'bg-button-primary-fill-hover border-button-primary-stroke-hover text-button-primary-text',
        disabled: 'bg-button-primary-fill-disabled border-button-primary-stroke-disabled text-button-primary-text cursor-not-allowed',
    },
    secondary: {
        base: 'bg-button-secondary-fill text-button-secondary-text border border-button-secondary-stroke',
        hover: 'hover:bg-button-secondary-fill-hover hover:border-button-secondary-stroke-hover',
        hoverStatic: 'bg-button-secondary-fill-hover border-button-secondary-stroke-hover text-button-secondary-text',
        disabled: 'bg-button-secondary-fill-disabled border-button-secondary-stroke-disabled text-button-secondary-text-disabled cursor-not-allowed',
    },
    tertiary: {
        base: 'bg-button-tertiary-fill text-button-tertiary-text border border-button-tertiary-stroke',
        hover: 'hover:text-button-tertiary-text-hover border border-button-tertiary-stroke',
        hoverStatic: 'text-button-tertiary-text-hover border border-button-tertiary-stroke',
        disabled: 'text-button-tertiary-text-disabled cursor-not-allowed border border-button-tertiary-stroke',
    },
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-sm py-xs text-xs leading-5 rounded-sm h-8',
    md: 'px-md py-xs text-sm leading-6 rounded-md h-9',
    lg: 'px-md py-sm text-base leading-7 rounded-md h-11',
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



