import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Button } from '../components/Button';
import {
    PlusIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    DownloadIcon,
    UploadIcon,
    SearchIcon,
    CheckIcon,
    XMarkIcon,
    TrashIcon,
    EditIcon,
    SettingsIcon,
    ChevronDownIcon,
    LoadingIcon,
} from '../components/icons';
import { ReactNode } from 'react';

// Icon mapping for Storybook controls
const iconOptions: Record<string, ReactNode> = {
    none: undefined,
    plus: <PlusIcon />,
    arrowRight: <ArrowRightIcon />,
    arrowLeft: <ArrowLeftIcon />,
    download: <DownloadIcon />,
    upload: <UploadIcon />,
    search: <SearchIcon />,
    check: <CheckIcon />,
    xMark: <XMarkIcon />,
    trash: <TrashIcon />,
    edit: <EditIcon />,
    settings: <SettingsIcon />,
    chevronDown: <ChevronDownIcon />,
    loading: <LoadingIcon />,
};

/**
 * Button Component
 *
 * Built on Radix UI Slot for polymorphic rendering (asChild pattern).
 * Styled with Supernova.io design tokens mapped through Tailwind CSS v4.
 *
 * Three variants (primary, secondary, tertiary), three sizes (sm, md, lg),
 * and support for disabled, loading, and hover states with left/right icons.
 */
const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component:
                    'A polymorphic button built on Radix UI Slot, styled with Supernova.io design tokens via Tailwind CSS v4. Supports asChild for rendering as any element, plus left/right icons.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary'],
            description: 'The visual style variant of the button',
            table: {
                defaultValue: { summary: 'primary' },
            },
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'The size of the button',
            table: {
                defaultValue: { summary: 'md' },
            },
        },
        disabled: {
            control: 'boolean',
            description: 'Whether the button is disabled',
            table: {
                defaultValue: { summary: 'false' },
            },
        },
        isLoading: {
            control: 'boolean',
            description: 'Show loading spinner and disable the button',
            table: {
                defaultValue: { summary: 'false' },
            },
        },
        showAsHover: {
            control: 'boolean',
            description: 'Show button in permanent hover state (for documentation)',
            table: {
                defaultValue: { summary: 'false' },
            },
        },
        leftIcon: {
            control: 'select',
            options: Object.keys(iconOptions),
            mapping: iconOptions,
            description: 'Icon to display on the left side of the button text',
            table: {
                defaultValue: { summary: 'none' },
            },
        },
        rightIcon: {
            control: 'select',
            options: Object.keys(iconOptions),
            mapping: iconOptions,
            description: 'Icon to display on the right side of the button text',
            table: {
                defaultValue: { summary: 'none' },
            },
        },
        children: {
            control: 'text',
            description: 'The content of the button',
        },
        asChild: {
            control: 'boolean',
            description:
                'When true, the button merges its props onto the immediate child element instead of rendering a <button>. Powered by Radix UI Slot.',
            table: {
                defaultValue: { summary: 'false' },
            },
        },
        // Hide inherited HTML attributes from controls
        className: { table: { disable: true } },
        onClick: { table: { disable: true } },
        type: { table: { disable: true } },
        style: { table: { disable: true } },
    },
    args: {
        children: 'Button',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// ===== Primary Variant Stories =====

/**
 * The default primary button style
 */
export const Primary: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};

/**
 * Primary button in hover state
 */
export const PrimaryHover: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Hover',
        showAsHover: true,
    },
};

/**
 * Primary button in disabled state
 */
export const PrimaryDisabled: Story = {
    args: {
        variant: 'primary',
        children: 'Primary Disabled',
        disabled: true,
    },
};

// ===== Secondary Variant Stories =====

/**
 * Secondary button with outline style
 */
export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};

/**
 * Secondary button in hover state
 */
export const SecondaryHover: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Hover',
        showAsHover: true,
    },
};

/**
 * Secondary button in disabled state
 */
export const SecondaryDisabled: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary Disabled',
        disabled: true,
    },
};

// ===== Tertiary Variant Stories =====

/**
 * Tertiary button with minimal styling
 */
export const Tertiary: Story = {
    args: {
        variant: 'tertiary',
        children: 'Tertiary Button',
    },
};

/**
 * Tertiary button in hover state
 */
export const TertiaryHover: Story = {
    args: {
        variant: 'tertiary',
        children: 'Tertiary Hover',
        showAsHover: true,
    },
};

/**
 * Tertiary button in disabled state
 */
export const TertiaryDisabled: Story = {
    args: {
        variant: 'tertiary',
        children: 'Tertiary Disabled',
        disabled: true,
    },
};

// ===== Loading State Stories =====

/**
 * Primary button in loading state
 */
export const Loading: Story = {
    args: {
        variant: 'primary',
        children: 'Loading...',
        isLoading: true,
    },
};

/**
 * Secondary button in loading state
 */
export const SecondaryLoading: Story = {
    args: {
        variant: 'secondary',
        children: 'Processing...',
        isLoading: true,
    },
};

/**
 * Tertiary button in loading state
 */
export const TertiaryLoading: Story = {
    args: {
        variant: 'tertiary',
        children: 'Loading...',
        isLoading: true,
    },
};

