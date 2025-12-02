import { useEffect, useState } from "react";

export default function LoaderUltra({
  loading,
  duration = 500,
  primary = "#b91c1c",      // ta couleur principale
  secondary = "#1e3a8a",    // ta couleur secondaire
}) {
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(0.9);

  useEffect(() => {
    if (!loading) {
      const fadeDuration = duration;
      const interval = 2;
      let elapsed = 0;

      const timer = setInterval(() => {
        elapsed += interval;
        const eased = 1 * (1 - elapsed / fadeDuration);
        setOpacity(eased > 0 ? eased : 0);

        if (elapsed >= fadeDuration) {
          clearInterval(timer);
          setVisible(false);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [loading, duration]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: `rgba(255,255,255,${opacity})`,
      }}
    >
      <div className="relative flex space-x-4" style={{ opacity }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${primary}, ${secondary})`,
              animation: `dot-orbit 1.4s ease-in-out ${i * 0.18}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes dot-orbit {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          25% {
            transform: translateY(-4px) scale(1.15);
            opacity: 1;
          }
          50% {
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          75% {
            transform: translateY(4px) scale(0.9);
          }
          100% {
            transform: translateY(0px) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
