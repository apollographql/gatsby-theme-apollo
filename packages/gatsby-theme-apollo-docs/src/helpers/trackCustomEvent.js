import { useEffect } from 'react';

const trackCustomEvent = ({
  category,
  action,
  label,
  value,
}) => {
  useEffect(() => {
    window.gtag !== 'undefined' && window.gtag('event', action, {
      category,
      label,
      value
    });
  });
};

export default trackCustomEvent;