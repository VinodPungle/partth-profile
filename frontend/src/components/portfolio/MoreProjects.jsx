import { ArrowUpRight, Users } from "lucide-react";
import { Section, Reveal } from "./Section";
import { trackEvent } from "@/lib/api";

export const MoreProjects = ({ projects }) => (
  <Section id="more-projects" index="04" title="More Projects" className="bg-[#0b0d15]">
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.06}>
          <a
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("project_link", `${p.id}:github`)}
            data-testid={`mini-${p.id}-card`}
            className="card-glow group flex h-full flex-col rounded-2xl p-6 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
              <ArrowUpRight size={20} className="shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--cyan)]" />
            </div>
            {p.team && (
              <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-[var(--ember)]/40 bg-[var(--ember)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#ffb59a]" data-testid={`mini-${p.id}-team-badge`}>
                <Users size={11} /> Team project
              </span>
            )}
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
              {p.stack.map((s) => <li key={s} className="chip">{s}</li>)}
            </ul>
          </a>
        </Reveal>
      ))}
    </div>
  </Section>
);
