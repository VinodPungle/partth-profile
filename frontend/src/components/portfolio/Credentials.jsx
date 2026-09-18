import { useState } from "react";
import { Award, BadgeCheck, Maximize2 } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Section, Reveal } from "./Section";

export const Credentials = ({ certifications, achievements }) => {
  const [openId, setOpenId] = useState(null);
  const active = achievements.find((a) => a.id === openId);

  return (
    <Section id="credentials" index="05" title="Certifications & Achievements">
      <div className="grid gap-6 lg:grid-cols-5">
        <Reveal className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-2">
          <div className="mb-5 inline-flex items-center gap-2 text-[var(--cyan)]"><BadgeCheck size={18} /><span className="eyebrow">Certifications</span></div>
          <ol className="divide-y divide-border" data-testid="certifications-list">
            {certifications.map((c, i) => (
              <li key={c.name} className="flex gap-4 py-4 first:pt-0 last:pb-0" data-testid={`certification-${i}`}>
                <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className={`text-sm font-semibold ${i === 0 ? "text-white" : "text-[#e5e7eb]"}`}>{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.issuer}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={0.1} className="card-glow rounded-2xl p-6 sm:p-8 lg:col-span-3">
          <div className="mb-5 inline-flex items-center gap-2 text-[var(--ember)]"><Award size={18} /><span className="eyebrow !text-[var(--ember)]">Achievements</span></div>
          {achievements.map((a) => (
            <div key={a.id} data-testid={`achievement-${a.id}`}>
              <h3 className="font-display text-lg font-bold text-white">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>
              <button
                type="button"
                onClick={() => setOpenId(a.id)}
                aria-haspopup="dialog"
                data-testid="certificate-thumbnail-btn"
                className="group relative mt-5 block w-full overflow-hidden rounded-xl border border-border"
              >
                <img src={a.image} alt={a.image_alt} width={1200} height={848} loading="lazy" className="w-full transition-transform duration-500 group-hover:scale-[1.02]" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black"><Maximize2 size={14} /> View larger</span>
                </span>
              </button>
            </div>
          ))}
        </Reveal>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-w-5xl border-border bg-[#0f111a] p-3" data-testid="certificate-modal">
          {active && (
            <>
              <DialogTitle className="sr-only">{active.title} — larger view</DialogTitle>
              <img src={active.image} alt={`${active.image_alt} — larger view`} width={1200} height={848} className="w-full rounded-lg" />
            </>
          )}
        </DialogContent>
      </Dialog>
    </Section>
  );
};
