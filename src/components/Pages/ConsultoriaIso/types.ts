import type { LeadFormId } from '../../../lib/leads/forms';
import type { CostsTimelineCopy } from '../../../shared/ui/CostsTimeline';
import type { SelfAssessmentCopy } from '../../../shared/ui/SelfAssessment';

/**
 * Todo el texto de una landing de campaña ISO. Las dos landings
 * (/es/certificacion-iso-27001 y /es/consultoria-iso-42001) comparten maqueta
 * (ConsultoriaIso.tsx) y solo cambia este objeto.
 */
export type ConsultoriaIsoContent = {
  formId: LeadFormId;
  pill: string;
  title: string;
  subtitle: string;
  bullets: string[];
  audience: string[];

  form: {
    title: string;
    puntoLegend: string;
    puntos: { value: string; label: string }[];
    messageLabel: string;
    messagePlaceholder: string;
  };

  why: {
    eyebrow: string;
    title: string;
    description: string;
    items: { title: string; description: string }[];
  };
  approach: {
    eyebrow: string;
    title: string;
    items: { title: string; description: string }[];
  };

  scope: {
    eyebrow: string;
    title: string;
    lead: string;
    blocks: { figure: string; title: string; description: string }[];
    deliverables: string[];
    panel: {
      title: string;
      caption: string;
      /** Barras de progreso (27001) o filas con etiqueta de riesgo (42001). */
      bars?: { label: string; value: string; percent: number }[];
      summary?: { figure: string; text: string };
      systems?: { name: string; risk: string; level: 'hi' | 'mid' | 'lo' }[];
    };
  };

  selfAssessment: SelfAssessmentCopy;
  process: {
    eyebrow: string;
    h2a: string;
    h2b?: string;
    lead: string;
    steps: { title: string; description: string }[];
  };
  costs: CostsTimelineCopy;
  faqs: { question: string; answer: string }[];
  final: { title: string; text: string };
  disclaimer: string;
};
