"use client"

import Link from "next/link"
import Image from "next/image"

export function MainNav() {
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
          <Link
            href="#login"
            className="hidden sm:inline-flex px-3 py-1.5 text-sm text-gray-400 hover:text-white transition rounded-md hover:bg-white/5"
          >
            Log in
          </Link>
          <Link
            href="#signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-purple-500 px-4 text-sm font-medium text-white transition hover:bg-purple-600"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  )
}
