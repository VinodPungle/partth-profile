import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { useActiveSection } from "@/hooks/useActiveSection";
import { trackEvent } from "@/lib/api";

const LINKS = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];
const IDS = ["top", ...LINKS.map((l) => l.id)];

export const Nav = ({ resumeUrl }) => {
  const active = useActiveSection(IDS);
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4" data-testid="site-nav">
      <nav aria-label="Main" className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full border border-border/80 px-3 py-2 pl-5 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.8)]">
        <a href="#top" className="font-display text-base font-bold tracking-tight text-white" data-testid="nav-brand">
          partth<span className="text-[var(--ember)]">.</span><span className="text-[var(--cyan)]">online</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id} className="relative">
              <a
                href={`#${l.id}`}
                data-testid={`nav-${l.id}`}
                className={`relative z-10 block rounded-full px-4 py-1.5 text-sm transition-colors ${active === l.id ? "text-white" : "text-muted-foreground hover:text-white"}`}
              >
                {l.label}
              </a>
              {active === l.id && (
                <motion.span layoutId="nav-active" transition={{ type: "spring", stiffness: 380, damping: 32 }} className="absolute inset-0 rounded-full bg-white/[0.08]" />
              )}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={resumeUrl}
            download
            onClick={() => trackEvent("resume_download", "nav")}
            data-testid="nav-resume-link"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--ember)] px-4 py-1.5 text-sm font-semibold text-white transition-transform hover:scale-[1.03] active:scale-95"
          >
            <Download size={14} /> <span className="hidden sm:inline">Resume</span><span className="sm:hidden">CV</span>
          </a>
          <button type="button" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} data-testid="nav-menu-toggle" className="rounded-full p-2 text-white md:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass mx-auto mt-2 max-w-5xl rounded-2xl border border-border/80 p-2 md:hidden"
            data-testid="nav-mobile-menu"
          >
            {LINKS.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} onClick={() => setOpen(false)} data-testid={`nav-mobile-${l.id}`} className="block rounded-xl px-4 py-3 text-sm text-foreground hover:bg-white/5">{l.label}</a>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
};