/**
 * All loading states comparison
 */
export const AllLoadingStates: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button variant="primary" isLoading>Saving...</Button>
            <Button variant="secondary" isLoading>Processing...</Button>
            <Button variant="tertiary" isLoading>Loading...</Button>
        </div>
    ),
};

// ===== Size Stories =====

/**
 * Small size button
 */
export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small',
    },
};

/**
 * Medium size button (default)
 */
export const Medium: Story = {
    args: {
        size: 'md',
        children: 'Medium',
    },
};

/**
 * Large size button
 */
export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large',
    },
};

// ===== Icon Stories =====

/**
 * Button with icon on the left
 */
export const WithLeftIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Add Item',
        leftIcon: <PlusIcon />,
    },
};

/**
 * Button with icon on the right
 */
export const WithRightIcon: Story = {
    args: {
        variant: 'primary',
        children: 'Continue',
        rightIcon: <ArrowRightIcon />,
    },
};

/**
 * Button with icons on both sides
 */
export const WithBothIcons: Story = {
    args: {
        variant: 'primary',
        children: 'Download',
        leftIcon: <DownloadIcon />,
        rightIcon: <ArrowRightIcon />,
    },
};

/**
 * Secondary button with left icon
 */
export const SecondaryWithIcon: Story = {
    args: {
        variant: 'secondary',
        children: 'Search',
        leftIcon: <SearchIcon />,
    },
};

/**
 * Tertiary button with right icon
 */
export const TertiaryWithIcon: Story = {
    args: {
        variant: 'tertiary',
        children: 'Learn more',
        rightIcon: <ArrowRightIcon />,
    },
};

// ===== All Variants Comparison =====

/**
 * All button variants side by side for comparison
 */
export const AllVariants: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
        </div>
    ),
};

/**
 * All button sizes side by side for comparison
 */
export const AllSizes: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
        </div>
    ),
};

/**
 * All button states (default, hover, disabled) for each variant
 */
export const AllStates: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Primary</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="primary">Default</Button>
                    <Button variant="primary" showAsHover>Hover</Button>
                    <Button variant="primary" disabled>Disabled</Button>
                </div>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Secondary</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="secondary">Default</Button>
                    <Button variant="secondary" showAsHover>Hover</Button>
                    <Button variant="secondary" disabled>Disabled</Button>
                </div>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Tertiary</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="tertiary">Default</Button>
                    <Button variant="tertiary" showAsHover>Hover</Button>
                    <Button variant="tertiary" disabled>Disabled</Button>
                </div>
            </div>
        </div>
    ),
};

/**
 * All icon variations for comparison
 */
// ===== asChild (Polymorphic) Stories =====

/**
 * Render as an anchor link using asChild.
 * All button styles are forwarded to the child <a> element.
 */
export const AsLink: Story = {
    args: {
        variant: 'primary',
        children: 'Go to Docs',
        asChild: true,
        rightIcon: <ArrowRightIcon />,
    },
    render: (args) => (
        <Button {...args}>
            <a href="https://supernova.io" target="_blank" rel="noopener noreferrer">
                {args.children}
            </a>
        </Button>
    ),
};

/**
 * Secondary variant rendered as an anchor link.
 */
export const AsLinkSecondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Visit Storybook',
        asChild: true,
        leftIcon: <ArrowLeftIcon />,
    },
    render: (args) => (
        <Button {...args}>
            <a href="https://storybook.js.org" target="_blank" rel="noopener noreferrer">
                {args.children}
            </a>
        </Button>
    ),
};

/**
 * All three variants rendered as links for comparison.
 */
export const AsChildVariations: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Button variant="primary" asChild rightIcon={<ArrowRightIcon />}>
                <a href="#primary">Primary Link</a>
            </Button>
            <Button variant="secondary" asChild rightIcon={<ArrowRightIcon />}>
                <a href="#secondary">Secondary Link</a>
            </Button>
            <Button variant="tertiary" asChild rightIcon={<ArrowRightIcon />}>
                <a href="#tertiary">Tertiary Link</a>
            </Button>
        </div>
    ),
};

export const AllIconVariations: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Left Icon</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="primary" leftIcon={<PlusIcon />}>Add</Button>
                    <Button variant="secondary" leftIcon={<SearchIcon />}>Search</Button>
                    <Button variant="tertiary" leftIcon={<DownloadIcon />}>Download</Button>
                </div>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Right Icon</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="primary" rightIcon={<ArrowRightIcon />}>Next</Button>
                    <Button variant="secondary" rightIcon={<ArrowRightIcon />}>Continue</Button>
                    <Button variant="tertiary" rightIcon={<ArrowRightIcon />}>Learn more</Button>
                </div>
            </div>
            <div>
                <h4 style={{ marginBottom: '8px', fontWeight: 600 }}>Both Icons</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <Button variant="primary" leftIcon={<DownloadIcon />} rightIcon={<ArrowRightIcon />}>Download</Button>
                    <Button variant="secondary" leftIcon={<PlusIcon />} rightIcon={<ArrowRightIcon />}>Add & Continue</Button>
                </div>
            </div>
        </div>
    ),
};
