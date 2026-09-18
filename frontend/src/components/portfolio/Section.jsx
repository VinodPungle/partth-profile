import { motion } from "framer-motion";

export const Section = ({ id, index, title, lede, children, className = "" }) => (
  <section id={id} className={`relative py-20 lg:py-28 ${className}`} aria-labelledby={`${id}-heading`}>
    <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="mb-12 lg:mb-16"
      >
        <p className="eyebrow mb-3">{index} — {title}</p>
        <h2 id={`${id}-heading`} className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {lede && <p className="mt-4 max-w-2xl text-base text-muted-foreground md:text-lg">{lede}</p>}
      </motion.div>
      {children}
    </div>
  </section>
);

export const Reveal = ({ children, delay = 0, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    className={className}
  >
    {children}
  </motion.div>
);
