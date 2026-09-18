import { GraduationCap, Sparkles, Target } from "lucide-react";
import { Section, Reveal } from "./Section";

export const About = ({ profile, education }) => (
  <Section id="about" index="01" title="About & Education">
    <div className="grid gap-6 lg:grid-cols-12">
      <Reveal className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-7">
        <div className="mb-5 inline-flex items-center gap-2 text-[var(--cyan)]"><Sparkles size={18} /><span className="eyebrow">Who I am</span></div>
        {profile.about.map((p, i) => (
          <p key={i} className="mb-4 text-sm leading-relaxed text-[#c5cad6] last:mb-0 md:text-base">{p}</p>
        ))}
      </Reveal>

      <Reveal delay={0.1} className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-5" >
        <div className="mb-5 inline-flex items-center gap-2 text-[var(--ember)]"><GraduationCap size={18} /><span className="eyebrow !text-[var(--ember)]">Education</span></div>
        <div data-testid="education-card">
          <h3 className="font-display text-xl font-bold text-white">{education.institution}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{education.degree}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-black/30 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">CGPA</dt>
              <dd className="mt-1 font-display text-3xl font-bold text-white" data-testid="education-cgpa">{education.cgpa.split(" ")[0]}<span className="text-base text-muted-foreground"> / 10</span></dd>
            </div>
            <div className="rounded-xl border border-border bg-black/30 p-4">
              <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Timeline</dt>
              <dd className="mt-1 text-sm font-semibold text-white">{education.duration}</dd>
              <dd className="text-xs text-muted-foreground">currently {education.year}</dd>
            </div>
          </dl>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Relevant coursework</p>
          <ul className="mt-2 flex flex-wrap gap-2" aria-label="Relevant coursework">
            {education.coursework.map((c) => <li key={c} className="chip">{c}</li>)}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={0.15} className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex items-center gap-2 text-[var(--emerald)]"><Target size={18} /><span className="eyebrow !text-[var(--emerald)]">Core focus</span></div>
          <ul className="grid flex-1 gap-3 sm:grid-cols-2 lg:grid-cols-4" data-testid="focus-list">
            {profile.focus.map((f, i) => (
              <li key={f} className="flex items-center gap-3 rounded-xl border border-border bg-black/30 px-4 py-3">
                <span className="font-mono text-xs text-[var(--cyan)]">0{i + 1}</span>
                <span className="text-sm font-medium text-white">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  </Section>
);
