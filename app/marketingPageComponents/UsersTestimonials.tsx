"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import testimonials from "../data/Testimonials";
import MainButton from "../components/MainButton";
import Image from "next/image";

export default function UsersTestimonials() {
  const [move, setMove] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const initialCount = 6;
  const displayedTestimonials = showAll
    ? testimonials
    : testimonials.slice(0, initialCount);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-12 text-center bg-gradient-to-tl from-background via-background to-primary/40">
        <div className="text-left p-8">
          <span className="flex justify-end text-sm font-semibold uppercase tracking-[0.3em] text-primary/80">
            Testimonials
          </span>
        </div>
        <div className="flex flex-col gap-4 text-center">
          <h3 className="text-3xl font-semibold text-foreground lg:text-4xl">
            Loved by customers. Trusted by providers.
          </h3>
          <p className="text-base text-gray-400 lg:text-lg">
            Hear how customers find the right providers — and how providers stay
            booked without the hassle.
          </p>
        </div>
        <div className="flex justify-center">
          <Link
            onClick={() => setMove(!move)}
            href="/"
            className="bg-primary cursor-pointer hover:bg-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all hover:scale-105 flex items-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            Get Started Free
            <motion.div
              animate={{ x: move ? 200 : 0, opacity: move ? 0 : 1 }}
              transition={{ type: "spring", stiffness: 80 }}
            >
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </Link>
        </div>
      </div>
      <div className="bg-background text-white text-center my-5">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 px-6 lg:px-20">
          {displayedTestimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              className="mb-4 p-4 border-[1px] rounded-2xl border-gray-400 break-inside-avoid"
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <div>
                    <Image
                      src={`/${testimonial.image}`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full"
                      width={48}
                      height={48}
                    />
                  </div>
                  <div>
                    <p className="text-foreground text-lg font-bold">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-500 text-left">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-foreground text-left">{testimonial.review}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {!showAll && testimonials.length > initialCount && (
          <MainButton
            className="my-6 cursor-pointer"
            onClick={() => setShowAll(true)}
          >
            Show More
          </MainButton>
        )}
      </div>
    </div>
  );
}
