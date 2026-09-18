import { Toaster } from "@/components/ui/sonner";
import { usePortfolio } from "@/lib/api";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { Marquee } from "@/components/portfolio/Marquee";
import { About } from "@/components/portfolio/About";
import { Skills } from "@/components/portfolio/Skills";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { MoreProjects } from "@/components/portfolio/MoreProjects";
import { Credentials } from "@/components/portfolio/Credentials";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

const Loading = () => (
  <div className="flex min-h-screen items-center justify-center" data-testid="portfolio-loading">
    <p className="font-mono text-sm text-[var(--cyan)]"><span className="animate-pulse">▍</span> booting agent-runtime…</p>
  </div>
);

const ErrorState = ({ onRetry }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center" data-testid="portfolio-error">
    <p className="font-display text-2xl font-bold text-white">Couldn't load portfolio content.</p>
    <button type="button" onClick={onRetry} className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black" data-testid="portfolio-retry-btn">Retry</button>
  </div>
);

function App() {
  const { data, isLoading, isError, refetch } = usePortfolio();

  return (
    <div className="grain relative min-h-screen">
      <Toaster position="bottom-right" theme="dark" richColors />
      {isLoading && <Loading />}
      {isError && <ErrorState onRetry={refetch} />}
      {data && (
        <>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-black">Skip to content</a>
          <Nav resumeUrl={data.profile.resume_url} />
          <main id="main" className="relative z-[2]">
            <Hero profile={data.profile} />
            <Marquee items={[...data.profile.focus, ...data.skills[0].items]} />
            <About profile={data.profile} education={data.education} />
            <Skills skills={data.skills} />
            <FeaturedProjects projects={data.featured_projects} />
            <MoreProjects projects={data.more_projects} />
            <Credentials certifications={data.certifications} achievements={data.achievements} />
            <Contact profile={data.profile} />
          </main>
          <Footer profile={data.profile} />
        </>
      )}
    </div>
  );
}

export default App;
