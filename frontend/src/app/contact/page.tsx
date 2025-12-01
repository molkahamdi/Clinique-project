"use client"
import { Phone, Mail, MapPin, Clock, Send, Facebook, Instagram, Linkedin } from "lucide-react"
import { useState } from "react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  })

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Message envoyé avec succès!")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+216 71 123 456", "+216 71 123 457"],
      color: "from-cyan-400 to-cyan-500"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@medi.tn", "support@medi.tn"],
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["Avenue Habib Bourguiba", "Tunis 1000, Tunisie"],
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lun - Ven: 8h - 18h", "Sam: 9h - 14h"],
      color: "from-blue-500 to-cyan-400"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md py-4 px-6 sticky top-0 z-50 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-xl font-bold text-slate-800">Logo</span>
          </a>

          <div className="hidden md:flex items-center gap-2">
            <a href="/" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              Home
            </a>
            <a href="/about" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              About
            </a>
            <a href="/departments" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              Departments
            </a>
            <a href="/contact" className="px-5 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full transition-all cursor-pointer font-medium">
              Contact
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a href="/auth/login">
              <button className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
                Login
              </button>
            </a>
            <a href="/auth/register">
              <button className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-full transition-all cursor-pointer font-medium shadow-md">
                Register
              </button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-700 mb-6">
            <span className="text-cyan-600">📞</span>
            <span>Contactez-nous</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Restons en{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              contact
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Notre équipe est à votre disposition pour répondre à toutes vos questions. 
            N'hésitez pas à nous contacter.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => {
            const Icon = info.icon
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 text-center hover:shadow-2xl transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {info.title}
                </h3>
                {info.details.map((detail, idx) => (
                  <p key={idx} className="text-slate-600 mb-1">
                    {detail}
                  </p>
                ))}
              </div>
            )
          })}
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Envoyez-nous un message
            </h2>
            <div className="space-y-5">
              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Votre nom"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+216 XX XXX XXX"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Sujet de votre message"
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Votre message..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-4 rounded-lg font-semibold text-lg transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Envoyer le message
              </button>
            </div>
          </div>

          {/* Additional Info & Social */}
          <div className="space-y-6">
            {/* Map Placeholder */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100 h-[400px] flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-slate-900 mb-2">
                  Notre Localisation
                </h3>
                <p className="text-slate-600">
                  Avenue Habib Bourguiba
                  <br />
                  Tunis 1000, Tunisie
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                Suivez-nous
              </h3>
              <div className="flex gap-4">
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer">
                  <Facebook className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer">
                  <Instagram className="w-6 h-6 text-white" />
                </a>
                <a href="#" className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center hover:shadow-lg transition-all cursor-pointer">
                  <Linkedin className="w-6 h-6 text-white" />
                </a>
              </div>
              <p className="text-slate-600 mt-6">
                Restez informé de nos actualités, conseils santé et événements spéciaux
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">Logo</span>
          </div>
          <p className="text-slate-600 mb-4">
            The Best Medical Center - Bringing health to life for the whole family
          </p>
          <div className="border-t border-slate-200 pt-4">
            <p className="text-slate-500 text-sm">
              © 2025 Medi. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}