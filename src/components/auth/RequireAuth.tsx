'use client'
import { useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface RequireAuthProps {
  children: ReactNode
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}
