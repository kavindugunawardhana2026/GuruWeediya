import type { Metadata } from "next";
import { Shield, Target, Users, Heart } from "lucide-react";
import Card from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about GuruWeediya.lk — Sri Lanka's B2B platform for education.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">About GuruWeediya.lk</h1>
        <p className="text-lg text-slate-400 leading-relaxed">
          We&apos;re on a mission to transform how tuition teachers and educational
          institutes connect in Sri Lanka — making the process transparent,
          efficient, and trustworthy.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {[
          {
            icon: Target,
            title: "Our Mission",
            description:
              "To create Sri Lanka's most trusted platform where qualified teachers find meaningful teaching opportunities and institutes discover exceptional talent.",
          },
          {
            icon: Shield,
            title: "Trust & Verification",
            description:
              "Every teacher on our platform undergoes a verification process. Institutes can review profiles, demo lessons, and credentials before connecting.",
          },
          {
            icon: Users,
            title: "Community First",
            description:
              "We're building more than a platform — we're building a community of educators who are passionate about shaping Sri Lanka's future.",
          },
          {
            icon: Heart,
            title: "Made in Sri Lanka",
            description:
              "Built by Sri Lankans, for Sri Lankans. We understand the local education landscape, the subjects, the mediums, and the districts.",
          },
        ].map((item) => (
          <Card key={item.title} hover>
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-500/10 mb-4">
              <item.icon className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              {item.description}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
