'use client';

import './Faqs.css';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import cono from '../../../assets/cone.svg';
import pentagono from '../../../assets/pentagon.svg';
import { RichText } from '../../../shared/ui/RichText';
import { FaqsAccordion } from './FaqsAccordion/FaqsAccordion';

type FaqItem = { title?: string; question: string; answer: string; cta?: string };
type FaqGroup = { title?: string; items: { item: FaqItem; index: number }[] };

/**
 * Las traducciones llegan como una lista plana en la que las cabeceras de
 * categoría son ítems con `title` y sin `question`. Agrupamos cada cabecera con
 * las preguntas que la siguen para poder maquetar título y preguntas en
 * columnas distintas. Conservamos el índice original de cada pregunta para no
 * alterar el estado de apertura del acordeón.
 */
const groupByCategory = (items: FaqItem[]): FaqGroup[] =>
  items.reduce<FaqGroup[]>((groups, item, index) => {
    if (item.title) groups.push({ title: item.title, items: [] });
    if (!item.question) return groups;
    if (!groups.length) groups.push({ items: [] });
    groups[groups.length - 1].items.push({ item, index });
    return groups;
  }, []);

const Faqs = () => {
  const t = useTranslations();
  const title = t.raw('faqsH1') as string;
  const faqsData = t.raw('faqsDropdown') as FaqItem[];

  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  const handleItemClick = (index: number) =>
    setActiveIndex((prev) => (prev === index ? undefined : index));

  const conoSrc = typeof cono === 'string' ? cono : (cono as { src: string }).src;
  const pentagonoSrc = typeof pentagono === 'string' ? pentagono : (pentagono as { src: string }).src;

  return (
    <section className="faqs-section">
      <div className="wrapper">
        <div className="hero-faqs">
          <RichText as="h1" content={title} className="hero-faqs-h1" />
          <div className="faqs-imgs">
            <img src={pentagonoSrc} alt="" />
            <img src={conoSrc} alt="" />
          </div>
        </div>

        {groupByCategory(faqsData).map((group, groupIndex) => (
          <div key={groupIndex} className="faqs-accordion">
            {group.title && <h2 className="faqs-accordion-h2">{group.title}</h2>}
            <div className="faqs-accordion-items">
              {group.items.map(({ item, index }) => (
                <FaqsAccordion
                  key={index}
                  question={item.question}
                  answer={item.answer}
                  isOpen={activeIndex === index}
                  onClick={() => handleItemClick(index)}
                  isLast={index === faqsData.length - 1}
                  cta={item.cta}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faqs;
