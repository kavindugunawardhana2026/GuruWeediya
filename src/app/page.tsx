import {
  GraduationCap,
  Building2,
  Users,
  Search,
  CheckCircle2,
  ArrowRight,
  Star,
  Briefcase,
  Shield,
  Zap,
  Globe,
  TrendingUp,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

export default function Home() {
  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-glow-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-glow-pulse [animation-delay:1.5s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-6 pt-20 pb-28 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-8 animate-fade-in">
            <Zap className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-emerald-300 font-medium">
              Sri Lanka&apos;s #1 Teacher-Institute Platform
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in [animation-delay:0.1s]">
            Where Great Teachers
            <br />
            <span className="text-gradient">Meet Great Institutes</span>
          </h1>

          {/* Subheading */}
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-slate-400 leading-relaxed mb-10 animate-fade-in [animation-delay:0.2s]">
            GuruWeediya.lk connects qualified tuition teachers with educational
            institutes across Sri Lanka. Find your perfect match — faster,
            smarter, verified.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in [animation-delay:0.3s]">
            <Button size="lg" href="/auth/signup" rightIcon={<ArrowRight className="h-5 w-5" />}>
              Join as Teacher
            </Button>
            <Button variant="outline" size="lg" href="/auth/signup">
              Post a Job — Institute
            </Button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-in [animation-delay:0.4s]">
            {[
              { value: "2,500+", label: "Verified Teachers" },
              { value: "450+", label: "Partner Institutes" },
              { value: "1,200+", label: "Jobs Posted" },
              { value: "25", label: "Districts Covered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-gradient">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge variant="info" dot>
              How It Works
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Simple. Smart. Seamless.
            </h2>
            <p className="mt-3 text-slate-400 max-w-xl mx-auto">
              Whether you&apos;re a teacher looking for opportunities or an institute
              searching for talent — we make the connection effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Create Your Profile",
                description:
                  "Sign up as a teacher or institute. Add your subjects, districts, and experience to stand out.",
                step: "01",
              },
              {
                icon: Search,
                title: "Discover & Connect",
                description:
                  "Browse verified teachers or open job listings. Filter by subject, medium, district, and budget.",
                step: "02",
              },
              {
                icon: CheckCircle2,
                title: "Schedule & Collaborate",
                description:
                  "Book interviews, share demo lessons, and finalize partnerships — all in one place.",
                step: "03",
              },
            ].map((item) => (
              <Card key={item.step} hover className="relative group">
                <div className="absolute -top-3 -right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 group-hover:shadow-emerald-500/40 transition-shadow">
                  {item.step}
                </div>
                <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-emerald-500/10 mb-5">
                  <item.icon className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOR TEACHERS / FOR INSTITUTES — Split Section
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* For Teachers */}
            <Card padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl -z-0" />
              <div className="relative z-10">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 mb-6 shadow-lg shadow-emerald-500/20">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  For Teachers
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Showcase your expertise, get verified, and connect with top
                  institutes across all 25 districts in Sri Lanka.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Build a verified professional profile",
                    "Upload YouTube demo lesson links",
                    "Get matched with relevant job openings",
                    "Manage interview schedules effortlessly",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button href="/auth/signup" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Register as Teacher
                </Button>
              </div>
            </Card>

            {/* For Institutes */}
            <Card padding="lg" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl -z-0" />
              <div className="relative z-10">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 mb-6 shadow-lg shadow-blue-500/20">
                  <Building2 className="h-7 w-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  For Institutes
                </h3>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Find qualified, verified teachers for any subject, medium, or
                  district. Post jobs and hire with confidence.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    "Post unlimited job listings",
                    "Browse verified teacher profiles & demos",
                    "Schedule interviews with one click",
                    "Manage multiple branch locations",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-blue-400 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button
                  href="/auth/signup"
                  className="!from-blue-500 !to-indigo-500 !shadow-blue-500/25 hover:!shadow-blue-500/40"
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Register as Institute
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          WHY CHOOSE US
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <Badge variant="success" dot>
              Why Choose Us
            </Badge>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-white">
              Built for Sri Lanka&apos;s Education Ecosystem
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                description: "Every teacher is reviewed and verified before joining.",
              },
              {
                icon: Globe,
                title: "All 25 Districts",
                description: "Coverage across every district in Sri Lanka.",
              },
              {
                icon: Star,
                title: "Demo Lessons",
                description: "YouTube demo links so institutes can preview teaching style.",
              },
              {
                icon: TrendingUp,
                title: "Smart Matching",
                description: "AI-powered recommendations based on subject & location.",
              },
              {
                icon: Briefcase,
                title: "Job Board",
                description: "Institutes post openings, teachers apply directly.",
              },
              {
                icon: Users,
                title: "Interview Scheduling",
                description: "Built-in scheduling with meeting link integration.",
              },
              {
                icon: Zap,
                title: "Instant Notifications",
                description: "Real-time alerts for new matches and messages.",
              },
              {
                icon: Building2,
                title: "Multi-Branch",
                description: "Institutes can manage multiple branch locations.",
              },
            ].map((feature) => (
              <Card key={feature.title} hover className="text-center">
                <div className="mx-auto h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
                  <feature.icon className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-1.5">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA SECTION
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 border-t border-slate-800/50">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="relative rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 p-12 md:p-16 overflow-hidden">
            {/* Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -z-0" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Education?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of teachers and institutes already using
                GuruWeediya.lk to build meaningful partnerships.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" href="/auth/signup" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Get Started Free
                </Button>
                <Button variant="secondary" size="lg" href="/about">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
