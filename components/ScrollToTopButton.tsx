
import React, { useState, useEffect } from 'react';
import { ICONS } from '../constants';
import { cx, styles } from '../styles';

const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    const mainContent = document.querySelector('main');
    if(mainContent){
        mainContent.addEventListener('scroll', toggleVisibility);
    }
    return () => {
        if(mainContent){
            mainContent.removeEventListener('scroll', toggleVisibility);
        }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cx('fixed bottom-5 right-24 z-40 flex h-11 w-11 items-center justify-center rounded-xl bg-foreground text-white shadow-lg transition-[opacity,transform,background-color] duration-200 hover:-translate-y-1 hover:bg-foreground/90', isVisible ? 'opacity-100' : 'pointer-events-none opacity-0')}
      aria-label="Scroll to top"
    >
      {ICONS.chevronUp}
    </button>
  );
};

export default ScrollToTopButton;
