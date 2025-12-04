"use client"
import { MoveLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const BackButton = () => {
    const router = useRouter()
    
    return (
        <button 
            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            onClick={() => router.back()}
        >
            <MoveLeft className="w-5 h-5" />
        </button>
    )
}