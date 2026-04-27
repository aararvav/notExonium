"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/auth/me`)
        if (data.success) {
          setUser(data.user)
        }
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    // Check for OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    const userData = urlParams.get('user')

    if (token && userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData))
        // The token should already be set as an httpOnly cookie by the server
        // But we also store it in localStorage for the frontend to use if needed
        localStorage.setItem('token', token)
        setUser(user)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
        setLoading(false)
      } catch (error) {
        console.error('Error parsing OAuth callback data:', error)
        setLoading(false)
      }
    } else {
      checkAuth()
    }
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password })
    if (data.success) {
      setUser(data.user)
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data } = await axios.post(`${API_URL}/api/auth/register`, { name, email, password })
    if (data.success) {
      setUser(data.user)
    }
  }, [])

  const logout = useCallback(async () => {
    await axios.post(`${API_URL}/api/auth/logout`)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
