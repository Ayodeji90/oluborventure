import { Target, Eye, HeartHandshake, Users, Award, Clock, Globe } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import CTAButton from "@/components/CTAButton";

const whyUs = [
  { icon: Users, title: "Experienced Counselors", desc: "Years of hands-on admissions and visa experience." },
  { icon: Target, title: "Tailored Guidance", desc: "Every plan is built around your profile and budget." },
  { icon: Clock, title: "Fast Turnaround", desc: "We respond within 24 hours, always." },
  { icon: Globe, title: "Global Network", desc: "Partner universities and employers across 50+ countries." },
];

const values = [
  "Integrity — transparent processes, honest advice",
  "Excellence — consistent, quality service delivery",
  "Empathy — we treat your dream like our own",
  "Reliability — solutions you can trust, end to end",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        crumb="About Us"
        title="Where Better Futures Begin"
        description="Olubor Ventures and Educational Consult (formerly Future Builders Educational Institute) is your trusted partner in achieving international education and career goals."
      />

      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          <div className="bg-cream rounded-2xl p-8 border border-orange-100">
            <Target className="w-8 h-8 text-orange mb-4" />
            <h3 className="text-xl font-bold text-purple mb-2">Our Mission</h3>
            <p className="text-gray-600">
              To make global education and careers accessible through personalized guidance —
              admissions, funding, visas, and placements — delivered with integrity and care.
            </p>
          </div>
          <div className="bg-cream rounded-2xl p-8 border border-orange-100">
            <Eye className="w-8 h-8 text-orange mb-4" />
            <h3 className="text-xl font-bold text-purple mb-2">Our Vision</h3>
            <p className="text-gray-600">
              To be Africa's most trusted bridge to global opportunity, helping people
              expand their horizons beyond borders.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-purple text-center mb-12">Why Choose Us?</h2>
          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {whyUs.map((w) => (
              <div key={w.title} className="card-hover bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm">
                <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center mx-auto mb-4">
                  <w.icon className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-bold text-purple mb-2">{w.title}</h4>
                <p className="text-sm text-gray-600">{w.desc}</p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="gradient-bg rounded-2xl p-10 grid grid-cols-2 gap-6 text-center">
              {[
                { n: "500+", l: "Students Placed" },
                { n: "50+", l: "Partner Universities" },
                { n: "95%", l: "Success Rate" },
                { n: "10+", l: "Years Experience" },
              ].map((s) => (
                <div key={s.l} className="bg-white/25 rounded-xl py-6">
                  <div className="text-3xl font-extrabold text-white">{s.n}</div>
                  <div className="text-white/90 text-sm mt-1">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="bg-purple text-white rounded-2xl p-10">
              <HeartHandshake className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-xl font-bold mb-4">Our Core Values</h3>
              <ul className="space-y-3 text-sm opacity-90">
                {values.map((v) => (
                  <li key={v} className="flex gap-2">
                    <Award className="w-4 h-4 text-gold shrink-0 mt-0.5" /> {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center">
            <CTAButton href="/contact" variant="primary">Start Your Journey</CTAButton>
          </div>
        </div>
      </section>
    </>
  );
}
