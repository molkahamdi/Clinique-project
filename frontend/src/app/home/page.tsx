import { Shield, Zap, Users, Heart, Award, Clock, Calendar, Star, Phone, Mail, MapPin, ChevronRight } from "lucide-react"

export default function HomePage() {
  const stats = [
    { number: "15,000+", label: "Patients satisfaits" },
    { number: "50+", label: "Médecins experts" },
    { number: "24/7", label: "Support disponible" },
    { number: "98%", label: "Taux de satisfaction" }
  ]

  const services = [
    { icon: Heart, title: "Cardiologie", description: "Soins cardiaques complets avec technologies de pointe" },
    { icon: Award, title: "Pédiatrie", description: "Soins spécialisés pour la santé de vos enfants" },
    { icon: Clock, title: "Urgences", description: "Service d'urgence disponible 24h/24 et 7j/7" },
    { icon: Calendar, title: "Consultations", description: "Rendez-vous en ligne faciles et rapides" }
  ]

  const testimonials = [
    { name: "Sarah Martin", role: "Patiente", rating: 5, comment: "Excellente expérience, personnel très professionnel et à l'écoute." },
    { name: "Ahmed Ben Ali", role: "Patient", rating: 5, comment: "Des soins de qualité et un suivi personnalisé remarquable." },
    { name: "Marie Dubois", role: "Patiente", rating: 5, comment: "Je recommande vivement ce centre médical à tous." }
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
            <span className="text-xl font-bold text-slate-800">Médi</span>
          </a>

          <div className="hidden md:flex items-center gap-2">
            <a href="/" className="px-5 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full transition-all cursor-pointer font-medium">
              Home
            </a>
            <a href="/about" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              Features
            </a>
            <a href="/services" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              About
            </a>
            <a href="/contact" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-700 shadow-sm border border-slate-200">
              <span className="text-xl">🎉</span>
              <span className="font-medium">Rejoignez-nous aujourd'hui</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight">
              Bringing{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                health
              </span>
              <br />
              to life for the whole family
            </h1>

            <p className="text-xl text-slate-600 leading-relaxed">
              Créez votre compte et accédez à une expérience unique de santé et de bien-être avec nos services médicaux de pointe
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/auth/register">
                <button className="flex items-center justify-center bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-lg px-8 py-4 rounded-full transition-all cursor-pointer shadow-lg hover:shadow-xl font-medium w-full sm:w-auto">
                  <Zap className="w-5 h-5 mr-2" />
                  Commencer maintenant
                </button>
              </a>
              <a href="/contact">
                <button className="flex items-center justify-center bg-white hover:bg-slate-50 text-slate-700 text-lg px-8 py-4 rounded-full transition-all cursor-pointer border-2 border-slate-200 hover:border-cyan-400 font-medium w-full sm:w-auto">
                  En savoir plus
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              </a>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Sécurisé et fiable
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Vos données sont protégées avec un cryptage de niveau bancaire
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Rapide et simple
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Inscription en quelques secondes seulement
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                Communauté active
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Rejoignez des milliers d'utilisateurs satisfaits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 backdrop-blur-sm py-12 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-cyan-600 font-semibold mb-2">NOS SERVICES</p>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Services médicaux de qualité
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Nous offrons une gamme complète de services médicaux pour répondre à tous vos besoins de santé
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 my-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-cyan-600 font-semibold mb-2">TÉMOIGNAGES</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Ce que disent nos patients
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 mb-4 italic">"{testimonial.comment}"</p>
                <div>
                  <div className="font-semibold text-slate-900">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Prêt à commencer votre parcours santé ?
          </h2>
          <p className="text-xl mb-8 text-cyan-50">
            Inscrivez-vous maintenant et bénéficiez d'une consultation gratuite
          </p>
          <a href="/auth/register">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-cyan-50 transition-colors shadow-lg cursor-pointer">
              Créer mon compte gratuitement
            </button>
          </a>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Téléphone</h3>
            <p className="text-slate-600">+216 71 123 456</p>
            <p className="text-slate-600">+216 71 123 457</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Email</h3>
            <p className="text-slate-600">contact@medi.tn</p>
            <p className="text-slate-600">support@medi.tn</p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-slate-900 mb-2">Adresse</h3>
            <p className="text-slate-600">Avenue Habib Bourguiba</p>
            <p className="text-slate-600">Tunis, Tunisie</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-semibold">Medi</span>
          </div>
          <p className="text-gray-400 mb-4">
            The Best Medical Center - Bringing health to life for the whole family
          </p>
          <div className="border-t border-slate-800 pt-4">
            <p className="text-gray-500 text-sm">
              © 2025 Medi. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}