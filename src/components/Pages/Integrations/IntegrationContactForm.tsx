'use client';

import '../../Form.css';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import Bgcont from '../../../assets/Group 33770.svg';
import Button from '../../../shared/ui/Button';

/* ── Tool list (mirrors the logos grid) ─────────────────────────── */
const TOOL_OPTIONS = [
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

/* ── Multi-select dropdown ───────────────────────────────────────── */
const ToolMultiSelect = ({ placeholder }: { placeholder: string }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, []);

  const toggle = (tool: string) =>
    setSelected(prev =>
      prev.includes(tool) ? prev.filter(t => t !== tool) : [...prev, tool],
    );

  const filtered = TOOL_OPTIONS.filter(t =>
    t.toLowerCase().includes(search.toLowerCase()),
  );

  const displayText = selected.length > 0 ? selected.join(', ') : placeholder;
  const isPlaceholder = selected.length === 0;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
      {/* Hidden field for form submission */}
      <input type="hidden" name="tool" value={selected.join(', ')} />

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          fontSize: '1rem',
          color: isPlaceholder ? 'var(--gs-graphite)' : 'var(--gs-ink)',
          background: 'none',
          border: 'none',
          borderBottom: '0.0625rem solid',
          padding: '0.3rem 0 0.07rem',
          cursor: 'pointer',
          textAlign: 'left',
          fontFamily: 'inherit',
          gap: '0.5rem',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
          {displayText}
        </span>
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        >
          <path d="M2 5L7 10L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 0.5rem)',
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'white',
          border: '1px solid var(--gs-purple)',
          borderRadius: '0.9375rem',
          boxShadow: '0 8px 24px rgba(120,116,244,0.15)',
          overflow: 'hidden',
        }}>
          <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #E0DFDF' }}>
            <input
              type="text"
              placeholder="Buscar herramienta..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onClick={e => e.stopPropagation()}
              autoFocus
              style={{
                display: 'block',
                width: '100%',
                fontSize: '1rem',
                color: 'var(--gs-ink)',
                background: 'transparent',
                border: 'none',
                borderBottom: 'none',
                outline: 'none',
                padding: 0,
                margin: 0,
                fontFamily: 'inherit',
              }}
            />
          </div>
          <div style={{ maxHeight: '240px', overflowY: 'auto' }}>
            {filtered.map(tool => {
              const checked = selected.includes(tool);
              return (
                <label
                  key={tool}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 1rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    color: 'var(--gs-ink)',
                    backgroundColor: checked ? 'var(--gs-lavender)' : 'transparent',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(tool)}
                    onClick={e => e.stopPropagation()}
                    style={{
                      flexShrink: 0,
                      width: '1rem',
                      height: '1rem',
                      padding: 0,
                      boxSizing: 'border-box',
                      borderRadius: '3px',
                      accentColor: 'var(--gs-purple)',
                      cursor: 'pointer',
                    }}
                  />
                  {tool}
                </label>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: '0.75rem 1rem', color: 'var(--gs-graphite)', fontSize: '0.9rem' }}>
                Sin resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Types ────────────────────────────────────────────────────────── */
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

/* ── Checkbox style — overrides Form.css padding that inflates circles ── */
const CHECKBOX_STYLE: React.CSSProperties = {
  flexShrink: 0,
  width: '1rem',
  height: '1rem',
  padding: 0,
  boxSizing: 'border-box',
};

/* ── Component ───────────────────────────────────────────────────── */
type Props = { namespace: string; formEmail: string; formSubject: string };

const IntegrationContactForm = ({ namespace, formEmail, formSubject }: Props) => {
  const t = useTranslations(namespace);
  const form = t.raw('form') as FormData;
  const { title, fields, send, checkbox, legalNotice } = form;

  const bgSrc = typeof Bgcont === 'string' ? Bgcont : (Bgcont as { src: string }).src;

  return (
    <section
      id="contacto"
      className="px-landing bg-white overflow-hidden"
      style={{ scrollMarginTop: '91px' }}
    >
      {/* Decorative SVG — top right, matches /contacto style */}
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
            <input type="hidden" name="_cc" value="emmelin@gigsonsolutions.com" />

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
                <ToolMultiSelect placeholder={fields.tool.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.phone.label}</label>
                <input type="tel" name="phone" required placeholder={fields.phone.placeholder} />
              </div>

              <div className="input-container">
                <label className="input-container-label">{fields.company.label}</label>
                <input type="text" name="company" required placeholder={fields.company.placeholder} />
              </div>

              {/* Data types — checkboxes */}
              <div className="input-container">
                <label className="label-budget">{fields.dataTypes.label}</label>
                <div className="form-budget">
                  {fields.dataTypes.options.map(option => (
                    <label
                      key={option}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <input
                        type="checkbox"
                        name={`data_${option.toLowerCase()}`}
                        value={option}
                        style={CHECKBOX_STYLE}
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>

              {/* Problem */}
              <div className="input-container input-container-text">
                <label className="input-container-label">{fields.problem.label}</label>
                <input type="text" name="problem" placeholder={fields.problem.placeholder} />
              </div>

              {/* Privacy checkbox */}
              <div className="input-container form-check">
                <input
                  type="checkbox"
                  required
                  style={CHECKBOX_STYLE}
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
