import testimonialAnim from "@/../public/media/testimonial.json";
import { testimonialApi } from "@/api/content";
import type { Testimonial } from "@repo/types";
import { animate, motion, useMotionValue } from "framer-motion";
import Lottie from "lottie-react";
import { Briefcase, CircleCheck, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// Brand Colors
const COLORS = {
  red: "#C00000",
  blue: "#1C2852",
  beige: "#C4B696",
  gray: "#E6E6E6",
  white: "#ffffff",
  black: "#000000",
};

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mx-2 mb-4 transition duration-300 hover:brightness-110">
    <div className="flex items-center justify-center gap-2 mb-4">
      <CircleCheck className="w-5 h-5" style={{ stroke: COLORS.red }} />
      <h3 className="font-semibold text-gray-900 text-center text-sm">
        {testimonial.title}
      </h3>
    </div>

    <p className="text-gray-800 text-center italic text-sm leading-relaxed mb-4">
      "{testimonial.text}"
    </p>

    <div className="mt-auto text-center space-y-1">
      <div className="flex items-center justify-center gap-2 text-blue-900 font-medium text-sm">
        <User className="w-4 h-4" style={{ stroke: COLORS.red }} />
        <span>{testimonial.name}</span>
      </div>
      <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
        <Briefcase className="w-4 h-4" style={{ stroke: COLORS.red }} />
        <span>{testimonial.position}</span>
      </div>
    </div>
  </div>
);

const InfiniteScrollColumn = ({
  testimonials,
  direction = "up",
  duration = 25, // Adjust speed here
  isPaused,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      setHeight(containerRef.current.scrollHeight / 2);
    }
  }, [testimonials.length]);

  useEffect(() => {
    let controls;
    if (height > 0 && !isPaused) {
      // Start with a small offset so it looks like it's coming from inside
      const initialY = direction === "up" ? 50 : -50;
      const from = direction === "up" ? initialY : -height - initialY;
      const to = direction === "up" ? -height - initialY : initialY;

      controls = animate(y, [from, to], {
        ease: "linear",
        duration,
        repeat: Infinity,
      });
    }
    if (isPaused && controls) controls.stop();

    return () => controls && controls.stop();
  }, [isPaused, height, direction, duration, y]);

  const loopedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative h-[600px] overflow-hidden">
      {/* Gradient masks for smooth fade-in/out */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-[#E6E6E6] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#E6E6E6] to-transparent z-10 pointer-events-none"></div>

      <motion.div
        className="flex flex-col"
        style={{ y, willChange: "transform" }}
        ref={containerRef}
      >
        {loopedTestimonials.map((testimonial, idx) => (
          <TestimonialCard key={idx} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  );
};

export default function Testimonial() {
  const [isPaused, setIsPaused] = useState(false);
  const [dynamicTestimonials, setDynamicTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setIsLoading(true);
      const data = await testimonialApi.getAll();
      if (data && data.length > 0) {
        setDynamicTestimonials(data);
      } else {
        toast.error("No testimonials found.");
      }
    } catch (error) {
      toast.error("Failed to load testimonials.");
      console.error("Error loading testimonials:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || dynamicTestimonials.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 text-gray-600">
        Loading testimonials...
      </div>
    );
  }

  const displayTestimonials = dynamicTestimonials.map((t) => ({
    title: t.title,
    text: t.text ?? t.review ?? "",
    name: t.name,
    position: t.position,
  }));

  return (
    <div
      className="relative w-full overflow-hidden max-w-6xl mx-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 flex flex-col items-start space-y-6 p-6">
          <div className="w-56 md:w-72 mx-auto lg:mx-0">
            <Lottie animationData={testimonialAnim} loop />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-blue-900 text-center lg:text-left">
            What Our Subscribers Say
          </h2>
          <p className="text-gray-700 text-center lg:text-left">
            Real stories from real investors who use{" "}
            <span className="font-semibold">Bastion CORE</span> to make smarter
            investment decisions. Trusted insights, practical research, and
            results that matter.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left column scrolls UP (from inside bottom) */}
          <InfiniteScrollColumn
            testimonials={displayTestimonials}
            direction="up"
            duration={25}
            isPaused={isPaused}
          />
          {/* Right column scrolls DOWN (from inside top) */}
          <InfiniteScrollColumn
            testimonials={displayTestimonials}
            direction="down"
            duration={25}
            isPaused={isPaused}
          />
        </div>
      </div>
    </div>
  );
}
