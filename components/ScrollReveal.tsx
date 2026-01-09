
import React, { useEffect, useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  animation?: 'slide-up' | 'scale';
  delay?: number;
  className?: string;
}

export const ScrollReveal: React.FC<Props> = ({ 
  children, 
  animation = 'slide-up', 
  delay = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    const current = domRef.current;
    if (current) observer.observe(current);

    return () => {
      if (current) observer.unobserve(current);
    };
  }, [delay]);

  const animationClass = animation === 'scale' ? 'reveal-scale' : 'reveal';

  return (
    <div
      ref={domRef}
      className={`${animationClass} ${isVisible ? 'active' : ''} ${className}`}
    >
      {children}
    </div>
  );
};
