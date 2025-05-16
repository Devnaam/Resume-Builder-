"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  FileText,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Briefcase,
  FileEdit,
  User,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const pathname = usePathname()
  const { toast } = useToast()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Check if user is logged in on client side
  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true")
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("user")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    setIsLoggedIn(false)

    // Redirect to home page if on a protected route
    if (pathname.includes("/dashboard")) {
      window.location.href = "/"
    }
  }

  return (
    <header className="border-b sticky top-0 bg-white z-20">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <FileText className="h-6 w-6" />
          <span>ResumeBuilder</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/templates"
            className={`text-sm font-medium hover:text-blue-600 ${
              pathname === "/templates" ? "text-blue-600" : "text-gray-600"
            }`}
          >
            Templates
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1 h-8 px-2">
                Features
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/resume/form" className="flex items-center cursor-pointer">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Resume Builder
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resume/preview" className="flex items-center cursor-pointer">
                  <FileText className="mr-2 h-4 w-4" />
                  Resume Preview
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resume/preview?tab=analyze" className="flex items-center cursor-pointer">
                  <Sparkles className="mr-2 h-4 w-4" />
                  AI Resume Analysis
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resume/preview?tab=jobs" className="flex items-center cursor-pointer">
                  <Briefcase className="mr-2 h-4 w-4" />
                  Job Matching
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link
            href="#pricing"
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
            onClick={(e) => {
              // If on homepage, scroll to pricing section
              if (pathname === "/") {
                e.preventDefault()
                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
              }
            }}
          >
            Pricing
          </Link>

          <Link href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            Blog
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard?tab=settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login" className="hidden md:block">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="hidden md:flex">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 px-4 space-y-4">
            <Link
              href="/templates"
              className="block py-2 text-base font-medium hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Templates
            </Link>

            <div className="py-2">
              <p className="text-base font-medium mb-2">Features</p>
              <div className="space-y-2 pl-4">
                <Link
                  href="/resume/form"
                  className="block py-1 text-sm hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resume Builder
                </Link>
                <Link
                  href="/resume/preview"
                  className="block py-1 text-sm hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Resume Preview
                </Link>
                <Link
                  href="/resume/preview?tab=analyze"
                  className="block py-1 text-sm hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  AI Resume Analysis
                </Link>
                <Link
                  href="/resume/preview?tab=jobs"
                  className="block py-1 text-sm hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Job Matching
                </Link>
              </div>
            </div>

            <Link
              href="#pricing"
              className="block py-2 text-base font-medium hover:text-blue-600"
              onClick={(e) => {
                setIsMenuOpen(false)
                // If on homepage, scroll to pricing section
                if (pathname === "/") {
                  e.preventDefault()
                  document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              Pricing
            </Link>

            <Link
              href="#"
              className="block py-2 text-base font-medium hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>

            <div className="pt-4 border-t">
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block py-2 text-base font-medium hover:text-blue-600"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left py-2 text-base font-medium hover:text-blue-600"
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Log out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link href="/auth/login" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="block" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-4 border-t flex items-center justify-center">
              <Link
                href="#"
                className="flex items-center text-sm text-gray-500 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
