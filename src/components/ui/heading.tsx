import { cn } from "@/lib/utils";
import React, { JSX } from "react";

type HeadingProps = {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  center?: boolean;
  className?: string;
};

type SubHeading = {
  text: string;
  className?: string;
};

const headingSizeMap: Record<1 | 2 | 3 | 4 | 5 | 6, string> = {
  1: "text-[2rem] sm:text-[2.5rem] font-bold tracking-tight",
  2: "text-[1.55rem] sm:text-[1.75rem] font-bold ",
  3: "text-xl sm:text-[1.5rem] font-bold tracking-tight",
  4: "text-lg sm:text-xl font-medium tracking-tight",
  5: "text-base sm:text-lg font-medium",
  6: "text-base sm:text-lg font-medium",
};

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  center = false,
  className = "",
}) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  const headingClasses = headingSizeMap[level] || headingSizeMap[1];

  return (
    <HeadingTag
      className={`${headingClasses} ${
        center ? "text-center" : "text-left"
      } ${cn("text-foreground block", className)}`}
    >
      {children}
    </HeadingTag>
  );
};

const Subtitle: React.FC<SubHeading> = ({ text, className = "" }) => (
  <p className={`mt-1 text-sm text-muted-foreground ${className}`}>{text}</p>
);

export { Heading, Subtitle };
