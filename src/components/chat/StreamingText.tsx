import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

interface StreamingTextProps {
  text: string;
}

const StreamingText: React.FC<StreamingTextProps> = ({ text }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      const words = text.split(' ');
      textRef.current.innerHTML = words.map(word => `<span>${word}</span>`).join(' ');

      const spans = textRef.current.querySelectorAll('span');
      gsap.fromTo(spans, 
        { y: 20, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.05, 
          duration: 0.5, 
          ease: 'power3.out' 
        }
      );
    }
  }, [text]);

  return <div ref={textRef} className="text-apple-text"></div>;
};

export default StreamingText;