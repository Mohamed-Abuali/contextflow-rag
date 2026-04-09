import { useState, useEffect } from 'react';

const BREAKPOINTS = {
  mobile: '(max-width: 639px)',
  tablet: '(min-width: 640px) and (max-width: 1023px)',
  desktop: '(min-width: 1024px)'
} as const;

type ScreenSize = keyof typeof BREAKPOINTS;

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState<ScreenSize>('desktop');

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia(BREAKPOINTS.mobile).matches) {
        setScreenSize('mobile');
      } else if (window.matchMedia(BREAKPOINTS.tablet).matches) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};
