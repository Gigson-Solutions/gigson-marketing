'use client';

import { useState } from 'react';

type FaqItem = { question: string; answer: string };

/**
 * Interactive FAQ accordion for the `faq` richText block
 * (`collections/blocks/FaqBlock.ts`). First item open by default.
 * Pattern seen on competitor AI-agent blogs (Companies Automation) during
 * the 2026-08 SEO/content review — reinforces trust and is a common
 * FAQPage-schema-eligible format, same one already used on the sector
 * pages via `ServiceFaq`.
 */
const FaqAccordion = ({ heading, items }: { heading?: string; items: FaqItem[] }) => {
  const [openIndex, setOpenIndex] = useState<number>(0);

  if (items.length === 0) return null;

  return (
    <div className="not-prose my-8">
      {heading && <p className="text-h4 text-dark-primary mb-4">{heading}</p>}
      <div className="flex flex-col divide-y divide-ink/10 border border-ink/10 rounded-[20px] overflow-hidden">
        {items.map((item, index) => {
          const isOpen = index === openIndex;
          return (
            <div key={item.question} className="bg-cream">
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="text-body text-dark-primary font-medium">{item.question}</span>
                <span
                  className="shrink-0 transition-transform duration-150"
                  style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 1V13M1 7H13" stroke="#7874F4" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-body text-dark-medium">{item.answer}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FaqAccordion;
