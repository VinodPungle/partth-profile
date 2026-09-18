import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { ParticleMesh } from "./ParticleMesh";
import { trackEvent } from "@/lib/api";

const rise = (d) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: d, ease: [0.22, 1, 0.36, 1] },
});

const TERMINAL_LINES = [
  { k: "$ whoami", v: "parth.pungle — applied AI engineer" },
  { k: "$ status", v: "B.Tech CS (AI) · MIT Bengaluru · CGPA 8.1" },
  { k: "$ stack", v: "LangGraph · FastAPI · Azure · GCP · RAG" },
  { k: "$ shipping", v: "multi-agent platform · fin advisor · prod tutor" },
  { k: "$ availability", v: "summer_2027 = OPEN" },
];

const Terminal = () => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 550);
    return () => clearTimeout(t);
  }, [shown]);
  return (
    <div className="card-glow rounded-2xl p-5 font-mono text-[13px] leading-relaxed" data-testid="hero-terminal">
      <div className="mb-3 flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-muted-foreground">agent-runtime — zsh</span>
      </div>
      {TERMINAL_LINES.slice(0, shown).map((l) => (
        <div key={l.k} className="grid grid-cols-[auto_1fr] gap-x-3">
          <span className="text-[var(--cyan)]">{l.k}</span>
          <span className="text-[#c5cad6]">{l.v}</span>
        </div>
      ))}
      <span className="inline-block h-4 w-2 animate-pulse bg-[var(--ember)] align-middle" />
    </div>
  );
};

export const Hero = ({ profile }) => {
  const words = profile.name.split(" ");
  let idx = 0;
  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16" aria-label="Introduction">
      <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 20%, rgba(0,229,255,0.12) 0%, rgba(255,87,34,0.08) 35%, transparent 70%)" }} />
      <ParticleMesh />
      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-4 sm:px-8 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:px-16">
        <div>
          <motion.p {...rise(0)} className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--emerald)]/40 bg-[var(--emerald)]/10 px-4 py-1.5 font-mono text-xs text-[#6ee7b7]" data-testid="availability-status">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[var(--emerald)]" />
            {profile.availability}
          </motion.p>

          <h1 className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl" data-testid="hero-name" aria-label={profile.name}>
            {words.map((word, wi) => (
              <span key={wi} className={`inline-block whitespace-nowrap ${wi < words.length - 1 ? "mr-[0.25em]" : ""} ${wi === words.length - 1 ? "text-gradient" : ""}`} aria-hidden="true">
                {word.split("").map((ch) => {
                  const i = idx++;
                  return (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 40, rotateX: -60 }}
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{ duration: 0.6, delay: 0.15 + i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block"
                    >
                      {ch}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p {...rise(0.7)} className="mt-6 font-display text-lg font-medium text-white/90 md:text-2xl">
            {profile.headline} <span className="text-muted-foreground">—</span> <span className="text-muted-foreground">{profile.tagline}</span>
          </motion.p>
          <motion.p {...rise(0.85)} className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base" data-testid="hero-summary">
            {profile.summary}
          </motion.p>

          <motion.div {...rise(1)} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" data-testid="hero-view-projects-btn" className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95">
              Explore projects <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </a>
            <a href={profile.resume_url} download onClick={() => trackEvent("resume_download", "hero")} data-testid="hero-resume-btn" className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-[var(--cyan)]/50">
              <Download size={16} /> Download resume
            </a>
          </motion.div>

          <motion.ul {...rise(1.15)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground" aria-label="Contact links">
            <li><a href={`mailto:${profile.email}`} data-testid="hero-email-link" className="inline-flex items-center gap-2 hover:text-white"><Mail size={15} /> {profile.email}</a></li>
            <li><a href={profile.linkedin} target="_blank" rel="noopener noreferrer" data-testid="hero-linkedin-link" className="inline-flex items-center gap-2 hover:text-white"><Linkedin size={15} /> LinkedIn</a></li>
            <li><a href={profile.github} target="_blank" rel="noopener noreferrer" data-testid="hero-github-link" className="inline-flex items-center gap-2 hover:text-white"><Github size={15} /> GitHub</a></li>
            <li className="inline-flex items-center gap-2"><MapPin size={15} /> {profile.location}</li>
          </motion.ul>
        </div>

        <motion.div {...rise(0.9)} className="hidden lg:block">
          <Terminal />
        </motion.div>
      </div>
    </section>
  );
};
