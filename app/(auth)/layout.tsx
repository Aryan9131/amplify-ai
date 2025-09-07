import React from 'react'

export default function authLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='h-screen bg-gradient-to-br from-[#030918] to-gray-600/20 flex items-center justify-center'>
            {children}
        </div>
    )
}

