// Canvas Confetti Celebration Engine

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRot: number;
  alpha: number;
}

export function fireConfetti(durationMs: number = 2200): void {
  if (typeof window === 'undefined') return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '99999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.remove();
    return;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#eab308'];
  const particles: Particle[] = [];
  const particleCount = 75;

  // Launch from lower left and right corners
  for (let i = 0; i < particleCount; i++) {
    const isLeft = i % 2 === 0;
    const originX = isLeft ? width * 0.2 : width * 0.8;
    const originY = height * 0.85;

    particles.push({
      x: originX,
      y: originY,
      vx: (isLeft ? 1 : -1) * (Math.random() * 8 + 3) + (Math.random() - 0.5) * 4,
      vy: -(Math.random() * 12 + 10),
      size: Math.random() * 8 + 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      alpha: 1
    });
  }

  const startTime = performance.now();

  function animate(now: number) {
    const elapsed = now - startTime;
    ctx!.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.985; // friction
      p.rotation += p.vRot;

      if (elapsed > durationMs * 0.6) {
        p.alpha = Math.max(0, 1 - (elapsed - durationMs * 0.6) / (durationMs * 0.4));
      }

      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate((p.rotation * Math.PI) / 180);
      ctx!.globalAlpha = p.alpha;
      ctx!.fillStyle = p.color;
      ctx!.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx!.restore();
    });

    if (elapsed < durationMs) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(animate);
}
