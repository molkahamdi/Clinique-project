import { Heart, Brain, Activity, Baby, Eye, Pill, Stethoscope, Syringe, User, Clock, Award, Users } from "lucide-react"

export default function DepartmentsPage() {
  const departments = [
    {
      icon: Heart,
      title: "Cardiologie",
      description: "Soins cardiaques spécialisés avec technologies de pointe pour le diagnostic et traitement",
      services: ["ECG", "Échographie cardiaque", "Consultation cardiaque"],
      color: "from-red-400 to-rose-500"
    },
    {
      icon: Brain,
      title: "Neurologie",
      description: "Diagnostic et traitement des troubles du système nerveux central et périphérique",
      services: ["IRM cérébrale", "EEG", "Consultation neurologique"],
      color: "from-purple-400 to-purple-600"
    },
    {
      icon: Baby,
      title: "Pédiatrie",
      description: "Soins complets pour la santé et le bien-être de vos enfants de 0 à 18 ans",
      services: ["Vaccinations", "Suivi de croissance", "Consultations"],
      color: "from-pink-400 to-pink-600"
    },
    {
      icon: Activity,
      title: "Médecine Générale",
      description: "Soins de santé primaires pour toute la famille avec un suivi personnalisé",
      services: ["Consultation générale", "Bilans de santé", "Prévention"],
      color: "from-cyan-400 to-blue-500"
    },
    {
      icon: Eye,
      title: "Ophtalmologie",
      description: "Soins oculaires complets, de l'examen de routine à la chirurgie avancée",
      services: ["Examen de la vue", "Chirurgie laser", "Traitement cataracte"],
      color: "from-blue-400 to-indigo-500"
    },
    {
      icon: Pill,
      title: "Pharmacie",
      description: "Service pharmaceutique complet avec conseils personnalisés et disponibilité 24/7",
      services: ["Médicaments", "Conseils", "Livraison"],
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Stethoscope,
      title: "Médecine Interne",
      description: "Diagnostic et traitement des maladies complexes affectant plusieurs organes",
      services: ["Diagnostic complexe", "Suivi chronique", "Consultation"],
      color: "from-orange-400 to-orange-600"
    },
    {
      icon: Syringe,
      title: "Laboratoire",
      description: "Analyses médicales complètes avec résultats rapides et précis",
      services: ["Analyses sanguines", "Tests PCR", "Biochimie"],
      color: "from-teal-400 to-cyan-600"
    },
    {
      icon: User,
      title: "Dermatologie",
      description: "Soins de la peau, traitement des affections cutanées et esthétique médicale",
      services: ["Consultation peau", "Traitement acné", "Esthétique"],
      color: "from-yellow-400 to-amber-500"
    }
  ]

  const features = [
    {
      icon: Clock,
      title: "Disponible 24/7",
      description: "Service d'urgence disponible jour et nuit"
    },
    {
      icon: Award,
      title: "Équipe qualifiée",
      description: "Médecins experts et certifiés"
    },
    {
      icon: Users,
      title: "Soins personnalisés",
      description: "Approche centrée sur le patient"
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
            <a href="/departments" className="px-5 py-2 bg-cyan-400 hover:bg-cyan-500 text-white rounded-full transition-all cursor-pointer font-medium">
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
            <span className="text-cyan-600">🏥</span>
            <span>Nos départements</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Spécialités{" "}
            <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              médicales
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos départements spécialisés équipés des dernières technologies 
            et dirigés par des experts médicaux qualifiés
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div key={index} className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg border border-slate-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">
                  {feature.description}
                </p>
              </div>
            )
          })}
        </div>
      </section>

      {/* Departments Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept, index) => {
            const Icon = dept.icon
            return (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 hover:shadow-2xl transition-all">
                <div className={`w-16 h-16 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mb-5`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {dept.title}
                </h3>
                <p className="text-slate-600 mb-5 leading-relaxed">
                  {dept.description}
                </p>
                <div className="border-t border-slate-100 pt-5">
                  <p className="text-sm font-semibold text-slate-700 mb-3">Services inclus:</p>
                  <div className="space-y-2">
                    {dept.services.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                        <span className="text-slate-600 text-sm">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-6 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white py-3 rounded-lg font-semibold transition-all">
                  Prendre rendez-vous
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">
            Besoin d'une consultation ?
          </h2>
          <p className="text-xl mb-8 text-cyan-50">
            Prenez rendez-vous avec nos spécialistes dès aujourd'hui
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/auth/register">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-cyan-50 transition-colors shadow-lg cursor-pointer">
                Créer un compte
              </button>
            </a>
            <a href="/contact">
              <button className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-colors border-2 border-white cursor-pointer">
                Nous contacter
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl p-12 shadow-xl border border-slate-100">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Pourquoi choisir nos départements ?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Équipements modernes</h3>
              <p className="text-slate-600 leading-relaxed">
                Chaque département est équipé des dernières technologies médicales pour assurer 
                des diagnostics précis et des traitements efficaces.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Équipe expérimentée</h3>
              <p className="text-slate-600 leading-relaxed">
                Nos médecins sont des experts dans leurs domaines respectifs, avec des années 
                d'expérience et une formation continue.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Approche personnalisée</h3>
              <p className="text-slate-600 leading-relaxed">
                Nous croyons en une approche centrée sur le patient, adaptant nos soins à vos 
                besoins spécifiques.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Coordination des soins</h3>
              <p className="text-slate-600 leading-relaxed">
                Nos départements travaillent ensemble pour assurer une prise en charge globale 
                et coordonnée de votre santé.
              </p>
            </div>
          </div>
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