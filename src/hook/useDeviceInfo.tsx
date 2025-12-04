import { useState, useEffect } from 'react';

// --- Integrated detection function (unchanged) ---
const checkIsMobile = () => {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  const isMobileByUserAgent = Boolean(
    userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i)
  );
  const hasTouchScreen = (
    typeof window !== 'undefined' && 
    ('ontouchstart' in window || navigator.maxTouchPoints > 0 )
  );
  return isMobileByUserAgent || hasTouchScreen;
};
// -----------------------------------

const useDeviceInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: '',
    os: 'Unknown',
    browser: 'Unknown',
    ipAddress: 'Searching...',
    screenWidth: 0,
    isMobile: false,
    deviceType: 'Desktop/Web',
  });

  useEffect(() => {
    // Variables locales pour capturer immédiatement les infos du navigateur
    const userAgent = window.navigator.userAgent;
    const screenWidth = window.innerWidth;
    const mobileStatus = checkIsMobile();
    const deviceType = mobileStatus ? 'Mobile' : 'Desktop/Web';

    // Logique simple pour OS/Browser (pour les inclure aussi)
    const os = userAgent.includes('Win') ? 'Windows' : userAgent.includes('Mac') ? 'macOS' : /Android/.test(userAgent) ? 'Android' : /iPhone|iPad|iPod/.test(userAgent) ? 'iOS' : 'Unknown';
    const browser = userAgent.includes('Chrome') ? 'Chrome' : userAgent.includes('Firefox') ? 'Firefox' : userAgent.includes('Safari') ? 'Safari' : 'Unknown';


    // Appel API pour l'IP
    // ATTENTION: J'ai ajouté 'https://' et '?format=json'
    fetch('https://icanhazip.com/')
      .then(response => {
          if (!response.ok) throw new Error('Network response was not ok');
          return response.text();
      })
      .then(data => {
        // Met à jour TOUT l'état avec les données IP + les données navigateur locales
        setDeviceInfo({
          ipAddress: data || 'Not found',
          userAgent: userAgent,
          screenWidth: screenWidth,
          isMobile: mobileStatus,
          deviceType: deviceType,
          os: os,
          browser: browser
        });
      })
      .catch(error => {
        console.error("Error retrieving IP:", error);
        // Met à jour TOUT l'état, y compris les données locales si l'API échoue
        setDeviceInfo({
            ipAddress: 'API connection error',
            userAgent: userAgent,
            screenWidth: screenWidth,
            isMobile: mobileStatus,
            deviceType: deviceType,
            os: os,
            browser: browser
        });
      });

  }, []); // Le tableau vide assure l'exécution unique au montage

  return deviceInfo;
};

export default useDeviceInfo;