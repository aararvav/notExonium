"use client"

import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export function MainNav() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 w-full backdrop-blur-xl bg-[#0d0d0d]/80 border-b border-white/10 z-50">
      <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <Image src="/image.png" alt="Exonium" width={28} height={28} className="rounded-lg brightness-0 invert" />
          <span className="font-semibold text-white">Exonium</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link
            href="#features"
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            How it Works
          </Link>
          <Link
            href="#pricing"
            className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
          ) : user ? (
            /* ── Logged in ── */
            <>
              <div className="hidden sm:flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center">
                  <span className="text-sm font-medium text-purple-300">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-300 font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            /* ── Not logged in ── */
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-purple-500 px-4 text-sm font-medium text-white transition hover:bg-purple-600"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
