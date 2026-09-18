import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const istTime = () =>
  new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date());

export const Footer = ({ profile }) => {
  const [time, setTime] = useState(istTime());
  useEffect(() => {
    const t = setInterval(() => setTime(istTime()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-[#06070b] pt-16 pb-10" data-testid="site-footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        <p aria-hidden="true" className="font-display select-none text-[13vw] font-black uppercase leading-[0.85] tracking-tighter text-white/[0.05] lg:text-[9vw]">
          {profile.name}
        </p>
        <div className="mt-10 flex flex-col gap-6 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.name} · Built with React &amp; FastAPI.</p>
          <p className="font-mono text-xs" data-testid="footer-ist-clock">
            <span className="text-[var(--cyan)]">IST</span> {time} · Bengaluru
          </p>
          <a href="#top" data-testid="footer-back-to-top" className="inline-flex items-center gap-2 text-white hover:text-[var(--cyan)]">Back to top <ArrowUp size={14} /></a>
        </div>
      </div>
    </footer>
  );
};
