import { ImgHTMLAttributes } from 'react';

export default function ApplicationLogo({ className = 'h-10 w-auto', ...props }: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo.png"
            alt="Grupo Xamanen"
            className={className}
            {...props}
        />
    );
}
