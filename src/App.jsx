import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './App.css';

const projects = [
  {
    title: 'Windows Manager',
    description: 'A C++ desktop utility for managing and organizing Windows.',
    link: 'https://github.com/AndrewXt35/Windows-Manager',
    tags: ['C++', 'Windows', 'Desktop'],
  },
];

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DataRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w, h, cols, drops, speeds;
    const fontSize = 14;
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ<>{}[]/\\|=+-*'.split('');

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      cols = Math.floor(w / fontSize);
      drops = Array.from({ length: cols }, () => Math.random() * -h);
      speeds = Array.from({ length: cols }, () => 0.5 + Math.random() * 1.5);
    };

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 9, 12, 0.12)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
      ctx.textAlign = 'center';

      for (let i = 0; i < cols; i++) {
        const x = i * fontSize + fontSize / 2;
        const y = drops[i];
        const char = chars[Math.floor(Math.random() * chars.length)];

        const isHead = Math.random() > 0.9;
        if (isHead) {
          ctx.fillStyle = 'rgba(240, 171, 252, 0.9)';
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#f0abfc';
        } else {
          ctx.fillStyle = 'rgba(94, 234, 212, 0.35)';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#5eead4';
        }

        ctx.fillText(char, x, y);

        drops[i] += fontSize * speeds[i];
        if (drops[i] > h && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="data-rain" aria-hidden="true" />;
}

function GlitchOverlay() {
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    const schedule = () => {
      const delay = 4000 + Math.random() * 8000;
      setTimeout(() => {
        setBurst(true);
        setTimeout(() => setBurst(false), 180);
        schedule();
      }, delay);
    };
    schedule();
  }, []);

  return <div className={`glitch-overlay ${burst ? 'active' : ''}`} aria-hidden="true" />;
}

function CursorGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x, ty = y, raf;

    const onMove = (e) => { tx = e.clientX; ty = e.clientY; };
    const tick = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.transform = `translate3d(${x - 300}px, ${y - 300}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div className="cursor-glow" ref={ref} aria-hidden="true" />;
}

function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section className="hero" ref={ref}>
      <motion.div className="hero-inner" style={{ y, opacity }}>
        <p className="eyebrow">
          <span className="dot" />
          <span className="mono">status: online</span>
        </p>

        <h1 className="glitch-name" data-text="Andrew Hernandez.">
          Andrew Hernandez<span className="accent">.</span>
        </h1>

        <p className="subtitle">
          C++ developer focused on systems programming, desktop applications,
          and practical software engineering.
        </p>

        <div className="links">
          <a href="https://github.com/AndrewXt35" target="_blank" rel="noreferrer">
            <span className="link-label">github</span>
            <span className="arrow">↗</span>
          </a>
          <a href="mailto:andrewh3525@gmail.com">
            <span className="link-label">email</span>
            <span className="arrow">↗</span>
          </a>
        </div>

        <div className="scroll-hint">
          <span>scroll</span>
          <div className="scroll-line" />
        </div>
      </motion.div>
    </section>
  );
}

function About() {
  return (
    <section className="section">
      <FadeIn>
        <p className="section-label">/ 01 — about</p>
        <h2>A bit about me</h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="lead">
          I'm a C++ developer focused on systems programming and desktop
          applications. I like building tools that solve real problems — clean
          architecture, low-level control, and code that ships.
        </p>
      </FadeIn>
    </section>
  );
}

function Projects() {
  return (
    <section className="section">
      <FadeIn>
        <p className="section-label">/ 02 — work</p>
        <h2>Selected projects</h2>
      </FadeIn>
      <div className="grid">
        {projects.map((p, i) => (
          <FadeIn key={p.title} delay={i * 0.08}>
            <a href={p.link} target="_blank" rel="noreferrer" className="card">
              <span className="corner tl" />
              <span className="corner tr" />
              <span className="corner bl" />
              <span className="corner br" />
              <div className="card-head">
                <h3>{p.title}</h3>
                <span className="arrow">↗</span>
              </div>
              <p>{p.description}</p>
              <div className="tags">
                {p.tags.map((t) => <span key={t}>{t}</span>)}
              </div>
            </a>
          </FadeIn>
        ))}

        <FadeIn delay={projects.length * 0.08}>
          <a
            href="https://github.com/AndrewXt35?tab=repositories"
            target="_blank"
            rel="noreferrer"
            className="card card-more"
          >
            <div className="card-head">
              <h3>More on GitHub</h3>
              <span className="arrow">↗</span>
            </div>
            <p>See everything I'm working on.</p>
            <div className="tags">
              <span>all repos</span>
            </div>
          </a>
        </FadeIn>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="section">
      <FadeIn>
        <p className="section-label">/ 03 — contact</p>
        <h2>Let's build something</h2>
      </FadeIn>
      <FadeIn delay={0.1}>
        <p className="lead">
          Open to freelance, full-time, or just a good conversation.
        </p>
        <a className="cta" href="mailto:andrewh3525@gmail.com">
          <span>say hello</span>
          <span className="arrow">→</span>
        </a>
      </FadeIn>
    </section>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="app">
      <DataRain />
      <GlitchOverlay />
      <CursorGlow />

      <nav className={scrolled ? 'nav scrolled' : 'nav'}>
        <span className="brand">
          andrew hernandez<span className="accent">.</span>
        </span>
        <div className="nav-links">
          <a href="#about">about</a>
          <a href="#work">work</a>
          <a href="#contact">contact</a>
        </div>
      </nav>

      <Hero />

      <div id="about"><About /></div>
      <div id="work"><Projects /></div>
      <div id="contact"><Contact /></div>

      <footer>
        <p>© {new Date().getFullYear()} Andrew Hernandez — built with React</p>
      </footer>
    </div>
  );
}