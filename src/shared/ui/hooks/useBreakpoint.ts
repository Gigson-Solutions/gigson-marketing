import { useEffect, useState } from 'react';

const BREAKPOINTS = { sm: 640, md: 768, lg: 1024, xl: 1280 };

const getDeviceConfig = (width: number) => {
  if (width < BREAKPOINTS.sm) return 'mobile';
  if (width >= BREAKPOINTS.sm && width < BREAKPOINTS.lg) return 'tablet';
  return 'desktop';
};

export const useBreakpoint = () => {
  const [device, setDevice] = useState(
    getDeviceConfig(typeof window === 'undefined' ? BREAKPOINTS.lg : window.innerWidth)
  );

  useEffect(() => {
    const resizeListener = () => setDevice(getDeviceConfig(window.innerWidth));
    window.addEventListener('resize', resizeListener);
    return () => window.removeEventListener('resize', resizeListener);
  }, []);

  return {
    isMobile: device === 'mobile',
    isTablet: device === 'tablet',
    isDesktop: device === 'desktop',
    device,
  };
};
