"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed w-full z-50 border-b bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-md">
  <div className="container mx-auto flex items-center justify-between py-4 px-6">
    {/* Logo */}
    <Link href="/home" className="flex items-center space-x-2">
      <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center text-[#0f172a] font-bold">
        M
      </div>
      <span className="text-xl font-bold text-white">Medi</span>
    </Link>

    {/* Navigation */}
    <nav className="hidden md:flex items-center space-x-6 font-medium text-white">
  {/* Liens principaux */}
  <Link href="#home" className="hover:text-cyan-300 transition">
    Home
  </Link>
  <Link href="#about" className="hover:text-cyan-300 transition">
    About
  </Link>
  <Link href="#departments" className="hover:text-cyan-300 transition">
    Pages
  </Link>
  <Link href="#contact" className="hover:text-cyan-300 transition">
    Contact
  </Link>

  {/* Séparateur visuel */}
  <span className="h-6 w-px bg-white/30 mx-2"></span>

  {/* Boutons d’authentification */}
  <div className="flex items-center space-x-3">
    <Link
      href="/auth/login"
      className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-cyan-700 transition"
    >
      Login
    </Link>
    <Link
      href="/auth/register"
      className="bg-white text-cyan-600 border border-cyan-600 px-4 py-2 rounded-xl font-semibold hover:bg-cyan-50 transition"
    >
      Register
    </Link>
  </div>
</nav>


   
  </div>
</header>


      {/* Hero Section */}
      <section
        id="home"
        className="relative flex flex-1 items-center justify-center text-center text-white"
      >
        {/* Background Image */}
        <Image
          src="/home.png"
          alt="Medical Background"
          fill
          priority
          className="object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-3xl px-6 py-32">
          <p className="uppercase tracking-wider text-sm text-blue-200">
            THE BEST MEDICAL CENTER
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Bringing <span className="text-cyan-300">health</span> <br />
            to life for the whole family.
          </h1>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="hidden md:inline-flex bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white hover:bg-white hover:text-white transition"
          >
            <Link href="#discover">Discover More</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
