'use client'

import { Triangle } from 'lucide-react'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface DropdownProps {
    items: string[]
    placeholder?: string
    value?: string
    onSelect?: (item: string) => void
    onOpenChange?: (isOpen: boolean) => void
}

function Dropdown({ items, placeholder = "What do you love about your partner?", value = '', onSelect, onOpenChange }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedValue, setSelectedValue] = useState(value)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setSelectedValue(value)
    }, [value])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
                onOpenChange?.(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onOpenChange])

    const handleToggle = () => {
        const newState = !isOpen
        setIsOpen(newState)
        onOpenChange?.(newState)
    }

    const handleSelect = (item: string) => {
        setSelectedValue(item)
        setIsOpen(false)
        onOpenChange?.(false)
        onSelect?.(item)
    }

    return (
        <div className={`relative w-full self-stretch ${isOpen ? 'z-100' : ''}`} ref={dropdownRef}>
            {/* Main dropdown button */}
            <div
                className="relative px-2.5   md:px-4 py-2.5 overflow-hidden cursor-pointer z-50"
                onClick={handleToggle}
            >
                {/* Texture background */}
                <Image
                    className="absolute inset-0 object-cover pointer-events-none z-0 w-full h-full"
                    src="/texture.png"
                    alt="Closeup Love Tunes"
                    width={288}
                    height={60}
                    quality={100}
                />

                {/* Display field */}
                <div className="relative z-10 ">
                    <div className="w-full px-0.5 py-3 text-sm md:text-sm text-primary ">
                        {selectedValue || placeholder}
                    </div>

                    {/* Dropdown indicator */}
                    <div className="absolute  right-0 top-1/2 -translate-y-1/2">
                        <Triangle
                            className={`text-primary transition-transform ${isOpen ? '' : 'rotate-180'}`}
                            size={10}
                            fill="currentColor"
                        />
                    </div>
                </div>
            </div>

            {/* Dropdown menu - always opens below */}
            {isOpen && (
                <div className="absolute left-5 right-5 top-full mt-1 bg-white rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleSelect(item)}
                            className="px-5 pl-2 py-3 text-left text-black text-sm cursor-pointer transition-colors hover:bg-[#FFD9DB] hover:text-primary! hover:border-l-4 hover:border-l-primary"
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Dropdown
