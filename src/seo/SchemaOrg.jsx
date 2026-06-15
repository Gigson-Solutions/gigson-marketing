import { Helmet } from 'react-helmet-async';

const ORIGIN = 'https://gigsonsolutions.com';

export function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Gigson Solutions',
    url: ORIGIN,
    logo: `${ORIGIN}/img/gigson-solutions-logo.png`,
    description:
      'Certified Anthropic Claude Partner. Diseñamos, construimos y desplegamos agentes de IA basados en Claude para operaciones empresariales en España. CTO as a Service, integraciones de sistemas y ciberseguridad.',
    foundingDate: '2022',
    areaServed: 'ES',
    sameAs: ['https://www.linkedin.com/company/gigson-solutions'],
    knowsAbout: [
      'Inteligencia Artificial',
      'Agentes IA',
      'CTO as a Service',
      'Transformación Digital',
      'Ciberseguridad',
      'Ingeniería de Software',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certified Anthropic Claude Partner',
      credentialCategory: 'certification',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Anthropic',
        url: 'https://www.anthropic.com',
      },
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function ServiceSchema({
  name,
  description,
  url,
  serviceType,
  areaServed = 'ES',
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${ORIGIN}${url}`,
    serviceType,
    areaServed,
    provider: {
      '@type': 'Organization',
      name: 'Gigson Solutions',
      url: ORIGIN,
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function FAQPageSchema({ faqs }) {
  if (!faqs || faqs.length === 0) return;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
