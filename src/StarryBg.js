import React, { useEffect, useRef } from "react";

function StarryBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setCanvasSizeAndDrawStars = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = width;
      canvas.height = height;

      // Clear canvas before redrawing
      ctx.clearRect(0, 0, width, height);

      // Generate stars
      for (let i = 0; i < 250; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 0.1 + Math.random() * 1.9;
        const opacity = 0.5 + size / 2;

        ctx.fillStyle = `rgba(230, 230, 230, ${opacity})`;
        ctx.fillRect(x, y, size, size);
      }
    };

    const timeoutId = setTimeout(setCanvasSizeAndDrawStars, 100);
    window.addEventListener("resize", setCanvasSizeAndDrawStars);
    return () => {
      window.removeEventListener("resize", setCanvasSizeAndDrawStars);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }}
    />
  );
}

export default StarryBackground;
