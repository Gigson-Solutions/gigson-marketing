'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const INDUSTRIES = [
  'Todos', 'Retail', 'Veterinario', 'Dental', 'Construcción', 'Educación',
  'Clínicas', 'Hostelería', 'CRM/ERP', 'Logística', 'Servicios', 'Real State', 'RR.HH',
];

type Logo = { name: string; industries: string[]; url: string };

const LOGOS: Logo[] = [
  { name: 'Shopify', industries: ['Retail'], url: '/img/logos-negros/holded-shopify.png' },
  { name: 'WooCommerce', industries: ['Retail'], url: '/img/logos-negros/holded-woocomerce.png' },
  { name: 'Printify', industries: ['Retail'], url: '/img/logos-negros/printify.png' },
  { name: 'Square', industries: ['Retail'], url: '/img/logos-negros/square-holded.png' },
  { name: 'PrestaShop', industries: ['Retail'], url: '/img/logos-negros/prestashop-holded.png' },
  { name: 'Gestor Vet', industries: ['Veterinario'], url: '/img/logos-negros/gestor-vet-holded.png' },
  { name: 'Provetcloud', industries: ['Veterinario'], url: '/img/logos-negros/provetcloud-holded.png' },
  { name: 'QVET', industries: ['Veterinario'], url: '/img/logos-negros/qvet-holded.png' },
  { name: 'Wakyma Vets', industries: ['Veterinario'], url: '/img/logos-negros/wakyma-vets-holded.png' },
  { name: 'WinVet', industries: ['Veterinario'], url: '/img/logos-negros/winvet-holded.png' },
  { name: 'Dentalink', industries: ['Dental'], url: '/img/logos-negros/dentalink-holded.png' },
  { name: 'Gesden', industries: ['Dental'], url: '/img/logos-negros/gesden-holded.png' },
  { name: 'Orisdent', industries: ['Dental'], url: '/img/logos-negros/orisdent-holded.png' },
  { name: 'Dendoo', industries: ['Dental'], url: '/img/logos-negros/dendoo-holded.png' },
  { name: 'DasieClinic', industries: ['Dental'], url: '/img/logos-negros/dasieclinic-holded.png' },
  { name: 'Presto', industries: ['Construcción'], url: '/img/logos-negros/presto-holded.png' },
  { name: 'Revit', industries: ['Construcción'], url: '/img/logos-negros/revit-holded.png' },
  { name: 'BuildingMe', industries: ['Construcción'], url: '/img/logos-negros/buildingme-holded.png' },
  { name: 'Construdata', industries: ['Construcción'], url: '/img/logos-negros/construdata-holded.png' },
  { name: 'PlanHopper', industries: ['Construcción'], url: '/img/logos-negros/planhopper-holded.png' },
  { name: 'Kajabi', industries: ['Educación'], url: '/img/logos-negros/kajabi-holded.png' },
  { name: 'Teachable', industries: ['Educación'], url: '/img/logos-negros/teachable-holded.png' },
  { name: 'Moodle', industries: ['Educación'], url: '/img/logos-negros/moodle-holded.png' },
  { name: 'Thinkific', industries: ['Educación'], url: '/img/logos-negros/thinkific-holded.png' },
  { name: 'Classlife', industries: ['Educación'], url: '/img/logos-negros/classlife-holded.png' },
  { name: 'Cliniko', industries: ['Clínicas'], url: '/img/logos-negros/cliniko-holded.png' },
  { name: 'Timp', industries: ['Clínicas'], url: '/img/logos-negros/timp-holded.png' },
  { name: 'Flow', industries: ['Clínicas'], url: '/img/logos-negros/flow-holded.png' },
  { name: 'Doctoralia', industries: ['Clínicas'], url: '/img/logos-negros/doctoralia-holded.png' },
  { name: 'AgendaPro', industries: ['Clínicas'], url: '/img/logos-negros/agendapro-holded.png' },
  { name: 'CoverManager', industries: ['Hostelería'], url: '/img/logos-negros/covermanager-holded.png' },
  { name: 'Revo', industries: ['Hostelería'], url: '/img/logos-negros/revo-holded.png' },
  { name: 'LastApp', industries: ['Hostelería'], url: '/img/logos-negros/lastapp-holded.png' },
  { name: 'FrontRest', industries: ['Hostelería'], url: '/img/logos-negros/frontrest-holded.png' },
  { name: 'MissTipsi', industries: ['Hostelería'], url: '/img/logos-negros/misstipsi-holded.png' },
  { name: 'SAP', industries: ['CRM/ERP'], url: '/img/logos-negros/sap-holded.png' },
  { name: 'Odoo', industries: ['CRM/ERP'], url: '/img/logos-negros/odoo-holded.png' },
  { name: 'Sage', industries: ['CRM/ERP'], url: '/img/logos-negros/sage-holded.png' },
  { name: 'NetSuite', industries: ['CRM/ERP'], url: '/img/logos-negros/netsuite-holded.png' },
  { name: 'Microsoft Dynamics', industries: ['CRM/ERP'], url: '/img/logos-negros/microsoftdynamics-holded.png' },
  { name: 'Sendcloud', industries: ['Logística'], url: '/img/logos-negros/sendcloud-holded.png' },
  { name: 'ShipStation', industries: ['Logística'], url: '/img/logos-negros/shipstation-holded.png' },
  { name: 'EasyPost', industries: ['Logística'], url: '/img/logos-negros/easypost-holded.png' },
  { name: 'Saloodo', industries: ['Logística'], url: '/img/logos-negros/saloodo-holded.png' },
  { name: 'Amazon Seller', industries: ['Logística'], url: '/img/logos-negros/amazonseller-holded.png' },
  { name: 'HubSpot', industries: ['Servicios'], url: '/img/logos-negros/hubspot-holded.png' },
  { name: 'Harvest', industries: ['Servicios'], url: '/img/logos-negros/harvest-holded.png' },
  { name: 'Pipedrive', industries: ['Servicios'], url: '/img/logos-negros/pipedrive-holded.png' },
  { name: 'FreshBooks', industries: ['Servicios'], url: '/img/logos-negros/freshbooks-holded.png' },
  { name: 'TemaLeader', industries: ['Servicios'], url: '/img/logos-negros/temaleader-holded.png' },
  { name: 'Fotocasa', industries: ['Real State'], url: '/img/logos-negros/fotocasa-holded.png' },
  { name: 'Witei', industries: ['Real State'], url: '/img/logos-negros/witei-holded.png' },
  { name: 'Tokko', industries: ['Real State'], url: '/img/logos-negros/tokko-holded.png' },
  { name: 'InmoVilla', industries: ['Real State'], url: '/img/logos-negros/inmovilla-holded.png' },
  { name: 'Idealista', industries: ['Real State'], url: '/img/logos-negros/idealista-holded.png' },
  { name: 'Sesame', industries: ['RR.HH'], url: '/img/logos-negros/sesame-holded.png' },
  { name: 'Personio', industries: ['RR.HH'], url: '/img/logos-negros/personio-holded.png' },
  { name: 'PayFit', industries: ['RR.HH'], url: '/img/logos-negros/payfit-holded.png' },
  { name: 'Factorial', industries: ['RR.HH'], url: '/img/logos-negros/factorial-holded.png' },
  { name: 'Bizneo', industries: ['RR.HH'], url: '/img/logos-negros/bizneo-holded.png' },
];

