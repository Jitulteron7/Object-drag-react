import { useEffect, useRef } from 'react';

export const useCanvasHook = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const setCanvasRef = (ref: HTMLCanvasElement) => {
    if (!ref) return;
    canvasRef.current = ref;
  };

  useEffect(() => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  }, []);

  return {
    setCanvasRef,
  };
};
