// ─── Shared logo/tool data for the Holded and Odoo integrations pages ──────
// Both `IntegrationLogosGrid` and `IntegrationContactForm` are generic
// components parametrized by `namespace`; this file holds the per-partner
// data (which third-party tools we show/offer to connect) that used to be
// hardcoded directly inside those components.
//
// NOTE (content accuracy): the Odoo lists below are a curated starting point
// based on well-known, real third-party tools (public knowledge about their
// product categories) — they are NOT a claim of specific past client work.
// Before publishing the `/integrations-odoo` page, confirm this list against
// integrations Gigson has actually implemented for Odoo clients.

export type IntegrationLogo = { name: string; industries: string[]; img: string };

export const HOLDED_INTEGRATION_LOGOS: IntegrationLogo[] = [
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

export const HOLDED_TOOL_OPTIONS: string[] = [
  ...HOLDED_INTEGRATION_LOGOS.map((l) => l.name),
  'Otra',
];

// ─── Odoo ───────────────────────────────────────────────────────────────
// Curated subset: real, well-known third-party tools that commonly connect
// to an Odoo ERP. Reuses existing logo assets where the brand is the same
// (these are plain brand logos, not "X + Holded" composites — verified).
export const ODOO_INTEGRATION_LOGOS: IntegrationLogo[] = [
  // Retail / e-commerce
  { name: 'Shopify',            industries: ['Retail'],       img: '/img/logos-negros/holded-shopify.png' },
  { name: 'WooCommerce',        industries: ['Retail'],       img: '/img/logos-negros/holded-woocomerce.png' },
  { name: 'PrestaShop',         industries: ['Retail'],       img: '/img/logos-negros/prestashop-holded.png' },
  { name: 'Square',             industries: ['Retail'],       img: '/img/logos-negros/square-holded.png' },
  // Logística
  { name: 'Sendcloud',          industries: ['Logística'],    img: '/img/logos-negros/sendcloud-holded.png' },
  { name: 'ShipStation',        industries: ['Logística'],    img: '/img/logos-negros/shipstation-holded.png' },
  { name: 'EasyPost',           industries: ['Logística'],    img: '/img/logos-negros/easypost-holded.png' },
  { name: 'Amazon Seller',      industries: ['Logística'],    img: '/img/logos-negros/amazonseller-holded.png' },
  // CRM / Servicios
  { name: 'HubSpot',            industries: ['Servicios'],    img: '/img/logos-negros/hubspot-holded.png' },
  { name: 'Pipedrive',          industries: ['Servicios'],    img: '/img/logos-negros/pipedrive-holded.png' },
  // RR.HH
  { name: 'Sesame',             industries: ['RR.HH'],        img: '/img/logos-negros/sesame-holded.png' },
  { name: 'Personio',           industries: ['RR.HH'],        img: '/img/logos-negros/personio-holded.png' },
  { name: 'Factorial',          industries: ['RR.HH'],        img: '/img/logos-negros/factorial-holded.png' },
  { name: 'PayFit',             industries: ['RR.HH'],        img: '/img/logos-negros/payfit-holded.png' },
  // Real State
  { name: 'Fotocasa',           industries: ['Real State'],   img: '/img/logos-negros/fotocasa-holded.png' },
  { name: 'Idealista',          industries: ['Real State'],   img: '/img/logos-negros/idealista-holded.png' },
  { name: 'Witei',              industries: ['Real State'],   img: '/img/logos-negros/witei-holded.png' },
  // Educación
  { name: 'Moodle',             industries: ['Educación'],    img: '/img/logos-negros/moodle-holded.png' },
  { name: 'Teachable',          industries: ['Educación'],    img: '/img/logos-negros/teachable-holded.png' },
  // Migración / coexistencia ERP
  { name: 'Holded',             industries: ['Migración ERP'], img: '/img/logos-negros/odoo-holded.png' },
  { name: 'SAP',                industries: ['Migración ERP'], img: '/img/logos-negros/sap-holded.png' },
  { name: 'Sage',               industries: ['Migración ERP'], img: '/img/logos-negros/sage-holded.png' },
  { name: 'Microsoft Dynamics', industries: ['Migración ERP'], img: '/img/logos-negros/microsoftdynamics-holded.png' },
];

export const ODOO_TOOL_OPTIONS: string[] = [
  ...ODOO_INTEGRATION_LOGOS.map((l) => l.name),
  'Otra',
];

// ─── Custom ERP ─────────────────────────────────────────────────────────
// Not a partner/integration page — there's no third-party tool to connect,
// so this reuses the "tool" field of IntegrationContactForm to ask what
// *type* of system the lead needs instead of which product to integrate.
export const CUSTOM_ERP_TOOL_OPTIONS: string[] = [
  'Facturación',
  'Gestión de almacén (WMS)',
  'Producción / Fabricación',
  'CRM',
  'Inventario',
  'Otro',
];
