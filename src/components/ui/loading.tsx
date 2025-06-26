import { useEffect, useState } from "react";

export const Loading = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!loading) return null;

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-full animate-spin mb-3"
          style={{
            width: '88px',
            height: '88px',
            background: 'conic-gradient(from 0deg,rgb(112, 29, 9),rgb(130, 3, 3),rgb(228, 192, 9),rgb(218, 59, 20))',
            WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white 0)',
            mask: 'radial-gradient(farthest-side, transparent calc(100% - 3px), white 0)'
          }}
        ></div>
      </div>
    </div>
  );
}; 