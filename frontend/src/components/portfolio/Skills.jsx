import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Section, Reveal } from "./Section";

export const Skills = ({ skills }) => {
  const [filter, setFilter] = useState("all");
  const groups = filter === "all" ? skills : skills.filter((g) => g.id === filter);

  return (
    <Section id="skills" index="02" title="Skills" lede="AI engineering first; the languages and platforms that make it ship." className="bg-[#0b0d15]">
      <Reveal className="mb-8 flex flex-wrap gap-2" >
        {[{ id: "all", group: "All" }, ...skills].map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setFilter(g.id)}
            data-testid={`skills-filter-${g.id}`}
            aria-pressed={filter === g.id}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${filter === g.id ? "border-[var(--cyan)] bg-[var(--cyan)]/10 text-white" : "border-border text-muted-foreground hover:text-white"}`}
          >
            {g.group}
          </button>
        ))}
      </Reveal>

      <div className="grid gap-6 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {groups.map((g, gi) => (
            <motion.div
              key={g.id}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className={`card-glow rounded-2xl p-6 sm:p-8 ${g.accent ? "lg:col-span-3 xl:col-span-1" : ""}`}
              data-testid={`skills-${g.id}-group`}
            >
              <div className="mb-5 flex items-baseline gap-3">
                <span className="font-mono text-xs text-[var(--cyan)]">{String(gi + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-lg font-bold text-white">{g.group}</h3>
              </div>
              <ul className="flex flex-wrap gap-2">
                {g.items.map((s, i) => (
                  <motion.li
                    key={s}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className={`chip ${g.accent ? "chip-accent" : ""}`}
                  >
                    {s}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Section>
  );
};
