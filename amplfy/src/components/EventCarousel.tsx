import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { events } from "../data/events";
import EventPoster from "./EventPoster";
import "../styles/carousel.css";

const SLIDE_WIDTH = 400;
const SLIDE_SPACING = 60;
const AUTOPLAY_DELAY = 4000;

export default function EventCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const autoplayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset autoplay timer
  const resetAutoplay = () => {
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current);
    }
    if (!isDragging) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
      }, AUTOPLAY_DELAY);
    }
  };

  useEffect(() => {
    resetAutoplay();
    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [isDragging]);

  const handleDragEnd = (event: any, info: any) => {
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
          const offset = index - currentIndex;

          // Handle wrapping for infinite loop effect
          let adjustedOffset = offset;
          if (offset > events.length / 2) {
            adjustedOffset = offset - events.length;
          } else if (offset < -events.length / 2) {
            adjustedOffset = offset + events.length;
          }

          return (
            <CarouselSlide
              key={event.id}
              event={event}
              offset={adjustedOffset}
            />
          );
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

  useEffect(() => {
    progress.set(offset);
  }, [offset, progress]);

  const absOffset = Math.abs(offset);
  const slideSpacing = SLIDE_WIDTH + SLIDE_SPACING;

  // Position slide relative to center
  const baseX = useTransform(progress, (val) => val * slideSpacing);

  const scale = useTransform(
    progress,
    [-2, -1, 0, 1, 2],
    [0.75, 0.85, 1, 0.85, 0.75]
  );
  const opacity = useTransform(
    progress,
    [-2, -1, 0, 1, 2],
    [0.3, 0.6, 1, 0.6, 0.3]
  );
  const blur = useTransform(progress, [-2, -1, 0, 1, 2], [3, 2, 0, 2, 3]);
  const rotateY = useTransform(progress, [-1, 0, 1], [-25, 0, 25]);
  const zIndex = offset === 0 ? 3 : absOffset === 1 ? 2 : 1;

  const finalX = useTransform(progress, (val) => {
    const base = val * slideSpacing;
    let trans = 0;
    if (val === -1) trans = -120;
    else if (val === 1) trans = 120;
    return base + trans;
  });

  const finalBlur = useTransform(blur, (b) => `blur(${b}px)`);

  return (
    <motion.div
      className="carousel__slide"
      style={{
        x: finalX,
        scale,
        opacity,
        rotateY,
        filter: finalBlur,
        zIndex,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.9,
      }}
    >
      <EventPoster event={event} />
    </motion.div>
  );
}
