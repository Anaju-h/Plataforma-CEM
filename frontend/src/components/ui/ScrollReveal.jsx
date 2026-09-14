import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef } from "react";

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 34,
  fadeOut = true,
}) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "end 8%"],
  });

  const opacityWithExit = useTransform(
    scrollYProgress,
    [0, 0.14, 0.78, 1],
    [0, 1, 1, 0.15],
  );

  const opacityWithoutExit = useTransform(
    scrollYProgress,
    [0, 0.14],
    [0, 1],
  );

  const initialY =
    direction === "down"
      ? -distance
      : direction === "up"
        ? distance
        : 0;

  const y = useTransform(
    scrollYProgress,
    [0, 0.18, 0.8, 1],
    [
      initialY,
      0,
      0,
      direction === "down"
        ? distance * 0.35
        : -distance * 0.35,
    ],
  );

  const initialX =
    direction === "left"
      ? distance
      : direction === "right"
        ? -distance
        : 0;

  const x = useTransform(
    scrollYProgress,
    [0, 0.18, 0.8, 1],
    [
      initialX,
      0,
      0,
      direction === "left"
        ? -distance * 0.25
        : direction === "right"
          ? distance * 0.25
          : 0,
    ],
  );

  if (reduceMotion) {
    return (
      <div
        ref={ref}
        className={className}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        opacity: fadeOut
          ? opacityWithExit
          : opacityWithoutExit,
        y,
        x,
      }}
    >
      {children}
    </motion.div>
  );
}