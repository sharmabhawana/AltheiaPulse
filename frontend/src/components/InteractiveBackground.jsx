import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export default function InteractiveBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 1200, height: 800 });
  const { isDark } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Canvas particle animation for high-performance floating glowing particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = Math.min(60, Math.floor(window.innerWidth / 25));

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1.5,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.3,
        color: isDark 
          ? (Math.random() > 0.5 ? '#00F0FF' : '#AD00FF')
          : (Math.random() > 0.5 ? '#6366F1' : '#EC4899')
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid pattern (subtle 3D cyber grid)
      ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.04)' : 'rgba(99, 102, 241, 0.06)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      
      // Calculate grid displacement based on mouse
      const dx = (mousePosition.x - canvas.width / 2) * 0.03;
      const dy = (mousePosition.y - canvas.height / 2) * 0.03;

      for (let x = dx % gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = dy % gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Mouse attraction/repulsion slightly
        const mdx = mousePosition.x - p.x;
        const mdy = mousePosition.y - p.y;
        const dist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (dist < 180) {
          const force = (180 - dist) / 180;
          p.x -= (mdx / dist) * force * 0.5;
          p.y -= (mdy / dist) * force * 0.5;
        }

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw connection lines for nearby particles
      ctx.globalAlpha = isDark ? 0.06 : 0.09;
      ctx.strokeStyle = isDark ? 'rgba(0, 240, 255, 0.4)' : 'rgba(99, 102, 241, 0.4)';
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResizeCanvas);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResizeCanvas);
    };
  }, [mousePosition, isDark]);

  return (
    <div className={`fixed inset-0 pointer-events-none -z-20 overflow-hidden transition-colors duration-500 ${isDark ? 'bg-[#050811]' : 'bg-[#F8FAFC]'}`}>
      {/* Glow follow cursor */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[140px] opacity-25 mix-blend-screen transition-all duration-300 ease-out pointer-events-none"
        style={{
          background: isDark 
            ? 'radial-gradient(circle, rgba(0,240,255,0.4) 0%, rgba(173,0,255,0.1) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, rgba(236,72,153,0.05) 70%, transparent 100%)',
          left: mousePosition.x - 225,
          top: mousePosition.y - 225,
        }}
      />

      {/* Futuristic Cyber Grid */}
      <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full opacity-60" />

      {/* Floating Neon Gradient Blobs */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -70, 40, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-1/4 left-1/10 w-96 h-96 rounded-full blur-[100px] ${isDark ? 'bg-[#00F0FF]/8' : 'bg-[#6366F1]/8'}`}
      />
      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 80, -50, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full blur-[100px] ${isDark ? 'bg-[#AD00FF]/8' : 'bg-[#EC4899]/8'}`}
      />
      <div className={`absolute inset-0 ${isDark ? 'bg-[radial-gradient(ellipse_at_center,transparent_30%,#050811_90%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_30%,#F8FAFC_90%)]'}`} />
    </div>
  );
}
