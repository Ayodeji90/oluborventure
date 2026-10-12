import Link from "next/link";
import Image from "next/image";
import { GraduationCap, PiggyBank, Briefcase, Star, CheckCircle2, Globe, Users, Award, ArrowRight } from "lucide-react";
import EligibilityWidget from "@/components/EligibilityWidget";
import CTAButton from "@/components/CTAButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import { services } from "@/data/services";
import { destinations } from "@/data/destinations";
import { testimonials } from "@/data/testimonials";

const iconMap = {
  graduation: GraduationCap,
  money: PiggyBank,
  plane: Briefcase,
};

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-purple pt-36 pb-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 80% 20%, #6b2d8f 0%, transparent 60%), radial-gradient(ellipse at 10% 80%, #ffa500 0%, transparent 50%)",
          }}
        />
        <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gold/20 text-gold rounded-full text-sm font-medium mb-6">
                Formerly Future Builders Educational Institute
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-5">
                Your Gateway to <span className="text-gold">Global Opportunities</span>
              </h1>
              <p className="text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
                Expert guidance for study abroad, scholarships, and international job placements.
                Check your eligibility in under a minute.
              </p>
              <div className="flex flex-wrap gap-6 text-white/90 text-sm font-medium mb-8">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold" /> 500+ Students Placed
                </span>
                <span className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-gold" /> 50+ Countries
                </span>
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold" /> 95% Success Rate
                </span>
              </div>
              <CTAButton href="/services" variant="gradient">
                Explore Services <ArrowRight className="inline w-5 h-5 ml-1" />
              </CTAButton>
            </div>
            <div className="lg:pl-6">
              <EligibilityWidget />
            </div>
          </div>
        </div>
      </section>

      {/* Destinations strip */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-purple mb-3">Destinations to Explore</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Study, work, and build a future in the world's most welcoming countries.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {destinations.map((d) => (
              <Link
                key={d.name}
                href="/destinations"
                className="card-hover bg-cream rounded-2xl p-5 text-center border border-orange-100"
              >
                <span className="text-4xl">{d.flag}</span>
                <h3 className="mt-3 font-bold text-purple text-sm">{d.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{d.highlights[0]}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-gray-50 px-4" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-purple mb-4">What We Offer</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to go global — education, funding, visas, careers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {services.slice(0, 3).map((s) => {
              const Icon = iconMap[s.icon];
              return (
                <div key={s.slug} className="card-hover bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple mb-3">{s.title}</h3>
                  <p className="text-gray-600 mb-5">{s.description}</p>
                  <ul className="space-y-2 text-gray-600">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-orange" /> {b}
                      </li>
                    ))}
                  </ul>
                  <Link href={`/services/${s.slug}`} className="inline-flex items-center gap-1 text-purple font-semibold mt-6 hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-10">
            <CTAButton href="/services" variant="secondary">View All Services</CTAButton>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 gradient-bg px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: "500+", l: "Students Placed", Icon: Users },
            { n: "50+", l: "Partner Universities", Icon: Globe },
            { n: "95%", l: "Success Rate", Icon: Award },
            { n: "10+", l: "Years Experience", Icon: Star },
          ].map(({ n, l, Icon }) => (
            <div key={l} className="bg-white/20 rounded-2xl py-8 px-4 backdrop-blur-sm">
              <Icon className="w-8 h-8 mx-auto text-purple mb-3" />
              <div className="text-4xl font-extrabold text-white">{n}</div>
              <div className="text-white/90 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-purple mb-4">Loved By Students Everywhere</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Real people, real admissions, real careers abroad.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="card-hover bg-cream p-8 rounded-3xl border border-orange-100">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple rounded-full flex items-center justify-center text-white font-bold">
                    {t.initials}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-purple">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.detail}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-gray-600 italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 bg-purple text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Journey Starts Here</h2>
          <p className="text-lg opacity-80 mb-8">
            Ready to start your journey? Contact us today for a free consultation.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <CTAButton href="/contact" variant="gradient">Contact Us</CTAButton>
            <CTAButton href="/eligibility" variant="secondary">Check Eligibility</CTAButton>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
