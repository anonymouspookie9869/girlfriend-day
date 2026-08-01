import confetti from "canvas-confetti";

export function triggerHeartsConfetti() {
  const count = 50;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
      colors: ["#f472b6", "#ec4899", "#f43f5e", "#fb7185", "#f0abfc"],
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    shapes: ["circle"],
    scalar: 1.2,
  });
  fire(0.2, {
    spread: 60,
    shapes: ["circle"],
    scalar: 1.0,
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });
}

export function triggerStarsConfetti() {
  confetti({
    particleCount: 80,
    spread: 80,
    origin: { y: 0.6 },
    colors: ["#fbbf24", "#f59e0b", "#c084fc", "#38bdf8", "#f472b6"],
    shapes: ["star"],
    scalar: 1.3,
  });
}

export function triggerFlowersConfetti() {
  confetti({
    particleCount: 60,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#f472b6", "#c084fc", "#eab308", "#22c55e", "#fb7185"],
    scalar: 1.2,
  });
}

export function triggerGrandConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#f472b6", "#ec4899", "#a855f7", "#fbbf24", "#38bdf8"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#f472b6", "#ec4899", "#a855f7", "#fbbf24", "#38bdf8"],
    });
  }, 250);
}

export function triggerConfessionExplosion() {
  const count = 100;
  const defaults = {
    origin: { y: 0.6 },
    zIndex: 9999,
  };

  confetti({
    ...defaults,
    particleCount: count,
    spread: 100,
    startVelocity: 45,
    colors: ["#f43f5e", "#ec4899", "#d946ef", "#a855f7", "#fbbf24"],
    scalar: 1.4,
  });

  setTimeout(() => {
    confetti({
      ...defaults,
      origin: { x: 0.2, y: 0.5 },
      particleCount: 50,
      angle: 60,
      spread: 70,
      startVelocity: 50,
      colors: ["#f43f5e", "#ec4899", "#fb7185"],
      scalar: 1.2,
    });
    confetti({
      ...defaults,
      origin: { x: 0.8, y: 0.5 },
      particleCount: 50,
      angle: 120,
      spread: 70,
      startVelocity: 50,
      colors: ["#a855f7", "#ec4899", "#fbbf24"],
      scalar: 1.2,
    });
  }, 200);
}
