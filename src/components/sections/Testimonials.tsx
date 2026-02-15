"use client";

import { Star, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function Testimonials() {
  const displayTestimonials = testimonials.slice(0, 3);

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
            Was unsere Kunden sagen
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Über {testimonials.length * 100}+ positive Bewertungen
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 lg:gap-6 stagger-grid">
          {displayTestimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="glass-card rounded-xl md:rounded-2xl p-4 md:p-6 card-hover relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-3 right-3 md:top-4 md:right-4 text-primary/10">
                <Quote className="w-6 h-6 md:w-10 md:h-10" />
              </div>

              {/* Stars */}
              <div className="flex gap-0.5 mb-2 md:mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 md:w-4 md:h-4 fill-primary text-primary"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-xs md:text-sm lg:text-base text-foreground mb-3 md:mb-4 line-clamp-3 md:line-clamp-none">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs md:text-sm">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-xs md:text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
