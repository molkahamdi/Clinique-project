import { Shield, Heart, Award, Users, Target, Eye, CheckCircle } from "lucide-react"

export default function AboutPage() {
  const values = [
    { icon: Heart, title: "Compassion", description: "Nous traitons chaque patient avec empathie et respect" },
    { icon: Shield, title: "Fiabilité", description: "Des soins de santé de qualité supérieure et sécurisés" },
    { icon: Award, title: "Excellence", description: "Nous visons l'excellence dans tous nos services" },
    { icon: Users, title: "Collaboration", description: "Une équipe médicale coordonnée pour votre bien-être" }
  ]

  const stats = [
    { number: "15+", label: "Années d'expérience" },
    { number: "50+", label: "Médecins experts" },
    { number: "15,000+", label: "Patients satisfaits" },
    { number: "30+", label: "Spécialités médicales" }
  ]

  const achievements = [
    "Certification ISO 9001 pour la qualité des soins",
    "Accréditation nationale de santé",
    "Prix d'excellence en service patient 2024",
    "Technologies médicales de dernière génération"
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
            <a href="/about" className="px-5 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full transition-all cursor-pointer font-medium">
              About
            </a>
            <a href="/departments" className="px-5 py-2 text-slate-700 hover:text-cyan-500 transition-colors cursor-pointer font-medium">
              Departments
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
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-slate-700 mb-6">
            <span className="text-cyan-600">✨</span>
            <span>À propos de nous</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Notre{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Mission
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Nous nous engageons à fournir des soins de santé exceptionnels et accessibles à toutes les familles, 
            avec compassion, excellence et innovation.
          </p>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Notre Mission</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Offrir des soins médicaux de qualité supérieure, centrés sur le patient, 
              en combinant expertise médicale, technologies de pointe et approche humaine. 
              Nous nous efforçons d'améliorer la santé et le bien-être de chaque membre de votre famille.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Notre Vision</h2>
            <p className="text-slate-600 leading-relaxed text-lg">
              Devenir le centre médical de référence en Tunisie, reconnu pour l'excellence 
              de ses soins, l'innovation dans les traitements et la satisfaction de ses patients. 
              Nous aspirons à créer un environnement où la santé et le bien-être sont prioritaires.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 backdrop-blur-sm py-16 mb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Nos Valeurs</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Les principes qui guident notre travail quotidien et notre engagement envers vous
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all text-center">
                <div className="w-16 h-16 bg-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-slate-600">
                  {value.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 text-center">
            Nos Réalisations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <p className="text-slate-700 text-lg">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Rejoignez notre communauté
          </h2>
          <p className="text-xl mb-8 text-cyan-50">
            Inscrivez-vous maintenant et bénéficiez d'une consultation gratuite
          </p>
          <a href="/auth/register">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-50 transition-colors shadow-lg cursor-pointer">
              Créer mon compte gratuitement
            </button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md py-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="text-2xl font-semibold">Logo</span>
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