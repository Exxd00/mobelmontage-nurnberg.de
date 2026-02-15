"use client";

import { PhoneCall, FileText, Wrench } from "lucide-react";
import { howWeWorkSteps } from "@/lib/data";

const icons = [PhoneCall, FileText, Wrench];

export default function HowWeWork() {
  return (
    <section className="section-padding">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            So funktioniert es
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            In nur 3 einfachen Schritten zu Ihrer perfekt montierten Einrichtung
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-6 lg:gap-8 stagger-grid">
          {howWeWorkSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <div
                key={step.step}
                className="relative glass-card rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8 text-center"
              >
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-7 h-7 md:w-10 md:h-10 gradient-bg rounded-full flex items-center justify-center text-white font-bold text-sm md:text-lg shadow-lg">
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-5 rounded-xl md:rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="font-bold text-sm md:text-lg lg:text-xl mb-2 md:mb-3">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm lg:text-base text-muted-foreground hidden sm:block">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Connector Lines (Desktop Only) */}
        <div className="hidden lg:flex justify-center items-center -mt-36 mb-28 relative z-0">
          <div className="w-1/4 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-primary/30" />
          <div className="w-1/4 h-0.5 bg-gradient-to-r from-primary/30 via-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
