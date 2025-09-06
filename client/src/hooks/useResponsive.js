import { useMediaQuery } from '@mantine/hooks';
import { BREAKPOINTS } from '../utils/constants';

export const useResponsive = () => {
  const isMobile = useMediaQuery(BREAKPOINTS.mobile);
  const isTablet = useMediaQuery(BREAKPOINTS.tablet);
  const isDesktop = useMediaQuery(BREAKPOINTS.desktop);

  return {
    isMobile,
    isTablet,
    isDesktop,
    fontSize: (mobile, tablet, desktop) => {
      if (isMobile) return mobile;
      if (isTablet) return tablet;
      return desktop || tablet;
    },
    spacing: (mobile, desktop) => {
      return isMobile ? mobile : desktop;
    }
  };
}; 