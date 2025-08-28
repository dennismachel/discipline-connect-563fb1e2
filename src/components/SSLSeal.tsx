import { useEffect } from 'react';

const SSLSeal = () => {
  useEffect(() => {
    // Load trust logo script
    const tlJsHost = window.location.protocol === "https:" 
      ? "https://secure.trust-provider.com/" 
      : "http://www.trustlogo.com/";
    
    const script1 = document.createElement('script');
    script1.src = tlJsHost + 'trustlogo/javascript/trustlogo.js';
    script1.type = 'text/javascript';
    document.head.appendChild(script1);

    script1.onload = () => {
      // Execute TrustLogo function after script loads
      if (window.TrustLogo) {
        window.TrustLogo(
          "https://www.positivessl.com/images/seals/positivessl_trust_seal_lg_222x54.png", 
          "POSDV", 
          "none"
        );
      }
    };

    return () => {
      // Cleanup
      if (script1.parentNode) {
        script1.parentNode.removeChild(script1);
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center py-4">
      <div id="trustlogo" className="ssl-seal"></div>
    </div>
  );
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    TrustLogo: (image: string, type: string, style: string) => void;
  }
}

export { SSLSeal };