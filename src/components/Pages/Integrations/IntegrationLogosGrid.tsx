'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// ─── Logo data with local PNG paths ──────────────────────────────────────────
type Logo = { name: string; industries: string[]; img: string };

const LOGOS: Logo[] = [
  // Retail
  { name: 'Shopify',            industries: ['Retail'],       img: '/img/logos-negros/holded-shopify.png' },
  { name: 'WooCommerce',        industries: ['Retail'],       img: '/img/logos-negros/holded-woocomerce.png' },
  { name: 'Printify',           industries: ['Retail'],       img: '/img/logos-negros/printify.png' },
  { name: 'Square',             industries: ['Retail'],       img: '/img/logos-negros/square-holded.png' },
  { name: 'PrestaShop',         industries: ['Retail'],       img: '/img/logos-negros/prestashop-holded.png' },
  // Veterinario
  { name: 'Gestor Vet',         industries: ['Veterinario'],  img: '/img/logos-negros/gestor-vet-holded.png' },
  { name: 'Provetcloud',        industries: ['Veterinario'],  img: '/img/logos-negros/provetcloud-holded.png' },
  { name: 'QVET',               industries: ['Veterinario'],  img: '/img/logos-negros/qvet-holded.png' },
  { name: 'Wakyma Vets',        industries: ['Veterinario'],  img: '/img/logos-negros/wakyma-vets-holded.png' },
  { name: 'WinVet',             industries: ['Veterinario'],  img: '/img/logos-negros/winvet-holded.png' },
  // Dental
  { name: 'Dentalink',          industries: ['Dental'],       img: '/img/logos-negros/dentalink-holded.png' },
  { name: 'Gesden',             industries: ['Dental'],       img: '/img/logos-negros/gesden-holded.png' },
  { name: 'Orisdent',           industries: ['Dental'],       img: '/img/logos-negros/orisdent-holded.png' },
  { name: 'Dendoo',             industries: ['Dental'],       img: '/img/logos-negros/dendoo-holded.png' },
  { name: 'DasieClinic',        industries: ['Dental'],       img: '/img/logos-negros/dasieclinic-holded.png' },
  // Construcción
  { name: 'Presto',             industries: ['Construcción'], img: '/img/logos-negros/presto-holded.png' },
  { name: 'Revit',              industries: ['Construcción'], img: '/img/logos-negros/revit-holded.png' },
  { name: 'BuildingMe',         industries: ['Construcción'], img: '/img/logos-negros/buildingme-holded.png' },
  { name: 'Construdata',        industries: ['Construcción'], img: '/img/logos-negros/construdata-holded.png' },
  { name: 'PlanHopper',         industries: ['Construcción'], img: '/img/logos-negros/planhopper-holded.png' },
  // Educación
  { name: 'Kajabi',             industries: ['Educación'],    img: '/img/logos-negros/kajabi-holded.png' },
  { name: 'Teachable',          industries: ['Educación'],    img: '/img/logos-negros/teachable-holded.png' },
  { name: 'Moodle',             industries: ['Educación'],    img: '/img/logos-negros/moodle-holded.png' },
  { name: 'Thinkific',          industries: ['Educación'],    img: '/img/logos-negros/thinkific-holded.png' },
  { name: 'Classlife',          industries: ['Educación'],    img: '/img/logos-negros/classlife-holded.png' },
  // Clínicas
  { name: 'Cliniko',            industries: ['Clínicas'],     img: '/img/logos-negros/cliniko-holded.png' },
  { name: 'Timp',               industries: ['Clínicas'],     img: '/img/logos-negros/timp-holded.png' },
  { name: 'Flow',               industries: ['Clínicas'],     img: '/img/logos-negros/flow-holded.png' },
  { name: 'Doctoralia',         industries: ['Clínicas'],     img: '/img/logos-negros/doctoralia-holded.png' },
  { name: 'AgendaPro',          industries: ['Clínicas'],     img: '/img/logos-negros/agendapro-holded.png' },
  // Hostelería
  { name: 'CoverManager',       industries: ['Hostelería'],   img: '/img/logos-negros/covermanager-holded.png' },
  { name: 'Revo',               industries: ['Hostelería'],   img: '/img/logos-negros/revo-holded.png' },
  { name: 'LastApp',            industries: ['Hostelería'],   img: '/img/logos-negros/lastapp-holded.png' },
  { name: 'FrontRest',          industries: ['Hostelería'],   img: '/img/logos-negros/frontrest-holded.png' },
  { name: 'MissTipsi',          industries: ['Hostelería'],   img: '/img/logos-negros/misstipsi-holded.png' },
  // CRM/ERP
  { name: 'SAP',                industries: ['CRM/ERP'],      img: '/img/logos-negros/sap-holded.png' },
  { name: 'Odoo',               industries: ['CRM/ERP'],      img: '/img/logos-negros/odoo-holded.png' },
  { name: 'Sage',               industries: ['CRM/ERP'],      img: '/img/logos-negros/sage-holded.png' },
  { name: 'NetSuite',           industries: ['CRM/ERP'],      img: '/img/logos-negros/netsuite-holded.png' },
  { name: 'Microsoft Dynamics', industries: ['CRM/ERP'],      img: '/img/logos-negros/microsoftdynamics-holded.png' },
  // Logística
  { name: 'Sendcloud',          industries: ['Logística'],    img: '/img/logos-negros/sendcloud-holded.png' },
  { name: 'ShipStation',        industries: ['Logística'],    img: '/img/logos-negros/shipstation-holded.png' },
  { name: 'EasyPost',           industries: ['Logística'],    img: '/img/logos-negros/easypost-holded.png' },
  { name: 'Saloodo',            industries: ['Logística'],    img: '/img/logos-negros/saloodo-holded.png' },
  { name: 'Amazon Seller',      industries: ['Logística'],    img: '/img/logos-negros/amazonseller-holded.png' },
  // Servicios
  { name: 'HubSpot',            industries: ['Servicios'],    img: '/img/logos-negros/hubspot-holded.png' },
  { name: 'Harvest',            industries: ['Servicios'],    img: '/img/logos-negros/harvest-holded.png' },
  { name: 'Pipedrive',          industries: ['Servicios'],    img: '/img/logos-negros/pipedrive-holded.png' },
  { name: 'FreshBooks',         industries: ['Servicios'],    img: '/img/logos-negros/freshbooks-holded.png' },
  { name: 'TemaLeader',         industries: ['Servicios'],    img: '/img/logos-negros/temaleader-holded.png' },
  // Real State
  { name: 'Fotocasa',           industries: ['Real State'],   img: '/img/logos-negros/fotocasa-holded.png' },
  { name: 'Witei',              industries: ['Real State'],   img: '/img/logos-negros/witei-holded.png' },
  { name: 'Tokko',              industries: ['Real State'],   img: '/img/logos-negros/tokko-holded.png' },
  { name: 'InmoVilla',          industries: ['Real State'],   img: '/img/logos-negros/inmovilla-holded.png' },
  { name: 'Idealista',          industries: ['Real State'],   img: '/img/logos-negros/idealista-holded.png' },
  // RR.HH
  { name: 'Sesame',             industries: ['RR.HH'],        img: '/img/logos-negros/sesame-holded.png' },
  { name: 'Personio',           industries: ['RR.HH'],        img: '/img/logos-negros/personio-holded.png' },
  { name: 'PayFit',             industries: ['RR.HH'],        img: '/img/logos-negros/payfit-holded.png' },
  { name: 'Factorial',          industries: ['RR.HH'],        img: '/img/logos-negros/factorial-holded.png' },
  { name: 'Bizneo',             industries: ['RR.HH'],        img: '/img/logos-negros/bizneo-holded.png' },
];

