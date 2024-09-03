import { ButtonHTMLAttributes } from "react"
import { tv, type VariantProps } from 'tailwind-variants';

const button = tv({
    base: 'py-2 px-3 rounded border-2 border-b-4 font-bold',
    variants: {
        variant: {
            primary: 'bg-yellow-400 text-zinc-800 border-yellow-700',
            secondary: 'bg-zinc-800 text-white border-white',
        },
        disabled: {
            true: 'opacity-50 bg-zinc-400 text-zinc-600 border-zinc-700 pointer-events-none'
        },
        size: {
            inherited: '',
            sm: 'text-sm'
        }

    },
    defaultVariants: {
        variant: 'primary',
        size: 'inherited'
    },
})

type ButtonVariants = VariantProps<typeof button>;

interface ButtonProps extends ButtonVariants, ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ variant, disabled, size, children, ...props }: ButtonProps) {
    return (
        <button
            className={button({ variant, disabled, size })}
            {...props}
        >
            {children}
        </button>
    )
}