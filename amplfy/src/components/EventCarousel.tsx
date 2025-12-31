import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { events } from "../data/events";
import EventPoster from "./EventPoster";
import "../styles/carousel.css";

const SLIDE_WIDTH = 400;
const SLIDE_SPACING = 10; // closer spacing
const AUTOPLAY_DELAY = 4000;

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset autoplay timer
  const resetAutoplay = () => {
    if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    if (!isDragging) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }, AUTOPLAY_DELAY);
    }
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) clearInterval(autoplayTimerRef.current);
    };
  }, [isDragging]);

  const handleDragEnd = (info: any) => {
    setIsDragging(false);
    const threshold = 50;
    const velocity = info.velocity.x;

    if (Math.abs(info.offset.x) > threshold || Math.abs(velocity) > 500) {
      if (info.offset.x > 0 || velocity > 0) {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
      } else {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }
    }
    resetAutoplay();
  };

  return (
    <div className="carousel">
      <motion.div
        className="carousel__container"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
      >
        {events.map((event, index) => {
          let offset = index - currentIndex;

          // Wrap around for infinite loop
          if (offset > events.length / 2) offset -= events.length;
          if (offset < -events.length / 2) offset += events.length;

          return <CarouselSlide key={event.id} event={event} offset={offset} />;
        })}
      </motion.div>
    </div>
  );
}

type CarouselSlideProps = {
  event: (typeof events)[0];
  offset: number;
};

function CarouselSlide({ event, offset }: CarouselSlideProps) {
  const progress = useMotionValue(offset);
  const slideSpacing = SLIDE_WIDTH + SLIDE_SPACING;

  // Smoothly animate to new offset whenever it changes
  useEffect(() => {
    animate(progress, offset, { type: "spring", stiffness: 300, damping: 30 });
  }, [offset, progress]);

  // Base X position
  const x = useTransform(progress, (val) => val * slideSpacing);

  // Scale and opacity for side slides
  const scale = useTransform(
    progress,
    [-2, -1, 0, 1, 2],
    [0.85, 0.9, 1, 0.9, 0.85]
  );
  const opacity = useTransform(
    progress,
    [-2, -1, 0, 1, 2],
    [0.4, 0.7, 1, 0.7, 0.4]
  );
  const blur = useTransform(progress, [-2, -1, 0, 1, 2], [3, 1.5, 0, 1.5, 3]);
  const rotateY = useTransform(progress, [-1, 0, 1], [-15, 0, 15]);
  const zIndex = offset === 0 ? 3 : Math.abs(offset) === 1 ? 2 : 1;

  const finalBlur = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="carousel__slide"
      style={{
        x,
        scale,
        opacity,
        rotateY,
        filter: finalBlur,
        zIndex,
      }}
    >
      <EventPoster event={event} />
    </motion.div>
  );
}
