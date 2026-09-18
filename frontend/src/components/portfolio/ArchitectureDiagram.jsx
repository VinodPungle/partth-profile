import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

export const ArchitectureDiagram = ({ architecture, projectId }) => (
  <figure className="rounded-2xl border border-border bg-black/30 p-4 sm:p-5" data-testid={`featured-${projectId}-diagram`}>
    <figcaption className="mb-4 flex items-center justify-between gap-3">
      <span className="eyebrow">Architecture</span>
      <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
        <span className="mr-1 inline-block h-2 w-2 rounded-sm bg-[var(--ember)] align-middle" /> key design decision
      </span>
    </figcaption>
    <ol className="space-y-1">
      {architecture.layers.map((layer, li) => (
        <li key={layer.label}>
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.08 * li, duration: 0.4 }}
            className="grid gap-2 sm:grid-cols-[120px_1fr] sm:items-center"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{layer.label}</span>
            <div className="flex flex-wrap gap-1.5">
              {layer.nodes.map((n) => (
                <span
                  key={n.name}
                  className={`rounded-lg border px-2.5 py-1.5 font-mono text-[11px] leading-tight ${n.hot ? "border-[var(--ember)]/60 bg-[var(--ember)]/10 text-[#ffb59a]" : "border-border bg-[#12141f] text-[#c5cad6]"}`}
                >
                  {n.name}
                </span>
              ))}
            </div>
          </motion.div>
          {li < architecture.layers.length - 1 && (
            <div className="flex justify-center py-0.5 sm:justify-start sm:pl-[136px]" aria-hidden="true">
              <ArrowDown size={12} className="text-[var(--cyan)]/60" />
            </div>
          )}
        </li>
      ))}
    </ol>
    <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{architecture.caption}</p>
  </figure>
);
