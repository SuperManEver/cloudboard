import { Features } from "@/features/landing/features";
import { Hero } from "@/features/landing/hero";
import { SiteFooter } from "@/features/landing/site-footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Features />
      </main>
      <SiteFooter />
    </>
  );
}