const LogoBadge = ({ name, url }: Logo) => (
  <a
    href="#contacto"
    aria-label={`Integrar ${name} con Holded`}
    className="group flex items-center justify-center bg-white rounded-xl px-3 py-3 lg:px-5 lg:py-4 min-h-[56px] lg:min-h-[70px] shadow-sm border border-transparent hover:border-purple-accents hover:shadow-md transition-all duration-200 cursor-pointer"
  >
    <img
      src={url}
      alt={name}
      className="max-h-[30px] max-w-[80px] lg:max-h-[40px] lg:max-w-[110px] object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-200"
    />
  </a>
);

const IntegrationLogosGrid = () => {
  const t = useTranslations('integrations-holded');
  const logos = t.raw('logos') as { title: string; subtitle: string; mainCta: string };
  const [activeIndustry, setActiveIndustry] = useState('Todos');
  const [expanded, setExpanded] = useState(false);

  const filtered = activeIndustry === 'Todos' ? LOGOS : LOGOS.filter((l) => l.industries.includes(activeIndustry));

  const handleFilterChange = (ind: string) => {
    setActiveIndustry(ind);
    setExpanded(false);
  };

  const collapsed = !expanded;

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
              onClick={() => handleFilterChange(ind)}
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

        {/* Logo grid wrapper — clipped on mobile when collapsed */}
        <div className={`relative ${collapsed ? 'max-h-[260px] overflow-hidden lg:max-h-none lg:overflow-visible' : ''} mb-4 lg:mb-12`}>
          <div className="grid grid-cols-2 gap-3 lg:flex lg:flex-wrap lg:gap-4">
            {filtered.map((logo) => (
              <LogoBadge key={logo.name} {...logo} />
            ))}
          </div>

          {/* Gradient fade — mobile only, when collapsed */}
          {collapsed && (
            <div
              className="lg:hidden absolute bottom-0 left-0 right-0 h-28 pointer-events-none"
              style={{ background: 'linear-gradient(to top, #f4f3ef 40%, transparent)' }}
            />
          )}
        </div>

        {/* Mostrar más — mobile only, when collapsed and enough logos */}
        {collapsed && filtered.length > 4 && (
          <div className="lg:hidden flex justify-center mb-8">
            <button
              onClick={() => setExpanded(true)}
              className="text-dark-primary text-button border border-[#E0DFDF] rounded-full px-6 py-2 bg-white hover:border-purple-accents hover:text-purple-accents transition duration-200"
            >
              Mostrar más
            </button>
          </div>
        )}

        <div className="flex justify-center">
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
