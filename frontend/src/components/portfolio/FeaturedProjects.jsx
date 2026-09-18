import { useState } from "react";
import { ArrowUpRight, Github, Layers } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Section, Reveal } from "./Section";
import { ArchitectureDiagram } from "./ArchitectureDiagram";
import { trackEvent } from "@/lib/api";

const DeepDive = ({ project, open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto border-border bg-[#0f111a] text-foreground" data-testid={`featured-${project.id}-dialog`}>
      <DialogHeader>
        <p className="eyebrow">Engineering detail — {project.num}</p>
        <DialogTitle className="font-display text-2xl font-bold text-white sm:text-3xl">{project.title}</DialogTitle>
        <DialogDescription className="text-muted-foreground">{project.oneliner}</DialogDescription>
      </DialogHeader>
      <div className="space-y-6">
        {project.architecture && <ArchitectureDiagram architecture={project.architecture} projectId={project.id} />}
        {project.sections.map((s) => (
          <div key={s.title}>
            <h4 className="mb-2 font-display text-base font-semibold text-[var(--cyan)]">{s.title}</h4>
            {s.body && <p className="text-sm leading-relaxed text-[#c5cad6]">{s.body}</p>}
            {s.bullets && (
              <ul className="space-y-2.5">
                {s.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-[#c5cad6]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ember)]" />{b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        <p className="rounded-xl border border-border bg-black/30 p-4 text-sm text-white"><span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Role · </span>{project.role}</p>
        <div className="flex flex-wrap gap-3">
          {project.links.map((l) => <ProjectLink key={l.url} link={l} project={project} />)}
        </div>
      </div>
    </DialogContent>
  </Dialog>
);

const ProjectLink = ({ link, project }) => (
  <a
    href={link.url}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => trackEvent("project_link", `${project.id}:${link.kind}`)}
    data-testid={`featured-${project.id}-${link.kind}`}
    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.03] ${link.kind === "demo" ? "bg-[var(--cyan)] text-black" : "border border-border text-white hover:border-[var(--cyan)]/50"}`}
  >
    {link.kind === "demo" ? <ArrowUpRight size={15} /> : <Github size={15} />} {link.label}
  </a>
);

const FeaturedCard = ({ project, i }) => {
  const [open, setOpen] = useState(false);
  return (
    <Reveal delay={i * 0.08}>
      <article className="card-glow group grid gap-8 rounded-2xl p-6 sm:p-8 lg:grid-cols-[auto_1fr]" data-testid={`featured-${project.id}-card`}>
        <div className="font-display text-6xl font-black leading-none text-white/[0.07] transition-colors group-hover:text-[var(--cyan)]/20 lg:text-8xl" aria-hidden="true">{project.num}</div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white sm:text-3xl">{project.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">{project.oneliner}</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-3">
            {project.highlights.map((h) => (
              <li key={h} className="rounded-xl border border-border bg-black/30 px-3 py-2 font-mono text-xs text-[#c5cad6]">{h}</li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tech stack">
            {project.stack.map((s) => <li key={s} className="chip">{s}</li>)}
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => { setOpen(true); trackEvent("deep_dive_open", project.id); }}
              data-testid={`featured-${project.id}-details-btn`}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
            >
              <Layers size={15} /> Engineering detail
            </button>
            {project.links.map((l) => <ProjectLink key={l.url} link={l} project={project} />)}
          </div>
        </div>
      </article>
      <DeepDive project={project} open={open} onOpenChange={setOpen} />
    </Reveal>
  );
};

export const FeaturedProjects = ({ projects }) => (
  <Section id="projects" index="03" title="Featured Projects" lede="Three systems, in depth. Each one opens into the architecture and the decisions behind it.">
    <div className="space-y-6">
      {projects.map((p, i) => <FeaturedCard key={p.id} project={p} i={i} />)}
    </div>
  </Section>
);
