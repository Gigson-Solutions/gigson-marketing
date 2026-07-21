import type { Metadata } from 'next';

import '../../../../src/components/Pages/Iso27001/Iso27001.css';

const ORIGIN = 'https://gigsonsolutions.com';

export function generateMetadata(): Metadata {
  return {
    title: 'Gracias · gigson solutions',
    description: 'Hemos recibido tus datos. En breve nos pondremos en contacto contigo.',
    robots: {
      index: false,
      follow: false,
    },
    alternates: {
      canonical: `${ORIGIN}/es/gracias-iso27001`,
    },
  };
}

export default function GraciasIso27001Page() {
  return (
    <div className="iso27001">
      <section className="formsec">
        <div className="formsec-inner" style={{ gridTemplateColumns: '1fr', justifyItems: 'center' }}>
          <div className="form-card" style={{ maxWidth: 560, width: '100%' }}>
            <div className="success visible" aria-live="polite">
              <div className="success-mark">
                <svg viewBox="0 0 24 24"><polyline points="4,12 10,18 20,6" /></svg>
              </div>
              <h3>Hemos recibido tus datos</h3>
              <p>Gracias por contactar con gigson solutions. Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo en menos de 24&nbsp;h.</p>
              <a href="https://calendar.app.google/ZAYNg9onVuqktmxH6" target="_blank" rel="noopener noreferrer" className="btn is-wide">
                Reservar una llamada ahora
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