const INDUSTRIES = [
  'Todos', 'Retail', 'Veterinario', 'Dental', 'Construcción', 'Educación',
  'Clínicas', 'Hostelería', 'CRM/ERP', 'Logística', 'Servicios', 'Real State', 'RR.HH',
];

// ─── Logo badge — clickable card ──────────────────────────────────────────────
const LogoBadge = ({ name, img }: Logo) => (
  <a
    href="#contacto"
    title={`Conectar ${name} con Holded`}
    className="group flex items-center justify-center bg-white rounded-xl border border-transparent hover:border-purple-accents transition duration-200 cursor-pointer"
    style={{ padding: '12px 10px', minHeight: '60px' }}
  >
    <img
      src={img}
      alt={name}
      className="max-h-[30px] max-w-[80px] lg:max-h-[40px] lg:max-w-[110px] object-contain opacity-70 group-hover:opacity-100 transition duration-200"
    />
  </a>
);

// ─── Grid component ───────────────────────────────────────────────────────────
const IntegrationLogosGrid = () => {
  const t = useTranslations('integrations-holded');
  const logos = t.raw('logos') as { title: string; subtitle: string; mainCta: string };

  const [activeIndustry, setActiveIndustry] = useState('Todos');
  const [collapsed, setCollapsed] = useState(true);

  const filtered =
    activeIndustry === 'Todos'
      ? LOGOS
      : LOGOS.filter((l) => l.industries.includes(activeIndustry));

  // Reset collapse when filter changes
  const handleIndustryChange = (ind: string) => {
    setActiveIndustry(ind);
    setCollapsed(true);
  };

  return (
    <section className="px-landing py-14 lg:py-20 bg-[#f4f3ef]">
      <div className="max-w-[88.875rem] mx-auto">
        <h2 className="text-h2 text-dark-primary mb-4">{logos.title}</h2>
        <p className="text-subtitle text-dark-medium mb-10">{logos.subtitle}</p>

        {/* Industry filters */}
        <div className="flex flex-wrap gap-3 mb-10">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => handleIndustryChange(ind)}
              className={`text-smallTag rounded-full px-4 py-2 border transition duration-200 ${
                activeIndustry === ind
                  ? 'bg-purple-accents text-white border-purple-accents'
                  : 'bg-white text-dark-primary border-[#E0DFDF] hover:border-purple-accents hover:text-purple-accents'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>

        {/* Logo grid with mobile collapse */}
        <div className="relative mb-6">
          <div
            className={`grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:gap-4 ${
              collapsed ? 'max-h-[260px] overflow-hidden lg:max-h-none lg:overflow-visible' : ''
            }`}
          >
            {filtered.map((logo) => (
              <LogoBadge key={logo.name} {...logo} />
            ))}
          </div>

          {/* Gradient fade + "Mostrar más" — mobile only */}
          {collapsed && (
            <div className="lg:hidden">
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to bottom, transparent, #f4f3ef)',
                }}
              />
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setCollapsed(false)}
                  className="text-purple-accents text-button underline hover:opacity-70 transition"
                >
                  Mostrar más
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Main CTA */}
        <div className="flex justify-center mt-8">
          <a
            href="#contacto"
            className="inline-block bg-purple-accents text-white text-button rounded-full py-3 px-8 hover:opacity-80 transition duration-200 ease-linear uppercase"
          >
            {logos.mainCta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationLogosGrid;
