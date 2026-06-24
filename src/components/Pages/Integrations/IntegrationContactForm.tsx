'use client';

import '../../Form.css';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Bgcont from '../../../assets/Group 33770.svg';
import Button from '../../../shared/ui/Button';

// ─── All integrations available in the multiselect ───────────────────────────
const ALL_TOOLS = [
  'Shopify', 'WooCommerce', 'Printify', 'Square', 'PrestaShop',
  'Gestor Vet', 'Provetcloud', 'QVET', 'Wakyma Vets', 'WinVet',
  'Dentalink', 'Gesden', 'Orisdent', 'Dendoo', 'DasieClinic',
  'Presto', 'Revit', 'BuildingMe', 'Construdata', 'PlanHopper',
  'Kajabi', 'Teachable', 'Moodle', 'Thinkific', 'Classlife',
  'Cliniko', 'Timp', 'Flow', 'Doctoralia', 'AgendaPro',
  'CoverManager', 'Revo', 'LastApp', 'FrontRest', 'MissTipsi',
  'SAP', 'Odoo', 'Sage', 'NetSuite', 'Microsoft Dynamics',
  'Sendcloud', 'ShipStation', 'EasyPost', 'Saloodo', 'Amazon Seller',
  'HubSpot', 'Harvest', 'Pipedrive', 'FreshBooks', 'TemaLeader',
  'Fotocasa', 'Witei', 'Tokko', 'InmoVilla', 'Idealista',
  'Sesame', 'Personio', 'PayFit', 'Factorial', 'Bizneo',
  'Otra',
];

// ─── ToolMultiSelect ──────────────────────────────────────────────────────────
type ToolMultiSelectProps = { selected: string[]; onChange: (values: string[]) => void };

const ToolMultiSelect = ({ selected, onChange }: ToolMultiSelectProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = ALL_TOOLS.filter((t) =>
    t.toLowerCase().includes(search.toLowerCase()),
  );

  const toggle = (tool: string) => {
    onChange(selected.includes(tool) ? selected.filter((s) => s !== tool) : [...selected, tool]);
  };

  const displayValue =
    selected.length === 0
      ? 'Shopify, Odoo, Prestashop, ERP propio…'
      : selected.join(', ');

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger */}
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '10px 14px',
          cursor: 'pointer',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '42px',
          color: selected.length ? '#111' : '#9ca3af',
          fontSize: '0.9rem',
          userSelect: 'none',
        }}
      >
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {displayValue}
        </span>
        <span style={{ marginLeft: '8px', flexShrink: 0, color: '#6b7280' }}>{open ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#fff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 50,
            maxHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid #f0f0f0' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar herramienta…"
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                padding: '6px 10px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            />
          </div>
          {/* Options */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filtered.map((tool) => {
              const isSelected = selected.includes(tool);
              return (
                <div
                  key={tool}
                  onClick={() => toggle(tool)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '9px 14px',
                    cursor: 'pointer',
                    background: isSelected ? '#f5f3ff' : 'transparent',
                    color: isSelected ? '#5b21b6' : '#111',
                    fontSize: '0.875rem',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = '#fafafa';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent';
                  }}
                >
                  <span
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      border: `2px solid ${isSelected ? '#7c3aed' : '#d1d5db'}`,
                      background: isSelected ? '#7c3aed' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  {tool}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '12px 14px', color: '#9ca3af', fontSize: '0.875rem' }}>
                Sin resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Types ────────────────────────────────────────────────────────────────────
type FormData = {
  sectionTitle: string;
  sectionDescription: string;
  title: string;
  send: string;
  legalNotice?: string;
  checkbox: { first: string; second: string; third: string };
  fields: {
    name: { label: string; placeholder: string };
    email: { label: string; placeholder: string };
    tool: { label: string; placeholder: string };
    phone: { label: string; placeholder: string };
    company: { label: string; placeholder: string };
    dataTypes: { label: string; options: string[] };
    problem: { label: string; placeholder: string };
  };
};

// ─── Component ────────────────────────────────────────────────────────────────
type Props = { namespace: string; formEmail: string; formSubject: string };

const IntegrationContactForm = ({ namespace, formEmail, formSubject }: Props) => {
  const t = useTranslations(namespace);
  const form = t.raw('form') as FormData;
  const { title, fields, send, checkbox, legalNotice } = form;

  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;

  return (
    <section
      id="contacto"
      className="px-landing bg-white overflow-hidden"
      style={{ scrollMarginTop: '91px' }}
    >
      {/* Decorative SVG — top right, matches /contacto page */}
      <div style={{ textAlign: 'right', margin: '0 1.3rem 0 0' }}>
        <img
          src={bgSrc}
          alt=""
          aria-hidden="true"
          style={{
            width: '14rem',
            height: '14rem',
            objectFit: 'cover',
            position: 'relative',
            top: '5.5rem',
            zIndex: -1,
          }}
        />
      </div>

      <div className="max-w-[88.875rem] mx-auto">
        <section className="form-section">
          <h2 className="form-h2">{title}</h2>
          <form
            className="form"
            action={`https://formsubmit.co/${formEmail}`}
            method="POST"
          >
            <input type="hidden" name="_subject" value={formSubject} />
            <input type="hidden" name="_captcha" value="false" />
            <input type="hidden" name="_template" value="box" />
            <input type="hidden" name="_cc" value="alfonso.ojeda@gigsonsolutions.com" />
            {/* Pass selected tools as a hidden input */}
            <input type="hidden" name="tool" value={selectedTools.join(', ')} />

            <div className="form-container">
              <div className="input-container">
                <label className="input-container-label">{fields.name.label}</label>
                <input type="text" name="name" required placeholder={fields.name.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.email.label}</label>
                <input type="email" name="email" required placeholder={fields.email.placeholder} />
              </div>

              {/* Tool — multiselect with search */}
              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.tool.label}</label>
                <ToolMultiSelect selected={selectedTools} onChange={setSelectedTools} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.phone.label}</label>
                <input type="tel" name="phone" required placeholder={fields.phone.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.company.label}</label>
                <input type="text" name="company" required placeholder={fields.company.placeholder} />
              </div>

              <div className="input-container">
                <label className="label-budget">{fields.dataTypes.label}</label>
                <div className="form-budget">
                  {fields.dataTypes.options.map((option) => (
                    <label
                      key={option}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <input
                        type="checkbox"
                        name={`data_${option.toLowerCase()}`}
                        value={option}
                        className="input-radio"
                        style={{ flexShrink: 0, width: '16px', height: '16px', padding: 0, boxSizing: 'border-box', borderRadius: '50%' }}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.problem.label}</label>
                <input type="text" name="problem" placeholder={fields.problem.placeholder} />
              </div>

              <div className="input-container form-check">
                <input
                  type="checkbox"
                  required
                  className="input-radio"
                  style={{ flexShrink: 0, width: '16px', height: '16px', padding: 0, boxSizing: 'border-box', borderRadius: '50%' }}
                />
                <label>
                  {checkbox.first}
                  <Link
                    className="legal-policity-form"
                    href="/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {checkbox.second}
                  </Link>
                  {checkbox.third}
                </label>
              </div>
            </div>

            <Button type="submit" name={send} classStyle="form-btn-send" />
          </form>
        </section>

        {legalNotice && (
          <p className="text-smallTag text-dark-medium pb-14 lg:pb-20">{legalNotice}</p>
        )}
      </div>
    </section>
  );
};

export default IntegrationContactForm;
