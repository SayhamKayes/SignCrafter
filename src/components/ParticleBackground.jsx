import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function ParticleBackground() {
  const [init, setInit] = useState(false);

  // Initialize the particle engine once when the app loads
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesOptions = {
    background: {
      color: { value: "transparent" }, // Let your CSS gradient show through!
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "grab", // Particles will reach out to the mouse
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: { opacity: 0.3 },
        },
      },
    },
    particles: {
      color: { value: "#3B82F6" }, // White particles work best for both dark/light mode glass
      links: {
        color: "#3B82F6",
        distance: 150,
        enable: true,
        opacity: 0.4, // Very subtle connecting lines
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: { default: "bounce" },
        random: false,
        speed: 0.8, // Slow, elegant movement
        straight: false,
      },
      number: {
        density: { enable: true, area: 800 },
        value: 80, // Not too crowded
      },
      opacity: {
        value: 0.5, // Keep them semi-transparent so they don't distract
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 3 },
      },
    },
    detectRetina: true,
  };

  if (init) {
    return (
      <Particles
        id="tsparticles"
        options={particlesOptions}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
          pointerEvents: "none"
        }}
      />
    );
  }

  return null;
}