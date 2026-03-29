/**
 * CyberVerse Particles Background Animation
 * Creates an animated particle system for the website background
 */

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;
    this.opacity = Math.random() * 0.5 + 0.3;
    this.color = this.getRandomColor();
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  getRandomColor() {
    const colors = [
      "hsl(217 91% 60%)", // cyan
      "hsl(142 71% 45%)", // green
      "hsl(38 92% 50%)", // amber
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update(canvas) {
    this.x += this.speedX;
    this.y += this.speedY;

    // Wrap around edges
    if (this.x > canvas.width) this.x = 0;
    if (this.x < 0) this.x = canvas.width;
    if (this.y > canvas.height) this.y = 0;
    if (this.y < 0) this.y = canvas.height;

    // Pulse effect
    this.pulsePhase += 0.02;
    this.opacity = 0.3 + 0.2 * Math.sin(this.pulsePhase);
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

export class ParticlesBackground {
  constructor(containerId = "particles-canvas") {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.warn(`Container with id '${containerId}' not found`);
      return;
    }

    this.canvas = document.createElement("canvas");
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "1";
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 80;
    this.connectionDistance = 100;

    this.resize();
    this.initParticles();
    this.animate();

    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new Particle(this.canvas));
    }
  }

  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.connectionDistance) {
          const opacity = (1 - distance / this.connectionDistance) * 0.3;
          this.ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
          this.ctx.lineWidth = 1;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }

  animate = () => {
    // Clear canvas with fade effect
    this.ctx.fillStyle = "rgba(8, 13, 18, 0.1)";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Update and draw particles
    for (let particle of this.particles) {
      particle.update(this.canvas);
      particle.draw(this.ctx);
    }

    // Draw connections
    this.drawConnections();

    requestAnimationFrame(this.animate);
  };

  destroy() {
    if (this.canvas && this.container) {
      this.container.removeChild(this.canvas);
    }
  }
}

// Auto-initialize if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new ParticlesBackground("particles-container");
  });
} else {
  new ParticlesBackground("particles-container");
}
