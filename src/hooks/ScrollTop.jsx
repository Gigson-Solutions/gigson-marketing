import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
function ScrollTop({ children }) {
  const location = useLocation();
  useEffect(() => {
    window.scroll(0, 1);
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [location]);
  return <>{children}</>;
}
export default ScrollTop;
