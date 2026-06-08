import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const INDUSTRIES = [
  'Todos',
  'Retail',
  'Veterinario',
  'Dental',
  'Construcción',
  'Educación',
  'Clínicas',
  'Hostelería',
  'CRM/ERP',
  'Logística',
  'Servicios',
  'Real State',
  'RR.HH',
];

const LOGOS = [
  {
    name: 'Shopify',
    industries: ['Retail'],
    url: 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
  },
  {
    name: 'WooCommerce',
    industries: ['Retail'],
    url: 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
  },
  {
    name: 'Printify',
    industries: ['Retail'],
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Printify_logo.svg/320px-Printify_logo.svg.png',
  },
  {
    name: 'Square',
    industries: ['Retail'],
    url: 'https://cdn.worldvectorlogo.com/logos/square-2.svg',
  },
  {
    name: 'PrestaShop',
    industries: ['Retail'],
    url: 'https://cdn.worldvectorlogo.com/logos/prestashop.svg',
  },
  { name: 'Gestor Vet', industries: ['Veterinario'], url: '' },
  { name: 'Provetcloud', industries: ['Veterinario'], url: '' },
  { name: 'QVET', industries: ['Veterinario'], url: '' },
  { name: 'Wakyma Vets', industries: ['Veterinario'], url: '' },
  { name: 'WinVet', industries: ['Veterinario'], url: '' },
  { name: 'Dentalink', industries: ['Dental'], url: '' },
  { name: 'Gesden', industries: ['Dental'], url: '' },
  { name: 'Orisdent', industries: ['Dental'], url: '' },
  { name: 'Dendoo', industries: ['Dental'], url: '' },
  { name: 'DasieClinic', industries: ['Dental'], url: '' },
  { name: 'Presto', industries: ['Construcción'], url: '' },
  {
    name: 'Revit',
    industries: ['Construcción'],
    url: 'https://cdn.worldvectorlogo.com/logos/autodesk-revit.svg',
  },
  { name: 'BuildingMe', industries: ['Construcción'], url: '' },
  { name: 'Construdata', industries: ['Construcción'], url: '' },
  { name: 'PlanHopper', industries: ['Construcción'], url: '' },
  {
    name: 'Kajabi',
    industries: ['Educación'],
    url: 'https://cdn.worldvectorlogo.com/logos/kajabi.svg',
  },
  { name: 'Teachable', industries: ['Educación'], url: '' },
  {
    name: 'Moodle',
    industries: ['Educación'],
    url: 'https://cdn.worldvectorlogo.com/logos/moodle.svg',
  },
  { name: 'Thinkific', industries: ['Educación'], url: '' },
  { name: 'Classlife', industries: ['Educación'], url: '' },
  { name: 'Cliniko', industries: ['Clínicas'], url: '' },
  { name: 'Timp', industries: ['Clínicas'], url: '' },
  { name: 'Flow', industries: ['Clínicas'], url: '' },
  { name: 'Doctoralia', industries: ['Clínicas'], url: '' },
  { name: 'AgendaPro', industries: ['Clínicas'], url: '' },
  { name: 'CoverManager', industries: ['Hostelería'], url: '' },
  { name: 'Revo', industries: ['Hostelería'], url: '' },
  { name: 'LastApp', industries: ['Hostelería'], url: '' },
  { name: 'FrontRest', industries: ['Hostelería'], url: '' },
  { name: 'MissTipsi', industries: ['Hostelería'], url: '' },
  {
    name: 'SAP',
    industries: ['CRM/ERP'],
    url: 'https://cdn.worldvectorlogo.com/logos/sap-3.svg',
  },
  {
    name: 'Odoo',
    industries: ['CRM/ERP'],
    url: 'https://cdn.worldvectorlogo.com/logos/odoo.svg',
  },
  { name: 'Sage', industries: ['CRM/ERP'], url: '' },
  { name: 'NetSuite', industries: ['CRM/ERP'], url: '' },
  {
    name: 'Microsoft Dynamics',
    industries: ['CRM/ERP'],
    url: 'https://cdn.worldvectorlogo.com/logos/microsoft-dynamics-2.svg',
  },
  { name: 'Sendcloud', industries: ['Logística'], url: '' },
  { name: 'ShipStation', industries: ['Logística'], url: '' },
  { name: 'EasyPost', industries: ['Logística'], url: '' },
  { name: 'Saloodo', industries: ['Logística'], url: '' },
  {
    name: 'Amazon Seller',
    industries: ['Logística'],
    url: 'https://cdn.worldvectorlogo.com/logos/amazon-2.svg',
  },
  {
    name: 'HubSpot',
    industries: ['Servicios'],
    url: 'https://cdn.worldvectorlogo.com/logos/hubspot.svg',
  },
  { name: 'Harvest', industries: ['Servicios'], url: '' },
  {
    name: 'Pipedrive',
    industries: ['Servicios'],
    url: 'https://cdn.worldvectorlogo.com/logos/pipedrive.svg',
  },
  {
    name: 'FreshBooks',
    industries: ['Servicios'],
    url: 'https://cdn.worldvectorlogo.com/logos/freshbooks.svg',
  },
  { name: 'TemaLeader', industries: ['Servicios'], url: '' },
  { name: 'Fotocasa', industries: ['Real State'], url: '' },
  { name: 'Witei', industries: ['Real State'], url: '' },
  { name: 'Tokko', industries: ['Real State'], url: '' },
  { name: 'InmoVilla', industries: ['Real State'], url: '' },
  { name: 'Idealista', industries: ['Real State'], url: '' },
  { name: 'Sesame', industries: ['RR.HH'], url: '' },
  { name: 'Personio', industries: ['RR.HH'], url: '' },
  { name: 'PayFit', industries: ['RR.HH'], url: '' },
  {
    name: 'Factorial',
    industries: ['RR.HH'],
    url: 'https://cdn.worldvectorlogo.com/logos/factorial.svg',
  },
  { name: 'Bizneo', industries: ['RR.HH'], url: '' },
];

