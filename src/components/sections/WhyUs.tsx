"use client";

import {
  Clock,
  Shield,
  PiggyBank,
  Users,
  ThumbsUp,
  Truck,
} from "lucide-react";
import { features } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  clock: Clock,
  shield: Shield,
  piggyBank: PiggyBank,
  users: Users,
  thumbsUp: ThumbsUp,
  truck: Truck,
};

export default function WhyUs() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Warum uns wählen?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ihre Vorteile bei Möbelmontage Nürnberg
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5 lg:gap-6 stagger-grid">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];
            return (
              <div
                key={feature.title}
                className="group glass-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover"
              >
                {/* Icon */}
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 rounded-xl md:rounded-2xl gradient-bg flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-sm md:text-base lg:text-lg mb-1 md:mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
