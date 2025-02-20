export class Score {
  constructor() {
    this.threshold = -2.5  // Altura mínima para considerar o cubo derrubado
    this.poits = 10 // Pontos para cada cubo derrubado
    this.score = 0;
    this.scoreElement = document.createElement('div');
    this.isAnimating = false;

    Object.assign(this.scoreElement.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '20px 40px',
      background: 'linear-gradient(145deg, rgba(0,0,0,0.9) 30%, rgba(50,50,50,0.9) 100%)',
      color: '#fff',
      fontSize: '36px',
      fontFamily: '"Bauhaus 93", "Press Start 2P", sans-serif',
      borderRadius: '20px',
      boxShadow: '0 8px 16px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,204,0,0.6)',
      zIndex: '1000',
      transition: 'all 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
      border: '3px solid rgba(255, 204, 0, 0.7)',
      textShadow: '0 0 15px rgba(255,204,0,0.9), 3px 3px 6px rgba(0,0,0,0.8)',
      userSelect: 'none',
      transform: 'perspective(500px) rotateX(10deg)',
      backdropFilter: 'blur(6px)'
    });

    document.body.appendChild(this.scoreElement);
    this.updateDisplay();
    this.addParticleStyles();
  }

  updateDisplay() {
    this.scoreElement.textContent = `SCORE: ${this.score}`;
  }

  addPoints() {
    if (!this.isAnimating) {
      this.isAnimating = true;

      this.score += this.poits;
      this.updateDisplay();

      this.animateScore();

      this.createParticles(30);
      this.createSparks(20);
      this.createShockwave();

      setTimeout(() => this.isAnimating = false, 600);
    }
  }

  animateScore() {
    const baseColor = '#ffffff';
    const highlightColor = '#ffcc00';

    const animate = (timestamp) => {
      const progress = Math.min((timestamp - start) / 300, 1);

      this.scoreElement.style.transform = `
        perspective(500px) rotateX(10deg)
        scale(${1 + 0.4 * Math.sin(progress * Math.PI)})
      `;

      this.scoreElement.style.color = `
        rgba(${255 - (255 - 204) * progress},
        ${255 - (255 - 204) * progress},
        ${0 + 255 * progress},
        ${1})
      `;

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const start = performance.now();
    requestAnimationFrame(animate);
  }

  createParticles(count) {
    const rect = this.scoreElement.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const angle = (i * (360 / count)) * (Math.PI / 180);
      const size = Math.random() * 12 + 8;
      const duration = Math.random() * 0.8 + 0.5;

      Object.assign(particle.style, {
        position: 'fixed',
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, 
          rgba(255,204,0,1) 20%,
          rgba(255,102,0,1) 100%)`,
        borderRadius: '50%',
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left + rect.width / 2}px`,
        zIndex: '1001',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        animation: `
          particle-explode ${duration}s ease-out forwards,
          particle-fade ${duration}s ease-out forwards
        `
      });

      document.body.appendChild(particle);

      particle.style.setProperty('--angle', `${angle}rad`);
      particle.style.setProperty('--distance', `${Math.random() * 120 + 80}px`); // Aumentei a distância

      particle.addEventListener('animationend', () => particle.remove());
    }
  }

  createSparks(count) {
    const rect = this.scoreElement.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const spark = document.createElement('div');
      const angle = (i * (360 / count)) * (Math.PI / 180);
      const size = Math.random() * 6 + 3;
      const duration = Math.random() * 0.4 + 0.3;

      Object.assign(spark.style, {
        position: 'fixed',
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, 
          rgba(255,255,255,1) 20%,
          rgba(255,204,0,1) 100%)`,
        borderRadius: '50%',
        top: `${rect.top + rect.height / 2}px`,
        left: `${rect.left + rect.width / 2}px`,
        zIndex: '1002',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        animation: `
          spark-explode ${duration}s ease-out forwards,
          spark-fade ${duration}s ease-out forwards
        `
      });

      document.body.appendChild(spark);

      spark.style.setProperty('--angle', `${angle}rad`);
      spark.style.setProperty('--distance', `${Math.random() * 60 + 40}px`);

      spark.addEventListener('animationend', () => spark.remove());
    }
  }

  createShockwave() {
    const rect = this.scoreElement.getBoundingClientRect();
    const shockwave = document.createElement('div');

    Object.assign(shockwave.style, {
      position: 'fixed',
      width: '50px',
      height: '50px',
      background: 'radial-gradient(circle, rgba(255,204,0,0.6) 0%, rgba(255,204,0,0) 70%)',
      borderRadius: '50%',
      top: `${rect.top + rect.height / 2}px`,
      left: `${rect.left + rect.width / 2}px`,
      zIndex: '1000',
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
      animation: 'shockwave-expand 0.8s ease-out forwards'
    });

    document.body.appendChild(shockwave);
    shockwave.addEventListener('animationend', () => shockwave.remove());
  }

  addParticleStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes particle-explode {
        0% { transform: translate(-50%, -50) scale(0); }
        50% { transform: translate(
          calc(-50% + cos(var(--angle)) * var(--distance)),
          calc(-50% + sin(var(--angle)) * var(--distance))) scale(1.8); }
        100% { transform: translate(
          calc(-50% + cos(var(--angle)) * (var(--distance) * 2.2)),
          calc(-50% + sin(var(--angle)) * (var(--distance) * 2.2))) scale(0.2); }
      }

      @keyframes spark-explode {
        0% { transform: translate(-50%, -50) scale(0); }
        50% { transform: translate(
          calc(-50% + cos(var(--angle)) * var(--distance)),
          calc(-50% + sin(var(--angle)) * var(--distance))) scale(2); }
        100% { transform: translate(
          calc(-50% + cos(var(--angle)) * (var(--distance) * 2.5)),
          calc(-50% + sin(var(--angle)) * (var(--distance) * 2.5))) scale(0); }
      }

      @keyframes shockwave-expand {
        0% { transform: translate(-50%, -50) scale(0); opacity: 1; }
        100% { transform: translate(-50%, -50) scale(4); opacity: 0; }
      }

      @keyframes particle-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes spark-fade {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }

      @keyframes score-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.6); }
        100% { transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  getScore() {
    return this.score;
  }
}