const LogoBadge = ({ name, url }) => {
  if (url) {
    return (
      <div className="flex items-center justify-center bg-white rounded-xl px-5 py-4 min-w-[120px] min-h-[70px] shadow-sm">
        <img
          src={url}
          alt={name}
          className="max-h-[40px] max-w-[110px] object-contain grayscale hover:grayscale-0 transition duration-300"
        />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center bg-white rounded-xl px-5 py-4 min-w-[120px] min-h-[70px] shadow-sm">
      <span className="text-dark-primary text-smallTag font-medium text-center">
        {name}
      </span>
    </div>
  );
};

const IntegrationLogosGrid = () => {
  const { t } = useTranslation();
  const { title, subtitle, mainCta } = t('integrations-holded.logos');
  const [activeIndustry, setActiveIndustry] = useState('Todos');

  const filtered =
    activeIndustry === 'Todos'
      ? LOGOS
      : LOGOS.filter((l) => l.industries.includes(activeIndustry));

  return (
    <section className="px-landing py-14 lg:py-20 bg-[#f4f3ef]">
      <div className="max-w-[88.875rem] mx-auto">
        <h2 className="text-h2 text-dark-primary mb-4">{title}</h2>
        <p className="text-subtitle text-dark-medium mb-10">{subtitle}</p>

        {/* Filtros por industria */}
        <div className="flex flex-wrap gap-3 mb-10">
          {INDUSTRIES.map((ind) => (
            <button
              key={ind}
              onClick={() => setActiveIndustry(ind)}
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

        {/* Grid de logos */}
        <div className="flex flex-wrap gap-4 mb-12">
          {filtered.map((logo) => (
            <LogoBadge key={logo.name} name={logo.name} url={logo.url} />
          ))}
        </div>

        {/* CTA principal */}
        <div className="flex justify-center">
          <a
            href="#contacto"
            className="inline-block bg-purple-accents text-white text-button rounded-full py-3 px-8 hover:opacity-80 transition duration-200 ease-linear uppercase"
          >
            {mainCta}
          </a>
        </div>
      </div>
    </section>
  );
};

export default IntegrationLogosGrid;
