import React, { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    
    // Determine particle count based on screen size to maintain performance
    const calculateParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.floor(area / 10000), 120); // max 120 particles
    };

    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      const numParticles = calculateParticleCount();
      for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
      }
    };

    window.addEventListener('resize', () => {
      init();
    });

    // We can use CSS variables to get the primary color for particles
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary').trim() || '#002045';

    // Parse hex to rgb for opacity handling
    const hexToRgb = (hex) => {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 88, b: 190 }; // fallback blue
    };

    const colorRgb = hexToRgb(primaryColor);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
        this.speedX = (Math.random() * 1) - 0.5;
        this.speedY = (Math.random() * 1) - 0.5;
      }
      
      update() {
        // Normal drift
        this.x += this.speedX;
        this.y += this.speedY;

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

        // Mouse interaction
        if (mouse.x != null && mouse.y != null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < mouse.radius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouse.radius - distance) / mouse.radius;
            // Particles move slightly towards or away from mouse. Let's make them repel gently.
            const directionX = forceDirectionX * force * this.density * 0.1;
            const directionY = forceDirectionY * force * this.density * 0.1;
            
            this.x -= directionX;
            this.y -= directionY;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.5)`;
        ctx.fill();
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
        
        // Draw lines between particles
        for (let j = i; j < particles.length; j++) {
           const dx = particles[i].x - particles[j].x;
           const dy = particles[i].y - particles[j].y;
           const distance = Math.sqrt(dx * dx + dy * dy);
           
           if (distance < 120) {
              const opacity = 1 - (distance / 120);
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${opacity * 0.2})`;
              ctx.lineWidth = 1;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
           }
        }

        // Draw line from particle to mouse
        if (mouse.x != null && mouse.y != null) {
          const dxMouse = particles[i].x - mouse.x;
          const dyMouse = particles[i].y - mouse.y;
          const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
          
          if (distanceMouse < mouse.radius) {
              const opacity = 1 - (distanceMouse / mouse.radius);
              ctx.beginPath();
              ctx.strokeStyle = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, ${opacity * 0.4})`;
              ctx.lineWidth = 1.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', init);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }} 
    />
  );
};

export default ParticleBackground;
