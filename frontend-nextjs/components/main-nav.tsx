"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/context/auth-context"
import { LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetFooter } from "@/components/ui/sheet"
import { MenuToggle } from "@/components/ui/menu-toggle"
import { Button } from "@/components/ui/button"

export function MainNav() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = React.useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/")
    setOpen(false)
  }

  const links = [
    { label: "Features", href: "/features" },
    { label: "How it Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
  ]

  return (
    <header className="fixed top-0 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50 z-50">
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition" onClick={() => setOpen(false)}>
            <Image src="/image.png" alt="Exonium" width={28} height={28} className="rounded-lg brightness-0 invert" />
            <span className="font-semibold text-white text-lg tracking-tight">Exonium</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden items-center gap-1 lg:flex">
          <div className="flex items-center gap-1 mr-4">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition rounded-md hover:bg-zinc-800/50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-3">
            {loading ? (
              <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
            ) : user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                    <span className="text-sm font-medium text-zinc-300">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-zinc-300 font-medium">{user.name}</span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 h-9 px-3"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 h-9 px-4">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-zinc-100 hover:bg-white text-zinc-900 h-9 px-4 border-0 font-medium">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Toggle */}
        <Sheet open={open} onOpenChange={setOpen}>
          <div className="lg:hidden flex items-center gap-4">
            <button className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md hover:bg-zinc-800/50 transition-colors">
              <MenuToggle
                strokeWidth={2.5}
                open={open}
                onOpenChange={setOpen}
                className="text-white"
              />
            </button>
          </div>
          <SheetContent
            className="bg-zinc-950/95 backdrop-blur-xl border-l border-zinc-800/50 p-0"
            showClose={false}
            side="right"
          >
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-zinc-800/50 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                  <Image src="/image.png" alt="Exonium" width={24} height={24} className="rounded-md brightness-0 invert" />
                  <span className="font-semibold text-white">Exonium</span>
                </Link>
                <button onClick={() => setOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-zinc-800/50">
                  <MenuToggle strokeWidth={2.5} open={true} onOpenChange={setOpen} className="text-white" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <SheetFooter className="p-6 border-t border-zinc-800/50 bg-zinc-900/50">
                {loading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                  </div>
                ) : user ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3 px-2">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <span className="text-base font-medium text-zinc-300">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{user.name}</span>
                        <span className="text-xs text-zinc-400">{user.email}</span>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <Link href="/login" className="w-full" onClick={() => setOpen(false)}>
                      <Button variant="outline" className="w-full border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 h-11">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full" onClick={() => setOpen(false)}>
                      <Button className="w-full bg-zinc-100 hover:bg-white text-zinc-900 h-11 border-0 font-medium">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  )
}
