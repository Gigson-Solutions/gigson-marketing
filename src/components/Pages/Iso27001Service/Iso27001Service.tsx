'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import Brand from 'shared/Brand';
import CostsTimeline, { type CostsTimelineCopy } from 'shared/CostsTimeline';
import Hero from 'shared/Hero';
import ProcessSteps from 'shared/ProcessSteps';
import SelfAssessment, {
  type SelfAssessmentCopy,
  type SelfAssessmentResult,
} from 'shared/SelfAssessment';
import { ServiceFaq } from 'shared/ServiceFaq';
import SolutionsApplications from 'shared/SolutionsApplications';

import Form from '../../Form';

type FaqItem = { question: string; answer: string };

const Iso27001Service = () => {
  const t = useTranslations('iso27001Service');
  const [quiz, setQuiz] = useState<SelfAssessmentResult | null>(null);

  const hero = t.raw('hero') as {
    title: string;
    suptitle: string;
    description: string;
    buttonText: string;
  };
  const solutionsApplications = t.raw('solutionsApplications') as Parameters<
    typeof SolutionsApplications
  >[0];
  const selfAssessment = t.raw('selfAssessment') as SelfAssessmentCopy;
  const howWeWork = t.raw('howWeWork') as Parameters<typeof ProcessSteps>[0];
  const costs = t.raw('costs') as CostsTimelineCopy;
  const faq = t.raw('faq') as { title: string; items: FaqItem[] } | undefined;

  // The quiz has no form of its own: its result rides along with the page's
  // single lead form, so the page keeps one conversion point.
  const quizSummary = quiz
    ? t('selfAssessmentSummary', {
        score: quiz.score,
        gaps:
          quiz.gaps.length > 0
            ? quiz.gaps.join('; ')
            : t('selfAssessmentNoGaps'),
      })
    : undefined;

  return (
    <>
      <Hero {...hero} heroLink="#contacto" />
      <SolutionsApplications {...solutionsApplications} />
      <SelfAssessment {...selfAssessment} onComplete={setQuiz} />
      <ProcessSteps {...howWeWork} />
      <CostsTimeline {...costs} />
      <div className="wrapper">
        <Form
          formId="service-iso-27001"
          defaultServiceIndex={5}
          extraFields={
            quizSummary ? { autodiagnostico: quizSummary } : undefined
          }
          notice={
            quiz ? t('selfAssessmentNotice', { score: quiz.score }) : undefined
          }
        />
      </div>
      {faq && <ServiceFaq title={faq.title} faqs={faq.items} />}
      <Brand />
    </>
  );
};

export default Iso27001Service;
