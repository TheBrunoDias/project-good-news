import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Daily Good News",
  description: "What is Daily Good News and why it exists.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-117.5 px-4 py-10">
      <div className="flex flex-col gap-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-ink">About</h1>
          <p className="mt-1 text-sm text-ink-faint">What this is and why it exists</p>
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-ink">What is Daily Good News?</h2>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            Daily Good News is a curated feed of positive stories from around the world. Every day, stories are
            collected and evaluated — only the ones that are genuinely uplifting make it through. No outrage, no
            fear, no doom-scrolling. Just things that are actually going well.
          </p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            The idea is simple: good things happen every single day, but they rarely get the spotlight. This is an
            attempt to change that, even if just a little.
          </p>
        </section>

        <div className="border-t border-hairline" />

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-ink">The vision</h2>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            The goal is to build a place you can open first thing in the morning without feeling worse afterward.
            A feed that leaves you a bit more hopeful, not a bit more anxious. Small in scope, intentional in
            curation.
          </p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            There&apos;s no agenda beyond that. No ads, no engagement metrics to game, no algorithm designed to
            keep you hooked. Just good news, delivered daily.
          </p>
        </section>

        <div className="border-t border-hairline" />

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-ink">How does curation work?</h2>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            Every day, fresh stories are pulled from{" "}
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-2 hover:text-primary transition-colors"
            >
              NewsAPI
            </a>
            , a service that aggregates headlines from hundreds of sources around the world.
          </p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            Each story is then sent to an AI model, which reads the title and description and assigns a positivity
            score from 0 to 10. The score reflects how uplifting, constructive, or hopeful the story is — not just
            whether it avoids bad news, but whether it actually brings something good. Only stories scoring 7 or
            above make it into the feed.
          </p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            It&apos;s not a perfect filter. AI gets things wrong sometimes, and &quot;positive&quot; is
            inherently subjective. But it&apos;s a good-faith attempt to surface stories worth reading.
          </p>
        </section>

        <div className="border-t border-hairline" />

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-bold text-ink">Who made this?</h2>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            This project was built by a developer using it as a learning exercise — exploring new technologies,
            experimenting with different architectural approaches, and shipping something real in the process.
            It&apos;s a personal project, driven by curiosity and the belief that building things is the best way
            to learn.
          </p>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            If something is broken or could be better, that&apos;s also part of the journey.
          </p>
        </section>

        <div className="border-t border-hairline" />

        <section className="flex flex-col gap-3">
          <h2 className="text-base font-bold text-ink">Credits</h2>
          <p className="text-[15px] text-ink-muted leading-relaxed">
            A big thank you to{" "}
            <a
              href="https://newsapi.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink underline underline-offset-2 hover:text-primary transition-colors"
            >
              NewsAPI
            </a>{" "}
            for making it straightforward to access news from so many sources in one place. This project wouldn&apos;t
            exist without it.
          </p>
        </section>
      </div>
    </main>
  );
}
