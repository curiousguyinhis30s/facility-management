'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'superadmin' | 'admin' | 'user'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fake credentials
const FAKE_USERS = [
  {
    email: 'superadmin',
    password: '999999',
    user: {
      id: 'user-1',
      email: 'superadmin@facilitypro.com',
      name: 'Super Admin',
      role: 'superadmin' as const,
      avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=2563EB&color=fff',
    },
  },
  {
    email: 'admin@facilitypro.com',
    password: 'admin123',
    user: {
      id: 'user-2',
      email: 'admin@facilitypro.com',
      name: 'Admin User',
      role: 'admin' as const,
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=10B981&color=fff',
    },
  },
]

// Public routes that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password']

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('facilitypro_user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('facilitypro_user')
      }
    }
    setIsLoading(false)
  }, [])

  // Redirect to login if accessing protected route without auth
  useEffect(() => {
    if (!isLoading && !user && !PUBLIC_ROUTES.includes(pathname) && !pathname.startsWith('/portal')) {
      // Allow portal routes to handle their own auth check
    }
  }, [user, isLoading, pathname, router])

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const foundUser = FAKE_USERS.find(
      u => (u.email === email || u.user.email === email) && u.password === password
    )

    if (foundUser) {
      setUser(foundUser.user)
      localStorage.setItem('facilitypro_user', JSON.stringify(foundUser.user))
      return { success: true }
    }

    return { success: false, error: 'Invalid email or password' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('facilitypro_user')
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// HOC for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/login')
      }
    }, [user, isLoading, router])

    if (isLoading) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}
