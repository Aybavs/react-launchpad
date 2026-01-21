import { createContext, useCallback, useState } from 'react'
import type { ReactNode } from 'react'

import { STORAGE_KEYS } from '@/config'

import type { AuthState, User } from './types'

interface AuthContextValue extends AuthState {
  login: (token: string, user: User) => void
  logout: () => void
  updateUser: (user: User) => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const userJson = localStorage.getItem('user')

    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User
        return {
          user,
          isAuthenticated: true,
          isLoading: false,
        }
      } catch {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem('user')
      }
    }

    return { user: null, isAuthenticated: false, isLoading: false }
  })

  const login = useCallback((token: string, user: User) => {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
    localStorage.setItem('user', JSON.stringify(user))
    setState({ user, isAuthenticated: true, isLoading: false })
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem('user')
    setState({ user: null, isAuthenticated: false, isLoading: false })
  }, [])

  const updateUser = useCallback((user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    setState((prev) => ({ ...prev, user }))
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
