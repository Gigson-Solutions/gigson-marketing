'use client';

import { useTranslations } from 'next-intl';
import Hero from 'shared/Hero';
import { ServiceFaq } from 'shared/ServiceFaq';
import StatsBar from 'shared/StatsBar';

type TierRow = { tier: string; price: string; time: string; fit: string };

/**
 * The price ranges were already written down and already given out — the
 * chatbot quotes them to anyone who asks (`src/lib/gigson.ts`) — but they lived
 * in a server-side system prompt, where no crawler reaches them, so the one
 * question buyers actually search ("how much does an AI agent cost") had no
 * answer on the site.
 *
 * The tiers render as a real `<table>` rather than cards. A table maps each
 * price to its scope and timeline in a way both a reader scanning for their
 * budget and an engine extracting a fact can follow; cards lose that pairing
 * the moment they wrap.
 */
const Pricing = () => {
  const t = useTranslations('pricing');

  const hero = t.raw('hero') as {
    title: string;
    suptitle: string;
    description: string;
    buttonText: string;
  };
  const stats = t.raw('stats') as { value: string; label: string }[];
  const tiers = t.raw('tiers') as {
    title: string;
    lead: string;
    headers: { tier: string; price: string; time: string; fit: string };
    rows: TierRow[];
  };
  const included = t.raw('included') as { title: string; items: string[] };
  const faq = t.raw('faq') as { title: string; items: { question: string; answer: string }[] };

  return (
    <>
      <Hero {...hero} heroLink="/contact" />
      <StatsBar stats={stats} />

      <section className="px-landing py-12 lg:py-20">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-4">{tiers.title}</h2>
          <p className="text-body1 text-dark-medium max-w-contained mb-8">{tiers.lead}</p>

          {/* Horizontal scroll rather than a stacked card layout on narrow
              screens: the row is the unit of meaning here, and splitting it
              separates a price from the scope that justifies it. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[44rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-dark-primary">
                  <th scope="col" className="text-smallTag uppercase tracking-widest py-3 pr-6">
                    {tiers.headers.tier}
                  </th>
                  <th scope="col" className="text-smallTag uppercase tracking-widest py-3 pr-6">
                    {tiers.headers.price}
                  </th>
                  <th scope="col" className="text-smallTag uppercase tracking-widest py-3 pr-6">
                    {tiers.headers.time}
                  </th>
                  <th scope="col" className="text-smallTag uppercase tracking-widest py-3">
                    {tiers.headers.fit}
                  </th>
                </tr>
              </thead>
              <tbody>
                {tiers.rows.map((row) => (
                  <tr key={row.tier} className="border-b border-dark-medium/30 align-top">
                    <th scope="row" className="py-5 pr-6 text-body1 font-medium text-dark-primary">
                      {row.tier}
                    </th>
                    <td className="py-5 pr-6 text-h3 text-purple-accents whitespace-nowrap">
                      {row.price}
                    </td>
                    <td className="py-5 pr-6 text-body1 text-dark-primary whitespace-nowrap">
                      {row.time}
                    </td>
                    <td className="py-5 text-body1 text-dark-medium">{row.fit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="px-landing py-12 lg:py-20 bg-white">
        <div className="max-w-[88.875rem] mx-auto">
          <h2 className="text-h2 text-dark-primary mb-8">{included.title}</h2>
          <ul className="grid gap-x-12 gap-y-4 md:grid-cols-2 max-w-[70rem]">
            {included.items.map((item) => (
              <li key={item} className="text-body1 text-dark-primary flex gap-3">
                <span aria-hidden="true" className="text-purple-accents">
                  —
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <ServiceFaq title={faq.title} faqs={faq.items} />
    </>
  );
};

export default Pricing;
