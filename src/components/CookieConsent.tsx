import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = (type: 'all' | 'necessary') => {
    localStorage.setItem('cookieConsent', type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-slate-200 p-6 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-sm">
              We use cookies to ensure you get the best experience on our website. 
              By clicking "Accept All", you agree to our use of cookies. 
              See our <Link to="/cookie-policy" className="text-primary underline">Cookie Policy</Link> for more details.
            </p>
            <div className="flex gap-3 shrink-0">
              <button
                onClick={() => handleAccept('necessary')}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
              >
                Only necessary
              </button>
              <button
                onClick={() => handleAccept('all')}
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-full hover:bg-primary/90"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
